import { useAuthState } from '#imports';
import { createClient } from 'graphql-ws';
import {defineNuxtPlugin, useNuxtApp, useRuntimeConfig} from 'nuxt/app';

export default defineNuxtPlugin({
  name: 'ws',
  async setup() {
    const nuxtApp = useNuxtApp();
    const { wsUrl } = useRuntimeConfig().public;
    const { accessTokenState } = useAuthState();

    const client = createClient({
      connectionParams: async () => {
        return {
          Authorization: 'Bearer ' + accessTokenState.value,
        };
      },
      lazy: true,
      on: {
        error: (error) => {
          console.error('wsClient::error', error);
        },
      },
      url: wsUrl,
    });

    console.log('wsClient::created', client);
    nuxtApp._wsClient = client;

    return {
      provide: {
        wsClient: () => client,
      },
    };
  },
});
