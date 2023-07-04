import type { IGraphQLOptions } from '#imports';
import { useMutation } from '#imports';
import type { UseMutationReturn } from '@vue/apollo-composable';
import { mutation } from 'gql-query-builder';
import gql from 'graphql-tag';
import { useNuxtApp } from 'nuxt/app';
import type { GraphQLMeta } from '../classes/graphql-meta.class';

export async function gqlMutation<T = any>(
  method: string,
  options: IGraphQLOptions = {},
): Promise<UseMutationReturn<T, any>> {
  const { $graphQl } = useNuxtApp();

  // Check parameters
  if (!method) {
    throw new Error('No method detected');
  }

  // Get config
  const config = {
    variables: null,
    fields: null,
    log: false,
    ...options,
  };

  const fields = config.fields as unknown as string[];

  if (config.log) {
    console.debug('gqlMutation::fields ', fields);
  }

  const meta = $graphQl() as GraphQLMeta;

  if (!meta) {
    return;
  }

  const argType = meta.getArgs(method);
  const builderInput = {};

  if (config.log) {
    console.debug('gqlMutation::variables ', config.variables);
    console.debug('gqlMutation::type ', config.type);
    console.debug('gqlMutation::argType ', argType);
  }

  for (const [key, value] of Object.entries(argType.fields)) {
    builderInput[key] = {
      type: value.type,
      required: value.isRequired,
      value: config.variables[key],
    };
  }

  if (config.log) {
    console.debug('gqlMutation::builderInput ', builderInput);
  }

  const queryBody = mutation({
    operation: method,
    variables: builderInput,
    fields,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.debug('gqlMutation::queryBody ', queryBody);
    console.debug('gqlMutation::query ', queryBody.query);
    console.debug('gqlMutation::documentNode ', documentNode);
  }

  return useMutation<T>(documentNode, { variables: config.variables });
}
