import type { Types } from '@graphql-codegen/plugin-helpers';
import type { Import } from 'unimport';

import { generate } from '@graphql-codegen/cli';
import { addTemplate } from '@nuxt/kit';
import { buildClientSchema, getIntrospectionQuery } from 'graphql';
import { ofetch } from 'ofetch';

import { GraphQLMeta } from './runtime/classes/graphql-meta.class';
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { loadSchema } = require('@graphql-tools/load');
// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');

export async function loadMetaServer(config: Partial<{ public: { host: string; schema?: string } }>): Promise<GraphQLMeta> {
  if (!config || !config.public) {
    throw new Error('Invalid configuration object');
  }

  let schema;

  if (!config.public.schema) {
    if (!config.public.host) {
      throw new Error('Host is not defined in the configuration');
    }

    const { data: result } = await ofetch(config.public.host, {
      body: JSON.stringify({
        query: getIntrospectionQuery({ descriptions: false }),
        variables: {},
      }),
      method: 'POST',
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
    config: {
      declarationKind: 'interface',
      maybeValue: 'T',
      namingConvention: {
        enumValues: 'change-case-all#upperCase',
      },
      primitives: {
        Any: 'any',
        Boolean: 'boolean',
        Date: 'Date',
        DateTime: 'Date',
        Float: 'number',
        ID: 'string',
        Int: 'number',
        JSON: '{ [key: string]: any }',
        String: 'string',
        Upload: 'File',
      },
      scalars: {},
      skipTypename: true,
      useTypeImports: true,
    },
    generates: {
      [process.cwd() + '/src/types/schema.d.ts']: {
        plugins: ['typescript'],
      },
    },
    ignoreNoDocuments: true,
    schema,
  };

  return await generate(config, false);
}

export async function generateComposables(meta: GraphQLMeta): Promise<string> {
  const methods = meta.getMethodNames();
  const template = [];
  const defaultTypes = ['boolean', 'string', 'date', 'int', 'number', 'float'];
  let customTypes = [];
  template.push('import type { InputFields } from \'#base-types/fields\';\n');
  template.push('import { gqlQuery, gqlMutation, gqlSubscription } from \'#imports\';\n');
  template.push('import { UseMutationReturn, UseSubscriptionReturn } from \'@vue/apollo-composable\';\n');
  template.push('import type { AsyncData } from \'nuxt/app\';');

  if (methods?.query) {
    for (const query of methods.query) {
      const types = meta.getTypesForMethod(query, 'Query');
      customTypes.push(types.customTypes);
      const inputFieldsType = types.returnType.replace('[]', '');
      const returnTypeIsDefaultType = defaultTypes.includes(types.returnType.toLowerCase());

      console.log('inputFieldsType', inputFieldsType);
      console.log('returnTypeIsDefaultType', returnTypeIsDefaultType);

      template.push(
        `export const use${capitalizeFirstLetter(query)}Query = (${
          types.argType ? 'variables: { ' + types.argType + ' },' : ''
        } ${returnTypeIsDefaultType ? '' : `fields?: InputFields<${inputFieldsType}>[] | null,`} lazy?: boolean, log?: boolean): Promise<AsyncData<{${query}: ${
          types.returnType
        }}, any>> => gqlQuery<{${query}: ${types.returnType}}>('${query}', {${types.argType ? 'variables,' : ''} ${returnTypeIsDefaultType ? 'fields: null' : 'fields'}, lazy, log})`,
      );
    }
  }

  if (methods?.mutation) {
    for (const mutation of methods.mutation) {
      const types = meta.getTypesForMethod(mutation, 'Mutation');
      if (types.customTypes) {
        customTypes.push(types.customTypes);
      }
      const inputFieldsType = types.returnType.replace('[]', '');
      template.push(
        `export const use${capitalizeFirstLetter(mutation)}Mutation = (${
          types.argType ? 'variables: { ' + types.argType + ' },' : ''
        } fields?: InputFields<${inputFieldsType}>[] | null, log?: boolean): Promise<UseMutationReturn<{${mutation}: ${types.returnType}}, any>> => gqlMutation<{${mutation}: ${
          types.returnType
        }}>('${mutation}', {${types.argType ? 'variables,' : ''} fields, log})`,
      );
    }
  }

  if (methods?.subscription) {
    for (const subscription of methods.subscription) {
      const types = meta.getTypesForMethod(subscription, 'Subscription');
      if (types.customTypes) {
        customTypes.push(types.customTypes);
      }
      const inputFieldsType = types.returnType.replace('[]', '');

      template.push(
        `export const use${capitalizeFirstLetter(subscription)}Subscription = (${
          types.argType ? 'variables: { ' + types.argType + ' },' : ''
        } fields?: InputFields<${inputFieldsType}>[] | null, log?: boolean): Promise<UseSubscriptionReturn<{${subscription}: ${
          types.returnType
        }}, any>> => gqlSubscription<{${subscription}: ${types.returnType}}>('${subscription}', {${types.argType ? 'variables,' : ''} fields, log})`,
      );
    }
  }

  console.log('customTypes', customTypes);

  customTypes = [...new Set([].concat(...customTypes))];

  // Remove type upload
  customTypes = customTypes.filter((e) => e !== 'Upload');

  if (customTypes.length) {
    template.unshift(`import {${customTypes.join(', ')}} from "./default"`);
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
    ...customTypes.map((type): Import => ({ from: '#base/default', name: type })),
    ...methods.query.map((fn): Import => ({ from: '#base', name: getMethodName(fn, 'Query') })),
    ...methods.mutation.map((fn): Import => ({ from: '#base', name: getMethodName(fn, 'Mutation') })),
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

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export async function generateFiles(options: any, logger: any, nuxt: any, resolver: any) {
  try {
    const meta = await loadMetaServer({ public: options });

    // Generate graphql types
    const generatedTypes = await generateGraphQLTypes(options.schema ?? options.host);
    addTemplate({
      filename: nuxt.options.rootDir + '/src/base/default.ts',
      getContents: () => generatedTypes[0].content || '',
      write: true,
    });
    logger.success('[@lenne.tech/nuxt-base] Generated base/default.ts');

    // Generate composable types
    const composables = await generateComposables(meta);

    console.log('composables', composables);

    addTemplate({
      filename: nuxt.options.rootDir + '/src/base/index.ts',
      getContents: () => composables || '',
      write: true,
    });
    logger.success('[@lenne.tech/nuxt-base] Generated base/index.ts');

    // Generate imports
    if (options?.autoImport) {
      nuxt.hook('imports:extend', async (imports) => {
        const methods = await getAllImports(meta);
        imports.push(...(methods || []));
      });

      nuxt.options.alias['#base'] = resolver.resolve(nuxt.options.rootDir, 'src', 'base');

      nuxt.options.alias['#base/*'] = resolver.resolve(nuxt.options.rootDir, 'src', 'base', '*');
    }
  } catch (e) {
    console.error(e);
    logger.warn('[@lenne.tech/nuxt-base] Generated failed. Please check your host.');
  }
}
