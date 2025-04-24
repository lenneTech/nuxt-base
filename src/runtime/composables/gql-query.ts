import { query } from 'gql-query-builder';
import gql from 'graphql-tag';
import { callWithNuxt, useNuxtApp } from 'nuxt/app';

import type { GraphqlError } from '../interfaces/graphql-error.interface';
import type { IGraphQLOptions } from '../interfaces/graphql-options.interface';

import { hashPasswords } from '../functions/graphql-meta';
import { useAuthState } from '../states/auth';
import { useAuth } from './use-auth';
import { useRequestOptions } from './use-request-options';

export async function gqlQuery<T = any>(method: string, options: IGraphQLOptions = {}): Promise<{ data: T; error: GraphqlError | null }> {
  const { $graphql, _meta } = useNuxtApp();
  const _nuxtApp = useNuxtApp();
  const { accessTokenState } = useAuthState();
  const { checkTokenAndRenew } = useAuth();
  const { getHeaders } = useRequestOptions();

  // Check parameters
  if (!method) {
    throw new Error('No method detected');
  }

  // Get config
  const config = {
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
      type = value.isRequired ? `[${type}]!` : `[${type}]`;
    } else {
      type = value.isRequired ? `${value.type}!` : value.type;
    }

    if (config.log) {
      console.debug('gqlQuery::isRequired ', value.isRequired);
      console.debug('gqlQuery::isItemRequired ', value.isItemRequired);
      console.debug('gqlQuery::isList ', value.isList);
      console.debug('gqlQuery::key ', key);
      console.debug('gqlQuery::value ', value);
      console.debug('gqlQuery::type ', type);
    }

    builderInput[key] = {
      list: false,
      required: false,
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

  const requestHeaders: Record<string, string> = {
    ...getHeaders(),
    ...(options.headers || {}),
    authorization: `Bearer ${accessTokenState.value}`,
  };

  let data = null;
  let error = null;
  try {
    data = await $graphql.default.request(documentNode, variables, requestHeaders);

    if (data) {
      // check if data[method] is boolean value
      if (typeof data[method] === 'boolean' || typeof data[method] === 'number') {
        data = data[method];
      } else {
        // check if data has key method
        data = Object.keys(data)?.find((key) => key === method) ? data[method] : data;
      }
    }
  } catch (err) {
    console.error('gqlQuery::error ', err);
    if (err?.response?.errors?.length) {
      error = err.response?.errors[0]?.extensions?.originalError;
    } else {
      error = err;
    }
  }

  return { data, error };
}
