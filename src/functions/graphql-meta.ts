import {
  buildClientSchema,
  getIntrospectionQuery,
  GraphQLSchema,
} from "graphql";
import { ofetch } from 'ofetch'
import { GraphQLMeta } from "../classes/graphql-meta.class";

/**
 * Get schema for API
 * See https://www.apollographql.com/blog/three-ways-to-represent-your-graphql-schema-a41f4175100d
 */
export async function getSchema(uri: string): Promise<GraphQLSchema> {
  const { data } = await ofetch(uri, {
    method: 'POST', body: JSON.stringify({
      query: getIntrospectionQuery({ descriptions: false }),
      variables: {},
    })
  })
  return buildClientSchema(data as any);
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
