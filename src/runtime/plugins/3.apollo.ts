import type { ApolloClient } from '@apollo/client/core';

import { ApolloLink, HttpLink, from, fromPromise, split } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { provideApolloClient } from '@vue/apollo-composable';
import { createClient } from 'graphql-ws';
import { callWithNuxt, defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from 'nuxt/app';

import { useAuth } from '../composables/use-auth';
import { useAuthState } from '../states/auth';

/**
 * See example: https://github.com/nuxt-modules/apollo/issues/442
 */
export default defineNuxtPlugin({
  enforce: 'post',
  name: 'apollo',
  async setup() {
    const links = [];
    const nuxtApp = useNuxtApp();
    const { host, wsUrl } = useRuntimeConfig().public;
    const defaultClient = (nuxtApp.$apollo as any)?.defaultClient as unknown as ApolloClient<any>;

    if (!defaultClient) {
      console.error('No defaultClient available');
      return;
    }

    const errorLink = onError((err) => {
      const { clearSession, requestNewToken } = useAuth();

      if (err.graphQLErrors) {
        for (const error of err.graphQLErrors) {
          switch (error.extensions.code) {
            case 'UNAUTHENTICATED': {
              if (error.message !== 'Expired refresh token' && error.message !== 'Expired token' && error.message !== 'Invalid token') {
                return;
              }

              if (error.message === 'Expired token') {
                console.debug('3.apollo.ts::expired_token', error.message);
              }

              if (error.message === 'Expired refresh token' || error.message === 'Invalid token') {
                console.debug('3.apollo.ts::init::clearSession::cause', error.message);
                clearSession();
                return;
              }

              return fromPromise(callWithNuxt(nuxtApp, requestNewToken) as any)
                .filter((value) => Boolean(value))
                .flatMap((response: any) => {
                  console.debug('3.apollo.ts::errorLink::retryRequest', response.token);
                  const oldHeaders = err.operation.getContext().headers;

                  // modify the operation context with a new token
                  err.operation.setContext({
                    headers: {
                      ...oldHeaders,
                      Authorization: `Bearer ${response.token}`,
                    },
                  });

                  // retry the request, returning the new observable
                  return err.forward(err.operation);
                });
            }
          }
        }
      }
    });

    const authMiddleware = new ApolloLink((operation, forward) => {
      const headers: Record<string, string> = {};
      const operationName = (operation.query.definitions[0] as any)?.selectionSet?.selections[0]?.name?.value;
      const { accessTokenState, refreshTokenState } = useAuthState();

      if (accessTokenState.value && refreshTokenState.value) {
        let token: string;

        if (operationName === 'refreshToken') {
          token = refreshTokenState.value || null;
        } else {
          token = accessTokenState.value || null;
        }

        if (token) {
          headers.Authorization = 'Bearer ' + token;
        }

        operation.setContext(() => ({ headers }));
      }
      return forward(operation);
    });

    const httpLink = new HttpLink({
      uri: (host as string) || '',
    });

    /* eslint-disable */
    const wsLink =
      typeof window !== 'undefined'
        ? new GraphQLWsLink(
            createClient({
              connectionParams: () => {
              const { accessTokenState } = useAuthState();
              return {
                Authorization: accessTokenState.value ? 'Bearer ' + accessTokenState.value : undefined,
              };
            },
            lazy: true,
            url: (wsUrl as string) || '',
            }),
          )
        : null;

    const splitLink =
      typeof window !== 'undefined' && wsLink != null
        ? split(
            ({ query }) => {
              const def = getMainDefinition(query);
              return def.kind === 'OperationDefinition' && def.operation === 'subscription';
            },
            wsLink,
            httpLink,
          )
        : httpLink;
    /* eslint-enable */

    defaultClient.setLink(from([authMiddleware, errorLink, splitLink]));

    provideApolloClient(defaultClient);
  },
});
