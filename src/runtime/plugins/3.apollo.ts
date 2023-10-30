import { callWithNuxt, defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from 'nuxt/app';
import type { ApolloClient } from '@apollo/client/core';
import { ApolloLink, createHttpLink, from, fromPromise, split } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { provideApolloClient } from '@vue/apollo-composable';
import { useAuthState } from '../states/auth';
import { useAuth } from '../composables/use-auth';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { createClient } from 'graphql-ws';

/**
 * See example: https://github.com/nuxt-modules/apollo/issues/442
 */
export default defineNuxtPlugin({
  name: 'apollo',
  enforce: 'post',
  async setup() {
    console.debug('3.apollo.ts::init');
    const links = [];
    const nuxtApp = useNuxtApp();
    const { host, wsUrl } = useRuntimeConfig().public;
    const defaultClient = (nuxtApp.$apollo as any)?.defaultClient as unknown as ApolloClient<any>;

    if (!defaultClient) {
      console.error('No defaultClient available');
      return;
    }

    // trigger the error hook on an error
    const errorLink = onError((err) => {
      const { requestNewToken, clearSession } = useAuth();

      if (err.graphQLErrors) {
        for (const error of err.graphQLErrors) {
          switch (error.extensions.code) {
            case 'UNAUTHENTICATED': {
              if (
                error.message !== 'Expired refresh token' &&
                error.message !== 'Expired token' &&
                error.message !== 'Invalid token'
              ) {
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

    const httpLink = createHttpLink({
      uri: host as string || '',
    });

    const wsLink = new GraphQLWsLink(
      createClient({
        url: wsUrl as string || '',
        lazy: true,
        connectionParams: () => {
          const { accessTokenState } = useAuthState();
          return {
            Authorization: accessTokenState.value ? 'Bearer ' + accessTokenState.value : undefined,
          };
        },
      }),
    );

    const splitLink = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        );
      },
      wsLink,
      httpLink,
    );

    // Set custom links in the apollo client.
    // This is the link chain. Will be walked through from top to bottom. It can only contain 1 terminating
    // Apollo link, see: https://www.apollographql.com/docs/react/api/link/introduction/#the-terminating-link
    defaultClient.setLink(
      from([authMiddleware, errorLink, splitLink]),
    );

    // For using useQuery in `@vue/apollo-composable`
    provideApolloClient(defaultClient);
  },
});
