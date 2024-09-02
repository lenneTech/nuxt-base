/**
 * Options for graphql requests
 */
export interface IGraphQLOptions {
  arguments?: any;
  disableTokenCheck?: boolean;
  fields?: any;
  hashPasswords?: boolean;
  lazy?: boolean;
  log?: boolean;
  variables?: any;
}
