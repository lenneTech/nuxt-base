import { query } from 'gql-query-builder';
import gql from 'graphql-tag';
import { useAsyncData, useNuxtApp } from 'nuxt/app';
import type { GraphQLMeta } from '../classes/graphql-meta.class';
import type { IGraphQLOptions } from '../interfaces/graphql-options.interface';
import { useAsyncQuery } from '#imports';

export async function gqlQuery<T = any>(
  method: string,
  options: IGraphQLOptions = {},
) {
  const _nuxt = useNuxtApp();
  const { $graphQl } = _nuxt;

  // Check parameters
  if (!method) {
    throw new Error('No method detected');
  }

  // Get config
  const config = {
    variables: null,
    fields: null,
    log: false,
    asyncDataOptions: {},
    ...options,
  };

  const fields = config.fields as unknown as string[];

  if (config.log) {
    console.debug('gqlQuery::fields ', fields);
    console.debug('gqlQuery::variables ', config.variables);
  }

  const meta = $graphQl() as GraphQLMeta;

  if (!meta) {
    return;
  }

  const argType = meta.getArgs(method);
  const builderInput = {};
  const metaFields = meta.getFields(method);
  const availableFields = [];

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
      type,
      list: value.isList,
      value: config.variables[key],
    };
  }

  if (config.log) {
    console.debug('gqlQuery::builderInput ', builderInput);
    console.debug('gqlQuery::availableFields ', availableFields);
  }

  const queryBody = query({
    operation: method,
    variables: builderInput,
    fields: fields !== null ? fields : availableFields,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.debug('gqlQuery::queryBody ', queryBody);
    console.debug('gqlQuery::query ', queryBody.query);
    console.debug('gqlQuery::documentNode ', documentNode);
  }

  return useAsyncData<T>(async () => {
    const { data } = await useAsyncQuery<T>(documentNode, config.variables ?? {});
    return data?.value || null;
  }, options.asyncDataOptions);
}
