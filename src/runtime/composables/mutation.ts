import { IGraphQLOptions, useMutation } from "#imports";
import { UseMutationReturn } from "@vue/apollo-composable";
import { mutation } from "gql-query-builder";
import gql from "graphql-tag";
import { useNuxtApp } from "nuxt/app";
import { GraphQLMeta } from "../classes/graphql-meta.class";

// TODO: Type return
export async function gqlMutation<T = any>(
  method: string,
  options: IGraphQLOptions = {}
): Promise<UseMutationReturn<T, any>> {
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
    console.log("gqlMutation::fields ", fields);
  }

  const meta = $graphQl() as GraphQLMeta;
  const argType = meta.getArgs(method);
  const builderInput = {};

  if (config.log) {
    console.log("gqlMutation::variables ", config.variables);
    console.log("gqlMutation::type ", config.type);
    console.log("gqlMutation::argType ", argType);
  }

  for (const [key, value] of Object.entries(argType.fields)) {
    builderInput[key] = {
      type: value.type,
      required: value.isRequired,
      value: config.variables[key],
    };
  }

  if (config.log) {
    console.log("gqlMutation::builderInput ", builderInput);
  }

  const queryBody = mutation({
    operation: method,
    variables: builderInput,
    fields,
  });
  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.log("gqlMutation::queryBody ", queryBody);
    console.log("gqlMutation::query ", queryBody.query);
    console.log("gqlMutation::documentNode ", documentNode);
  }

  return useMutation<T>(documentNode, { variables: config.variables });
}
