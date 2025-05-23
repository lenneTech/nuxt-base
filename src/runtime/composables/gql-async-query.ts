import { query } from 'gql-query-builder';
import gql from 'graphql-tag';
import { type AsyncData, callWithNuxt, useAsyncData, useNuxtApp } from 'nuxt/app';

import type { IGraphQLOptions } from '../interfaces/graphql-options.interface';

import { hashPasswords } from '../functions/graphql-meta';
import { useAuthState } from '../states/auth';
import { useAuth } from './use-auth';
import { useHelper } from './use-helper';
import { useRequestOptions } from './use-request-options';

export async function gqlAsyncQuery<T = any>(method: string, options: IGraphQLOptions = {}): Promise<AsyncData<T, Error>> {
  const { $graphql, _meta } = useNuxtApp();
  const _nuxtApp = useNuxtApp();
  const { accessTokenState } = useAuthState();
  const { checkTokenAndRenew } = useAuth();
  const { generateUniqueHash } = useHelper();
  const { headers } = useRequestOptions();

  // Check parameters
  if (!method) {
    throw new Error('No method detected');
  }

  return useAsyncData(
    method + generateUniqueHash(),
    async () => {
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

      // check if config.variables is a function
      if (typeof config.variables === 'function') {
        config.variables = config.variables();
      }

      if (config.hashPasswords) {
        config.variables = await hashPasswords(config.variables);
      }

      const fields = config.fields as unknown as string[];

      if (config.log) {
        console.debug('gqlQuery::fields ', fields);
        console.debug('gqlQuery::variables ', config.variables);
      }

      if (!_meta) {
        throw new Error('GraphQLMeta is not available.');
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

      const requestHeaders: Record<string, string> = {
        ...headers.value,
        ...(options.headers || {}),
        authorization: `Bearer ${accessTokenState.value}`,
      };

      let result = await $graphql.default.request(documentNode, variables, requestHeaders);

      if (!result) {
        return result;
      }

      // check if data[method] is boolean value
      if (typeof result[method] === 'boolean') {
        result = result[method];
      } else {
        // check if data has key method
        result = Object.keys(result)?.find((key) => key === method) ? result[method] : result;
      }

      return result;
    },
    options.asyncDataOptions,
  );
}
