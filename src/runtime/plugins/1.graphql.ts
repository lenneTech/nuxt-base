import { callWithNuxt, defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from 'nuxt/app';

import type { GraphQLMeta } from '../classes/graphql-meta.class';

import { loadMeta } from '../functions/graphql-meta';

export default defineNuxtPlugin({
  enforce: 'post',
  name: 'graphql',
  async setup() {
    const nuxt = useNuxtApp();
    const config = await callWithNuxt(nuxt, useRuntimeConfig);
    let meta: GraphQLMeta | null = null;

    try {
      meta = await callWithNuxt(nuxt, loadMeta, [{ public: config.public }]);
    } catch (e) {
      console.error('$graphql::loadMeta::error - Please check connection to your host.');
      meta = null;
    }

    return {
      provide: {
        graphQl: () => meta,
      },
    };
  },
});
