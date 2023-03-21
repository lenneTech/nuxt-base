import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
} from "graphql";
import gql from "graphql-tag";
import { GraphQLMeta } from "../classes/graphql-meta.class";
import { useAsyncQuery } from "#imports";

/**
 * Get schema for API
 * See https://www.apollographql.com/blog/three-ways-to-represent-your-graphql-schema-a41f4175100d
 */
export async function getSchema(): Promise<GraphQLSchema> {
  const { data } = await useAsyncQuery(
    gql(getIntrospectionQuery({ descriptions: false }))
  );

  return buildClientSchema(data.value as any);
}

/**
 * Get meta for API
 * See https://www.apollographql.com/blog/three-ways-to-represent-your-graphql-schema-a41f4175100d
 */
export async function getMeta(): Promise<GraphQLMeta> {
  const schema = await getSchema();

  // Return result
  return new GraphQLMeta(schema);
}
