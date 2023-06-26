import { generate } from "@graphql-codegen/cli";
import { Types } from "@graphql-codegen/plugin-helpers";
import { buildClientSchema, getIntrospectionQuery } from "graphql";
import { ofetch } from "ofetch";
import type { Import } from "unimport";
import { GraphQLMeta } from "./runtime/classes/graphql-meta.class";
const { loadSchema } = require("@graphql-tools/load");
const { GraphQLFileLoader } = require("@graphql-tools/graphql-file-loader");

export async function loadMetaServer(
  config: Partial<{ public: { host: string; schema?: string } }>
): Promise<GraphQLMeta> {
  let schema;

  if (!config.public.schema) {
    const { data: result } = await ofetch(config.public.host, {
      method: "POST",
      body: JSON.stringify({
        query: getIntrospectionQuery({ descriptions: false }),
        variables: {},
      }),
    });

    schema = buildClientSchema(result);
  } else {
    schema = await loadSchema(config.public.schema, {
      loaders: [new GraphQLFileLoader()],
    });
  }

  return new GraphQLMeta(schema);
}

export default async function generateGraphQLTypes(schema: string) {
  const config: Types.Config = {
    schema,
    ignoreNoDocuments: true,
    generates: {
      [process.cwd() + "/src/types/schema.d.ts"]: {
        plugins: ["typescript"],
      },
    },
  };

  return await generate(config, false);
}

export async function generateComposables(meta: GraphQLMeta): Promise<string> {
  const methods = meta.getMethodNames();
  const template = [];
  let customTypes = [];
  template.push("import { useGraphQL } from '#imports'\n");
  template.push("import type { AsyncData } from 'nuxt/dist/app/composables'\n");
  template.push(
    'import { UseMutationReturn, UseQueryReturn, UseSubscriptionReturn } from "@vue/apollo-composable"\n'
  );

  if (methods?.query) {
    for (const query of methods.query) {
      const types = meta.getTypesForMethod(query, "Query");
      customTypes.push(types.customTypes);

      template.push(
        `  export const use${capitalizeFirstLetter(query)}Query = (${
          types.argType ? "args: {" + types.argType + "}," : ""
        } fields: any[], log?: boolean): Promise<AsyncData<{${query}: ${
          types.returnType
        }}, any>> => useGraphQL<AsyncData<{${query}: ${
          types.returnType
        }}, any>>('${query}', {${
          types.argType ? "arguments: args," : ""
        } fields, log})`
      );
    }
  }

  if (methods?.mutation) {
    for (const mutation of methods.mutation) {
      const types = meta.getTypesForMethod(mutation, "Mutation");
      customTypes.push(types.customTypes);

      template.push(
        `  export const use${capitalizeFirstLetter(mutation)}Mutation = (${
          types.argType ? "args: {" + types.argType + "}," : ""
        } fields: any[], log?: boolean): Promise<AsyncData<{${mutation}: ${
          types.returnType
        }}, any>> => useGraphQL<AsyncData<{${mutation}: ${
          types.returnType
        }}, any>>('${mutation}', {${
          types.argType ? "arguments: args," : ""
        } fields, log})`
      );
    }
  }

  if (methods?.subscription) {
    for (const subscription of methods.subscription) {
      const types = meta.getTypesForMethod(subscription, "Subscription");
      customTypes.push(types.customTypes);

      template.push(
        `  export const use${capitalizeFirstLetter(
          subscription
        )}Subscription = (${
          types.argType ? "args: {" + types.argType + "}," : ""
        } fields: any[], log?: boolean): Promise<AsyncData<{${subscription}: ${
          types.returnType
        }}, any>> => useGraphQL<AsyncData<{${subscription}: ${
          types.returnType
        }}, any>>('${subscription}', {${
          types.argType ? "arguments: args," : ""
        } fields, log})`
      );
    }
  }

  customTypes = [...new Set([].concat(...customTypes))];

  if (customTypes.length) {
    template.unshift(`import {${customTypes.join(", ")}} from "#base/default"`);
  }

  return template.join("\n");
}

export async function getAllMethods(meta: GraphQLMeta) {
  const methods = meta.getMethodNames();
  return [
    ...methods.query.map(
      (fn): Import => ({ from: "#base", name: getMethodName(fn, "Query") })
    ),
    ...methods.mutation.map(
      (fn): Import => ({ from: "#base", name: getMethodName(fn, "Mutation") })
    ),
    ...methods.subscription.map(
      (fn): Import => ({
        from: "#base",
        name: getMethodName(fn, "Subscription"),
      })
    ),
  ];
}

function getMethodName(method: string, type: string) {
  return "use" + capitalizeFirstLetter(method) + type;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
