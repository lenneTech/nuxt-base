import type { AsyncDataOptions } from 'nuxt/app';

/**
 * Options for graphql requests
 */
export interface IGraphQLOptions {
  arguments?: any;
  asyncDataOptions?: AsyncDataOptions;
  fields?: any;
  hashPasswords?: boolean;
  lazy?: boolean;
  log?: boolean;
  variables?: any;
}
