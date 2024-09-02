import { query } from 'gql-query-builder';
import gql from 'graphql-tag';
import { type AsyncData, callWithNuxt, useAsyncData, useNuxtApp } from 'nuxt/app';

import type { IGraphQLOptions } from '../interfaces/graphql-options.interface';

import { hashPasswords } from '../functions/graphql-meta';
import { useAuthState } from '../states/auth';
import { useAuth } from './use-auth';

export async function gqlQuery<T = any>(method: string, options: IGraphQLOptions = {}): Promise<AsyncData<T, Error>> {
  const { $graphql, _meta } = useNuxtApp();
  const _nuxtApp = useNuxtApp();
  const { accessTokenState } = useAuthState();
  const { checkTokenAndRenew } = useAuth();

  // Check parameters
  if (!method) {
    throw new Error('No method detected');
  }

  // Get config
  const config = {
    asyncDataOptions: {
      lazy: false,
    },
    fields: null,
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

  if (!_meta) {
    throw new Error('GraphQLMeta is not available.');
  }

  if (config.hashPasswords) {
    config.variables = await hashPasswords(config.variables);
  }

  const argType = _meta.getArgs(method);
  const builderInput = {};
  const metaFields = _meta.getFields(method);
  const availableFields = [];
  const variables = _meta.parseVariables(config.variables, argType.fields, config.log);

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

  await callWithNuxt(_nuxtApp, checkTokenAndRenew);

  const requestHeaders = {
    authorization: `Bearer ${accessTokenState.value}`,
  };

  return useAsyncData(
    method,
    async () => {
      return await $graphql.default.request(documentNode, variables, requestHeaders);
    },
    options.asyncDataOptions,
  );
}
