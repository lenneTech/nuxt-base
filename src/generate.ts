import { generate } from '@graphql-codegen/cli';
import type { Types } from '@graphql-codegen/plugin-helpers';
import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import { ofetch } from 'ofetch';
import type { Import } from 'unimport';
import { GraphQLMeta } from './runtime/classes/graphql-meta.class';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { loadSchema } = require('@graphql-tools/load');
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

export async function loadMetaServer(
  config: Partial<{ public: { host: string; schema?: string } }>,
): Promise<GraphQLMeta> {
  let schema;

  if (!config.public.schema) {
    const { data: result } = await ofetch(config.public.host, {
      method: 'POST',
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
      [process.cwd() + '/src/types/schema.d.ts']: {
        plugins: ['typescript'],
      },
    },
  };

  return await generate(config, false);
}

export async function generateComposables(meta: GraphQLMeta): Promise<string> {
  const methods = meta.getMethodNames();
  const template = [];
  let customTypes = [];
  template.push(
    'import { gqlQuery, gqlMutation, gqlSubscription } from \'#imports\'\n',
  );
  template.push('import type { AsyncData } from \'nuxt/dist/app/composables\'\n');
  template.push(
    'import { UseMutationReturn, UseSubscriptionReturn } from "@vue/apollo-composable"\n',
  );

  if (methods?.query) {
    for (const query of methods.query) {
      const types = meta.getTypesForMethod(query, 'Query');
      customTypes.push(types.customTypes);

      template.push(
        `  export const use${capitalizeFirstLetter(query)}Query = (${
          types.argType ? 'variables: {' + types.argType + '},' : ''
        } fields: any[], log?: boolean): Promise<AsyncData<{${query}: ${
          types.returnType
        }}, any>> => gqlQuery<{${query}: ${types.returnType}}>('${query}', {${
          types.argType ? 'variables: variables,' : ''
        } fields, log})`,
      );
    }
  }

  if (methods?.mutation) {
    for (const mutation of methods.mutation) {
      const types = meta.getTypesForMethod(mutation, 'Mutation');
      customTypes.push(types.customTypes);

      template.push(
        `  export const use${capitalizeFirstLetter(mutation)}Mutation = (${
          types.argType ? 'variables: {' + types.argType + '},' : ''
        } fields: any[], log?: boolean): Promise<UseMutationReturn<{${mutation}: ${
          types.returnType
        }}, any>> => gqlMutation<{${mutation}: ${
          types.returnType
        }}>('${mutation}', {${
          types.argType ? 'variables: variables,' : ''
        } fields, log})`,
      );
    }
  }

  if (methods?.subscription) {
    for (const subscription of methods.subscription) {
      const types = meta.getTypesForMethod(subscription, 'Subscription');
      customTypes.push(types.customTypes);

      template.push(
        `  export const use${capitalizeFirstLetter(
          subscription,
        )}Subscription = (${
          types.argType ? 'variables: {' + types.argType + '},' : ''
        } fields: any[], log?: boolean): Promise<UseSubscriptionReturn<{${subscription}: ${
          types.returnType
        }}, any>> => gqlSubscription<{${subscription}: ${
          types.returnType
        }}>('${subscription}', {${
          types.argType ? 'variables: variables,' : ''
        } fields, log})`,
      );
    }
  }

  customTypes = [...new Set([].concat(...customTypes))];

  if (customTypes.length) {
    template.unshift(`import {${customTypes.join(', ')}} from "#base/default"`);
  }

  return template.join('\n');
}

export async function getAllImports(meta: GraphQLMeta) {
  const methods = meta.getMethodNames();
  let customTypes = [];

  for (const method of methods.query) {
    const types = meta.getTypesForMethod(method, 'Query');
    customTypes = [...customTypes, ...types.customTypes];
  }

  for (const method of methods.mutation) {
    const types = meta.getTypesForMethod(method, 'Mutation');
    customTypes = [...customTypes, ...types.customTypes];
  }

  for (const method of methods.subscription) {
    const types = meta.getTypesForMethod(method, 'Subscription');
    customTypes = [...customTypes, ...types.customTypes];
  }

  customTypes = [...new Set([].concat(...customTypes))];

  return [
    ...customTypes.map(
      (type): Import => ({ from: '#base', name: type }),
    ),
    ...methods.query.map(
      (fn): Import => ({ from: '#base', name: getMethodName(fn, 'Query') }),
    ),
    ...methods.mutation.map(
      (fn): Import => ({ from: '#base', name: getMethodName(fn, 'Mutation') }),
    ),
    ...methods.subscription.map(
      (fn): Import => ({
        from: '#base',
        name: getMethodName(fn, 'Subscription'),
      }),
    ),
  ];
}

function getMethodName(method: string, type: string) {
  return 'use' + capitalizeFirstLetter(method) + type;
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
