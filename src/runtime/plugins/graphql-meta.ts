import { callWithNuxt, defineNuxtPlugin, useNuxtApp, useRuntimeConfig } from 'nuxt/app';

import type { GraphQLMeta } from '../../generate';

import { loadMeta } from '../functions/graphql-meta';

export default defineNuxtPlugin({
  name: 'graphql-meta',
  async setup() {
    const nuxtApp = useNuxtApp();
    const config = await callWithNuxt(nuxtApp, useRuntimeConfig);
    let meta: GraphQLMeta | null = null;

    try {
      meta = await callWithNuxt(nuxtApp, loadMeta, [{ public: config.public }]);
    } catch (e) {
      console.error('$graphql::loadMeta::error - Please check connection to your host.');
      meta = null;
    }

    nuxtApp._meta = meta;

    return {
      provide: {
        meta: () => meta,
      },
    };
  },
});
