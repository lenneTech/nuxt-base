import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import type { GraphQLMeta } from '../classes/graphql-meta.class';
import { loadMeta } from '../functions/graphql-meta';

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  let meta: GraphQLMeta | null = null;

  if (!meta) {
    meta = await loadMeta({ public: config.public });
  }
  return {
    provide: {
      graphQl: () => meta,
    },
  };
});
