import { createHttpLink, from, ApolloLink } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { provideApolloClient } from '@vue/apollo-composable'
import { defineNuxtPlugin } from '#imports'
import { useAuthStore } from '../stores/auth'

/**
 * See example: https://github.com/nuxt-modules/apollo/issues/442
 */
export default defineNuxtPlugin((nuxtApp) => {
  const envVars = useRuntimeConfig()
  const { $apollo } = nuxtApp

    // trigger the error hook on an error
  const errorLink = onError((err) => {
    nuxtApp.callHook('apollo:error', err) // must be called bc `@nuxtjs/apollo` will not do it anymore
    const store = useAuthStore()
    
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

            if (error.message === 'Expired refresh token' || error.message === 'Invalid token') {
              store.clearSession();
              return;
            }

            
            return store.requestNewToken()
              .filter((value) => Boolean(value))
              .flatMap((response) => {
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
    const headers: any = {};
    const operationName = (operation.query.definitions[0] as any)?.selectionSet?.selections[0]?.name?.value;
    const store = useAuthStore()

    if (store) {
      let token: string;

      if (operationName === 'refreshToken') {
        token = store.refreshToken.value || null;
      } else {
        token = store.token.value || null;
      }

      if (token) {
        headers.Authorization = 'Bearer ' + token;
      }

      operation.setContext(() => ({ headers }));
    }
    return forward(operation);
  });

  // Default httpLink (main communication for apollo)
  const httpLink = createHttpLink({
    uri: envVars.public.graphqlHost,
  })

  // Set custom links in the apollo client.
  // This is the link chain. Will be walked through from top to bottom. It can only contain 1 terminating
  // Apollo link, see: https://www.apollographql.com/docs/react/api/link/introduction/#the-terminating-link
  $apollo.defaultClient.setLink(from([
    authMiddleware,
    errorLink,
    httpLink,
  ]))

  // For using useQuery in `@vue/apollo-composable`
  provideApolloClient($apollo.defaultClient)
})