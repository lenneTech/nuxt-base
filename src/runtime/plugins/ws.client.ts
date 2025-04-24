import { useAuth, useAuthState } from '#imports';
import { createClient } from 'graphql-ws';
import { defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from 'nuxt/app';
import { reactive } from 'vue';

import { useRequestOptions } from '../composables/use-request-options';

export const wsHeaders = reactive<Record<string, string>>({});

export default defineNuxtPlugin({
  name: 'ws',
  async setup() {
    const nuxtApp = useNuxtApp();
    const { wsUrl } = useRuntimeConfig().public;
    const { headers } = useRequestOptions();

    const client = createClient({
      connectionParams: async () => {
        const { accessTokenState } = useAuthState();
        return {
          Authorization: 'Bearer ' + accessTokenState.value,
          ...headers.value,
          ...wsHeaders,
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
