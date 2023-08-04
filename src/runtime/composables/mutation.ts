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

  if (config.log) {
    console.debug('gqlMutation::variables ', config.variables);
    console.debug('gqlMutation::type ', config.type);
    console.debug('gqlMutation::argType ', argType);
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
    console.debug('gqlMutation::builderInput ', builderInput);
    console.debug('gqlMutation::availableFields ', availableFields);
  }

  const queryBody = mutation({
    operation: method,
    variables: builderInput,
    fields: fields !== null ? fields : availableFields,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.debug('gqlMutation::queryBody ', queryBody);
    console.debug('gqlMutation::query ', queryBody.query);
    console.debug('gqlMutation::documentNode ', documentNode);
  }

  return useMutation<T>(documentNode, { variables: config.variables });
}
