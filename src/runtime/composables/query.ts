import { IGraphQLOptions, useQuery } from "#imports";
import { query } from "gql-query-builder";
import gql from "graphql-tag";
import { AsyncData, useAsyncData, useNuxtApp } from "nuxt/app";
import { GraphQLMeta } from "../classes/graphql-meta.class";

export async function gqlQuery<T = any>(
  method: string,
  options: IGraphQLOptions = {}
): Promise<AsyncData<T, any>> {
  const { $graphQl } = useNuxtApp();

  // Check parameters
  if (!method) {
    throw new Error(`No method detected`);
  }

  // Get config
  const config = {
    variables: null,
    fields: null,
    log: false,
    ...options,
  };

  const fields = config.fields as unknown as string[];

  if (config.log) {
    console.log("gqlQuery::fields ", fields);
    console.log("gqlQuery::variables ", config.variables);
  }

  const meta = $graphQl() as GraphQLMeta;
  const queryBody = query({
    operation: method,
    variables: config.variables,
    fields,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.log("gqlQuery::queryBody ", queryBody);
    console.log("gqlQuery::query ", queryBody.query);
    console.log("gqlQuery::documentNode ", documentNode);
  }

  return useAsyncData<T, any>(() => {
    const { result } = useQuery<T>(documentNode, {});
    return result;
  });
}
