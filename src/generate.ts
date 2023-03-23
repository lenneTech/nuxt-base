import { generate } from "@graphql-codegen/cli";
import { Types } from "@graphql-codegen/plugin-helpers";
import type { Import } from "unimport";
import { getMeta } from "./functions/graphql-meta";

export default async function generateGraphQLTypes(schemaUrl: string) {
  const config: Types.Config = {
    schema: schemaUrl,
    ignoreNoDocuments: true,
    generates: {
      [process.cwd() + "/src/types/schema.d.ts"]: {
        plugins: ["typescript"],
      },
    },
  };

  return await generate(config, false);
}

export async function generateComposables(host: string): Promise<string> {
  const schemaMeta = await getMeta(host);
  const methods = schemaMeta.getMethodNames();
  const template = [];
  let customTypes = [];
  template.push(`declare module '#base' {`);

  if (methods?.query) {
    for (const query of methods.query) {
      const types = schemaMeta.getTypesForMethod(query, "Query");
      customTypes.push(types.customTypes);

      template.push(
        `  export const use${capitalizeFirstLetter(query)}Query: (${
          types.argType ? "args: {" + types.argType + "}," : ""
        } fields: any[]) => ${types.returnType}`
      );
    }
  }

  if (methods?.mutation) {
    for (const mutation of methods.mutation) {
      const types = schemaMeta.getTypesForMethod(mutation, "Mutation");
      customTypes.push(types.customTypes);

      template.push(
        `  export const use${capitalizeFirstLetter(
          mutation
        )}Mutation: (${
          types.argType ? "args: {" + types.argType + "}," : ""
        } fields: any[]) => ${
          types.returnType
        }`
      );
    }
  }

  if (methods?.subscription) {
    for (const subscription of methods.subscription) {
      const types = schemaMeta.getTypesForMethod(subscription, "Subscription");
      customTypes.push(types.customTypes);

      template.push(
        `  export const use${capitalizeFirstLetter(
          subscription
        )}Subscription: (${
          types.argType ? "args: {" + types.argType + "}," : ""
        } fields: any[]) => ${types.returnType}`
      );
    }
  }
  template.push(`}`);

  customTypes = [...new Set([].concat(...customTypes))];
  
  if (customTypes.length) {
    template.unshift(`import {${customTypes.join(', ')}} from "#base/default"\n`)
  }

  return template.join("\n");
}

export async function generateFunctions(host: string) {
  const schemaMeta = await getMeta(host);
  const methods = schemaMeta.getMethodNames();
  const template = [];
  template.push('import { useGraphQL } from \'#imports\'\n')

  if (methods?.query) {
    for (const query of methods.query) {
      const types = schemaMeta.getTypesForMethod(query, "Query");

      template.push(
        `export const use${capitalizeFirstLetter(query)}Query = (${
          types.argType ? "args," : ""
        } fields) => useGraphQL()('${query}', {args, fields})`
      );
    }
  }

  return template.join('\n');
}

export async function getAllMethods(host: string) {
  const meta = await getMeta(host);
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
