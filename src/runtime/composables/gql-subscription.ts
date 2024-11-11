import { subscription } from 'gql-query-builder';
import gql from 'graphql-tag';
import { useNuxtApp } from 'nuxt/app';
import { ref } from 'vue';

import type { IGraphQLOptions } from '../interfaces/graphql-options.interface';
import type { ReturnTypeOfSubscription } from '../interfaces/return-type-of-subscription.interface';

import { hashPasswords } from '../functions/graphql-meta';

export async function gqlSubscription<T = any>(method: string, options: IGraphQLOptions = {}): Promise<ReturnTypeOfSubscription<T>> {
  const { _meta, _wsClient } = useNuxtApp();

  if (import.meta.server) {
    return {
      data: ref(null),
      error: ref(null),
      loading: ref(false),
      start: () => {},
      stop: () => {},
    };
  }

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
      console.debug('gqlSubscription::isRequired ', value.isRequired);
      console.debug('gqlSubscription::isItemRequired ', value.isItemRequired);
      console.debug('gqlSubscription::isList ', value.isList);
      console.debug('gqlSubscription::key ', key);
      console.debug('gqlSubscription::value ', value);
      console.debug('gqlSubscription::type ', type);
    }

    builderInput[key] = {
      list: false,
      required: false,
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

  const data = ref(null);
  const error = ref(null);
  const loading = ref(true);
  let subscriptionState = null;

  const start = () => {
    loading.value = true;
    error.value = null;

    subscriptionState = _wsClient.subscribe(
      { query: queryBody.query, variables: variables },
      {
        complete: () => {
          loading.value = false;
        },
        error: (err) => {
          error.value = err;
          loading.value = false;
        },
        next: (result) => {
          if (result.data) {
            data.value = result.data[method] ? result.data[method] : result.data;
          } else {
            data.value = result.data;
          }

          loading.value = false;
        },
      },
    );
  };

  const stop = () => {
    if (subscriptionState) {
      subscriptionState.unsubscribe();
      subscriptionState = null;
    }
  };

  return {
    data,
    error,
    loading,
    start,
    stop,
  };
}
