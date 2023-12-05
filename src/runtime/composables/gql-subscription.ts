import { sha256 } from 'js-sha256';
import type { IGraphQLOptions } from '../interfaces/graphql-options.interface';
import type { UseSubscriptionReturn } from '@vue/apollo-composable';
import { useSubscription } from '@vue/apollo-composable';
import { subscription } from 'gql-query-builder';
import gql from 'graphql-tag';
import { callWithNuxt, useNuxtApp } from 'nuxt/app';
import type { GraphQLMeta } from '../classes/graphql-meta.class';

export async function gqlSubscription<T = any>(
  method: string,
  options: IGraphQLOptions = {},
): Promise<UseSubscriptionReturn<T, any>> {
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
    ...options,
  };

  const fields = config.fields as unknown as string[];
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

    if (key === 'password') {
      config.variables[key] = sha256(config.variables[key]);
    }

    builderInput[key] = {
      type,
      list: value.isList,
      value: config.variables[key],
    };
  }

  if (config.log) {
    console.debug('gqlSubscription::builderInput ', builderInput);
    console.debug('gqlSubscription::availableFields ', availableFields);
  }

  const queryBody = subscription({
    operation: method,
    variables: builderInput,
    fields: fields !== null ? fields : availableFields,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.debug('gqlSubscription::fields ', fields);
    console.debug('gqlSubscription::queryBody ', queryBody);
    console.debug('gqlSubscription::query ', queryBody.query);
    console.debug('gqlSubscription::documentNode ', documentNode);
  }

  return callWithNuxt(_nuxt, useSubscription<T>, [documentNode, config.variables ?? {}, null]);
}
