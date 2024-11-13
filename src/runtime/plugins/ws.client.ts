import { useAuth, useAuthState } from '#imports';
import { createClient } from 'graphql-ws';
import { defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from 'nuxt/app';

export default defineNuxtPlugin({
  name: 'ws',
  async setup() {
    const nuxtApp = useNuxtApp();
    const { wsUrl } = useRuntimeConfig().public;

    const client = createClient({
      connectionParams: async () => {
        const { accessTokenState } = useAuthState();
        return {
          Authorization: 'Bearer ' + accessTokenState.value,
        };
      },
      lazy: true,
      on: {
        closed: async (event) => {
          const { checkTokenAndRenew } = useAuth();

          if (event?.code === 4500) {
            await checkTokenAndRenew();
          }
        },
      },
      retryAttempts: 5,
      url: wsUrl as string,
    });

    nuxtApp._wsClient = client;

    return {
      provide: {
        wsClient: () => client,
      },
    };
  },
});
