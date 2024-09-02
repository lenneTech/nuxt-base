import type { AsyncData } from 'nuxt/app';

import { mutation } from 'gql-query-builder';
import gql from 'graphql-tag';
import { useAsyncData, useNuxtApp } from 'nuxt/app';

import type { IGraphQLOptions } from '../interfaces/graphql-options.interface';

import { hashPasswords } from '../functions/graphql-meta';
import { useAuthState } from '../states/auth';
import { useAuth } from './use-auth';

export async function gqlMutation<T = any>(method: string, options: IGraphQLOptions = {}): Promise<AsyncData<T, Error>> {
  const { $graphql, _meta } = useNuxtApp();
  const { accessTokenState, refreshTokenState } = useAuthState();
  const { checkTokenAndRenew } = useAuth();

  // Check parameters
  if (!method) {
    throw new Error('No method detected');
  }

  // Get config
  const config = {
    disableTokenCheck: false,
    fields: null,
    log: false,
    variables: null,
    ...options,
    hashPasswords: options.hashPasswords ?? true,
  };

  const fields = config.fields as unknown as string[];

  if (config.log) {
    console.debug('gqlMutation::fields ', fields);
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

  if (config.log) {
    console.debug('gqlMutation::variables ', config.variables);
    console.debug('gqlMutation::argType ', argType);
  }

  if (config.log) {
    console.debug('gqlMutation::mapped_variables ', variables);
  }

  for (const [key, value] of Object.entries(argType.fields)) {
    let type: string;

    if (value.isList) {
      type = value.isItemRequired ? `${value.type}!` : value.type;
    } else {
      type = value.isRequired ? `${value.type}!` : value.type;
    }

    if (config.log) {
      console.debug('gqlMutation::isRequired ', value.isRequired);
      console.debug('gqlMutation::isItemRequired ', value.isItemRequired);
      console.debug('gqlMutation::isList ', value.isList);
      console.debug('gqlMutation::key ', key);
      console.debug('gqlMutation::value ', value);
      console.debug('gqlMutation::type ', type);
    }

    builderInput[key] = {
      list: value.isList,
      type,
      value: variables[key],
    };
  }

  if (config.log) {
    console.debug('gqlMutation::builderInput ', builderInput);
    console.debug('gqlMutation::availableFields ', availableFields);
  }

  const queryBody = mutation({
    fields: fields !== null ? fields : availableFields,
    operation: method,
    variables: builderInput,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.debug('gqlMutation::queryBody ', queryBody);
    console.debug('gqlMutation::query ', queryBody.query);
    console.debug('gqlMutation::documentNode ', documentNode);
  }

  if (method !== 'refreshToken' || !config.disableTokenCheck) {
    await checkTokenAndRenew();
  }

  const requestHeaders = {
    authorization: `Bearer ${method === 'refreshToken' ? refreshTokenState.value : accessTokenState.value}`,
  };

  return useAsyncData(async () => {
    return await $graphql.default.request(documentNode, variables, requestHeaders);
  });
}
