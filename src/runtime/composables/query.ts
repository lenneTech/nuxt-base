import type { IGraphQLOptions } from '#imports';
import { useAsyncQuery } from '#imports';
import { query } from 'gql-query-builder';
import gql from 'graphql-tag';
import type { AsyncData } from 'nuxt/app';
import { useNuxtApp } from 'nuxt/app';
import type { GraphQLMeta } from '../classes/graphql-meta.class';

export async function gqlQuery<T = any>(
  method: string,
  options: IGraphQLOptions = {},
): Promise<AsyncData<T, any>> {
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
    console.debug('gqlQuery::fields ', fields);
    console.debug('gqlQuery::variables ', config.variables);
  }

  const meta = $graphQl() as GraphQLMeta;
  const queryBody = query({
    operation: method,
    variables: config.variables,
    fields,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.debug('gqlQuery::queryBody ', queryBody);
    console.debug('gqlQuery::query ', queryBody.query);
    console.debug('gqlQuery::documentNode ', documentNode);
  }

  return useAsyncQuery<T>(documentNode, config.variables ?? {});
}
