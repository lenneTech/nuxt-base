import type { AsyncDataOptions } from 'nuxt/app';

/**
 * Options for graphql requests
 */
export interface IGraphQLOptions {
  variables?: any;
  arguments?: any;
  fields?: any;
  log?: boolean;
  asyncDataOptions?: AsyncDataOptions<any>;
}
