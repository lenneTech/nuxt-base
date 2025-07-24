/**
 * GraphQL fields object
 */
export interface GraphQLFieldsObject {
  [key: string]: (GraphQLFieldsObject | string)[] | boolean | GraphQLFieldsObject;
}
