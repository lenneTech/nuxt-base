import { useState } from 'nuxt/app';

import type { GraphQLMeta } from '../classes/graphql-meta.class';

const gqlMetaState = () => useState<GraphQLMeta | null>('gql_meta_state', () => null);

export function useGqlMetaState() {
  return {
    meta: gqlMetaState(),
  };
}
