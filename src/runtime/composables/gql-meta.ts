import type { GraphQLMeta } from '#build/src/runtime/classes/graphql-meta.class';

import { useNuxtApp } from '#imports';

export function useGraphqlMeta(): GraphQLMeta {
  const nuxtApp = useNuxtApp() as { _meta: GraphQLMeta } & GraphQLMeta;

  if (!nuxtApp._meta) {
    throw new Error('GraphQLMeta is not available.');
  }

  return nuxtApp?._meta;
}
