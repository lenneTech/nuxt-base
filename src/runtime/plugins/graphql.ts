
import { defineNuxtPlugin, useRuntimeConfig } from "nuxt/app"
import { buildClientSchema, getIntrospectionQuery } from "graphql";
import { ofetch } from "ofetch";
import { GraphQLMeta } from "../classes/graphql-meta.class";

export async function getSchema(uri: string): Promise<any> {
    const { data } = await ofetch(uri, {
        method: "POST",
        body: JSON.stringify({
            query: getIntrospectionQuery({ descriptions: false }),
            variables: {},
        }),
    });

    return data;
}

export async function getMeta(uri: string): Promise<GraphQLMeta> {
    // meta
    const result = await getSchema(uri);
    // TODO: Cache for only client
    // console.log(JSON.stringify(result))
    const schema = buildClientSchema(result);

    // Return result
    return new GraphQLMeta(schema);
}

export default defineNuxtPlugin(async () => {
    const runtimeConfig = useRuntimeConfig();
    let meta: GraphQLMeta | null = null
   
    console.log('GraphQl Plugin started')
    
    if (!meta) {
        meta = await getMeta(runtimeConfig.public.graphqlHost)
        console.log('new graphql meta fetched on: ', process.server ? 'Server' : 'Client')
    }
    return {
        provide: {
            graphQl: () => meta
        }
    }
})

