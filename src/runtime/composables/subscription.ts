import { IGraphQLOptions, useSubscription } from "#imports";
import { UseSubscriptionReturn } from "@vue/apollo-composable";
import { subscription } from "gql-query-builder";
import gql from "graphql-tag";
import { useNuxtApp } from "nuxt/app";
import { GraphQLMeta } from "../classes/graphql-meta.class";

export async function gqlSubscription<T = any>(
  method: string,
  options: IGraphQLOptions = {}
): Promise<UseSubscriptionReturn<T, any>> {
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
  const meta = $graphQl() as GraphQLMeta;
  const queryBody = subscription({
    operation: method,
    variables: config.variables,
    fields,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.log("gqlSubscription::fields ", fields);
    console.log("gqlSubscription::queryBody ", queryBody);
    console.log("gqlSubscription::query ", queryBody.query);
    console.log("gqlSubscription::documentNode ", documentNode);
  }

  return useSubscription<T>(documentNode, config.variables ?? {});
}
