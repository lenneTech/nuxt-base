import { useAsyncQuery, useLazyAsyncQuery } from '#imports';
import { query } from 'gql-query-builder';
import gql from 'graphql-tag';
import { type AsyncData, useNuxtApp } from 'nuxt/app';

import type { GraphQLMeta } from '../classes/graphql-meta.class';
import type { IGraphQLOptions } from '../interfaces/graphql-options.interface';

import { hashPasswords } from '../functions/graphql-meta';

export async function gqlQuery<T = any>(method: string, options: IGraphQLOptions = {}): Promise<AsyncData<T, any>> {
  const useGqlMeta = () => {
    const nuxtApp = useNuxtApp();

    if (!nuxtApp._meta) {
      throw new Error('GraphQLMeta is not available.');
    }

    return nuxtApp?._meta as GraphQLMeta;
  };

  // Check parameters
  if (!method) {
    throw new Error('No method detected');
  }

  // Get config
  const config = {
    fields: null,
    lazy: false,
    log: false,
    variables: null,
    ...options,
    hashPasswords: options.hashPasswords ?? true,
  };

  const fields = config.fields as unknown as string[];

  if (config.log) {
    console.debug('gqlQuery::fields ', fields);
    console.debug('gqlQuery::variables ', config.variables);
  }

  const meta = useGqlMeta();

  if (config.hashPasswords) {
    config.variables = await hashPasswords(config.variables);
  }

  const argType = meta.getArgs(method);
  const builderInput = {};
  const metaFields = meta.getFields(method);
  const availableFields = [];
  const variables = meta.parseVariables(config.variables, argType.fields, config.log);

  if (!fields) {
    for (const [key] of Object.entries(metaFields.fields)) {
      if (Object.keys(metaFields.fields[key].fields).length) {
        if (metaFields.fields[key].fields['id']) {
          const subObject = {};
          subObject[key] = ['id'];
          availableFields.push(subObject);
        } else {
          const subObject = {};
          const subFields = [];
          for (const [subKey] of Object.entries(metaFields.fields[key].fields)) {
            if (!Object.keys(metaFields.fields[key].fields[subKey].fields).length) {
              subFields.push(subKey);
            }
          }
          subObject[key] = subFields;
          availableFields.push(subObject);
        }
      } else {
        availableFields.push(key);
      }
    }
  }

  for (const [key, value] of Object.entries(argType.fields)) {
    let type: string;

    if (value.isList) {
      type = value.isItemRequired ? `${value.type}!` : value.type;
    } else {
      type = value.isRequired ? `${value.type}!` : value.type;
    }

    builderInput[key] = {
      list: value.isList,
      type,
      value: variables[key],
    };
  }

  if (config.log) {
    console.debug('gqlQuery::builderInput ', builderInput);
    console.debug('gqlQuery::availableFields ', availableFields);
  }

  const queryBody = query({
    fields: fields !== null ? fields : availableFields,
    operation: method,
    variables: builderInput,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.debug('gqlQuery::queryBody ', queryBody);
    console.debug('gqlQuery::query ', queryBody.query);
    console.debug('gqlQuery::documentNode ', documentNode);
  }

  const queryConfig = {
    cache: false,
    fetchPolicy: 'no-cache',
    query: documentNode,
    variables: variables,
  };

  return config.lazy ? useLazyAsyncQuery<T>(queryConfig) : useAsyncQuery<T>(queryConfig);
}
