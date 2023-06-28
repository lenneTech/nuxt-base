import {
  GraphQLRequestType,
  IGraphQLOptions,
  useMutation,
  useQuery,
  useSubscription,
} from "#imports";
import { mutation, query, subscription } from "gql-query-builder";
import gql from "graphql-tag";
import { useAsyncData, useNuxtApp } from "nuxt/app";
import { GraphQLMeta } from "../classes/graphql-meta.class";

// TODO: Type return
export async function useGraphQL<T = any>(
  method: string,
  options: IGraphQLOptions = {}
): Promise<T> {
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
    model: null,
    ...options,
  };

  const fields = config.fields as unknown as string[];

  if (config.log) {
    console.log("useGraphQL::fields ", fields);
  }

  // @ts-expect-error - plugin not well typed
  const meta = $graphQl() as GraphQLMeta;

  // TODO: Implement check with meta

  const types = meta.getRequestTypesViaMethod(method);

  if (!types?.length) {
    throw new Error(`No GraphQLRequestType detected`);
  }

  config.type = types[0] as GraphQLRequestType;

  if (config.log) {
    console.log("useGraphQL::type ", config.type);
  }

  let queryBody;
  switch (config.type) {
    case GraphQLRequestType.MUTATION: {
      queryBody = mutation({
        operation: method,
        fields,
        variables: config.variables,
      });
      break;
    }
    case GraphQLRequestType.SUBSCRIPTION: {
      queryBody = subscription({
        operation: method,
        fields,
        variables: config.variables,
      });
      break;
    }
    case GraphQLRequestType.QUERY: {
      queryBody = query({
        operation: method,
        fields,
        variables: config.variables,
      });
      break;
    }
  }

  const documentNode = gql(queryBody.query);

  if (config.log) {
    console.log("useGraphQL::query ", queryBody.query);
    console.log("useGraphQL::documentNode ", documentNode);
  }

  let asyncData;
  switch (config.type) {
    case GraphQLRequestType.MUTATION: {
      asyncData = useMutation<T>(documentNode, {});
      break;
    }
    case GraphQLRequestType.SUBSCRIPTION: {
      asyncData = useAsyncData<T>(() => {
        const { result } = useSubscription<T>(documentNode, {});
        return result;
      });
      break;
    }
    case GraphQLRequestType.QUERY: {
      asyncData = useAsyncData<T>(() => {
        const { result } = useQuery<T>(documentNode, {});
        return result;
      });
      break;
    }
  }

  return asyncData;
}
