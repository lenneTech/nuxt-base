import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app';
import type { GraphQLMeta } from '../classes/graphql-meta.class';
import { loadMeta } from '../functions/graphql-meta';

export default defineNuxtPlugin(async () => {
  const config = useRuntimeConfig();
  let meta: GraphQLMeta | null = null;

  try {
    if (!meta) {
      meta = await loadMeta({ public: config.public });
    }
  } catch (e) {
    console.error(e);
  }

  return {
    provide: {
      graphQl: () => meta,
    },
  };
});
