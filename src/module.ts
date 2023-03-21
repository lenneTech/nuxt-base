import { addTemplate, createResolver, defineNuxtModule, installModule } from "@nuxt/kit";
import consola from "consola";
import { getSchema } from "./functions/graphql-meta";
import generateGraphQLTypes from './generate';

// Module options TypeScript interface definition
export interface ModuleOptions {
  host: string;
  watch: boolean;
}

const logger = consola.withScope("[@lenne.tech/nuxt-base] ");

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@lenne.tech/nuxt-base",
    configKey: "nuxtBase",
    compatibility: {
      nuxt: '^3.3.1'
    }
  },
  // Default configuration options of the Nuxt module
  defaults: _nuxt => ({
    host: 'http://localhost:3000/graphql',
    watch: true
  }),
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    logger.info("Init @lenne.tech/nuxt-base");

    await installModule('@nuxtjs/apollo', {
      autoImports: true,
      authType: 'Bearer',
      authHeader: 'Authorization',
      tokenStorage: 'cookie',
      proxyCookies: true,
        clients: {
          default: {
            httpEndpoint: options.host,
          }
        },
    });

    logger.log(await getSchema(options.host));

    if (options.watch) {
      nuxt.hook('builder:watch', async (event, path) => {
        const start = Date.now()
        await generateGraphQLTypes(options.host)
        await nuxt.callHook('builder:generateApp')

        const time = Date.now() - start
        logger.success(`Generation completed in ${time}ms`)
      })
    }

    // Generate graphql types
    const generatedTypes = await generateGraphQLTypes(options.host);
    addTemplate({
      write: true,
      filename: `gql/schema-types.ts`,
      getContents: () => generatedTypes.content || ''
    })

    logger.info("Outputs generated!", generatedTypes);
  },
});
