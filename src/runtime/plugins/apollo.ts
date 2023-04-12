import { defineNuxtPlugin } from '#app'
import { useAuthStore } from '#imports'
import type { ApolloClient } from '@apollo/client/core'
import { ApolloLink, from, fromPromise } from '@apollo/client/core'
import { onError } from '@apollo/client/link/error'
import { provideApolloClient } from '@vue/apollo-composable'
/**
 * See example: https://github.com/nuxt-modules/apollo/issues/442
 */

export default defineNuxtPlugin((nuxtApp) => {
  const { $apollo } = nuxtApp
  const defaultClient = ($apollo as any).defaultClient as unknown as ApolloClient<any>

  // trigger the error hook on an error
  const errorLink = onError((err) => {
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


            return fromPromise(store.requestNewToken())
              .filter((value) => Boolean(value))
              .flatMap((response: any) => {
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
        token = store.refreshToken || null;
      } else {
        token = store.token || null;
      }

      if (token) {
        headers.Authorization = 'Bearer ' + token;
      }

      operation.setContext(() => ({ headers }));
    }
    return forward(operation);
  });

  // Set custom links in the apollo client.
  // This is the link chain. Will be walked through from top to bottom. It can only contain 1 terminating
  // Apollo link, see: https://www.apollographql.com/docs/react/api/link/introduction/#the-terminating-link
  defaultClient.setLink(from([
    authMiddleware,
    errorLink,
    defaultClient.link,
  ]))

  // For using useQuery in `@vue/apollo-composable`
  provideApolloClient(defaultClient)
})
