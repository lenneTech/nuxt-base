import type { IGraphQLOptions } from '#imports';
import { useSubscription } from '#imports';
import type { UseSubscriptionReturn } from '@vue/apollo-composable';
import { subscription } from 'gql-query-builder';
import gql from 'graphql-tag';
import { useNuxtApp } from 'nuxt/app';
import type { GraphQLMeta } from '../classes/graphql-meta.class';

export async function gqlSubscription<T = any>(
  method: string,
  options: IGraphQLOptions = {},
): Promise<UseSubscriptionReturn<T, any>> {
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
  const meta = $graphQl() as GraphQLMeta;

  if (!meta) {
    return;
  }

  const argType = meta.getArgs(method);
  const builderInput = {};

  for (const [key, value] of Object.entries(argType.fields)) {
    builderInput[key] = {
      type: value.isRequired ? `${value.type}!` : value.type,
      list: value.isList,
      value: config.variables[key],
    };
  }

  if (config.log) {
    console.debug('gqlMutation::builderInput ', builderInput);
  }

  const queryBody = subscription({
    operation: method,
    variables: builderInput,
    fields,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.debug('gqlSubscription::fields ', fields);
    console.debug('gqlSubscription::queryBody ', queryBody);
    console.debug('gqlSubscription::query ', queryBody.query);
    console.debug('gqlSubscription::documentNode ', documentNode);
  }

  return useSubscription<T>(documentNode, config.variables ?? {});
}
