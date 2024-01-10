import type { UseSubscriptionReturn } from '@vue/apollo-composable';

import { useSubscription } from '@vue/apollo-composable';
import { subscription } from 'gql-query-builder';
import gql from 'graphql-tag';
import { callWithNuxt, useNuxtApp } from 'nuxt/app';

import type { GraphQLMeta } from '../classes/graphql-meta.class';
import type { IGraphQLOptions } from '../interfaces/graphql-options.interface';

import { hashPasswords } from '../functions/graphql-meta';

export async function gqlSubscription<T = any>(method: string, options: IGraphQLOptions = {}): Promise<UseSubscriptionReturn<T, any>> {
  const _nuxt = useNuxtApp();
  const { $graphQl } = _nuxt;

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
  const meta = $graphQl() as GraphQLMeta;

  if (!meta) {
    return;
  }

  if (config.hashPasswords) {
    config.variables = await hashPasswords(config.variables);
  }

  const argType = meta.getArgs(method);
  const builderInput = {};
  const metaFields = meta.getFields(method);
  const availableFields = [];
  const variables = meta.parseVariables(config.variables, argType.fields);

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
    console.debug('gqlSubscription::builderInput ', builderInput);
    console.debug('gqlSubscription::availableFields ', availableFields);
  }

  const subOptions: any = {
    operation: method,
    variables: builderInput,
  };

  if (fields?.length || availableFields?.length) {
    subOptions.fields = fields !== null ? fields : availableFields;
  }

  if (config.log) {
    console.debug('gqlSubscription::subOptions ', subOptions);
  }

  const queryBody = subscription(subOptions);
  if (config.log) {
    console.debug('gqlSubscription::queryBody ', queryBody);
  }

  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.debug('gqlSubscription::fields ', fields);
    console.debug('gqlSubscription::queryBody ', queryBody);
    console.debug('gqlSubscription::query ', queryBody.query);
    console.debug('gqlSubscription::documentNode ', documentNode);
  }

  return callWithNuxt(_nuxt, useSubscription<T>, [documentNode, variables ?? {}, null]);
}
