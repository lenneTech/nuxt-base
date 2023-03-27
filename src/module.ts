import {
  addImportsDir,
  addTemplate,
  createResolver,
  defineNuxtModule,
  installModule
} from "@nuxt/kit";
import consola from "consola";
import generateGraphQLTypes, {
  generateComposables,
  getAllMethods
} from "./generate";

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
      nuxt: "^3.3.1",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: (_nuxt) => ({
    host: "",
    watch: true,
  }),
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);
    nuxt.options.build.transpile.push(resolver.resolve("runtime"));

    logger.info("Init @lenne.tech/nuxt-base");
    addImportsDir(resolver.resolve("runtime/composables"));

    if (!options.host) {
      return;
    }

    await installModule("@nuxtjs/apollo", {
      autoImports: false,
      authType: "Bearer",
      authHeader: "Authorization",
      tokenStorage: "cookie",
      proxyCookies: true,
      clients: {
        default: {
          httpEndpoint: options.host,
        },
      },
    });

    if (options.watch) {
      nuxt.hook("builder:watch", async (event, path) => {
        const start = Date.now();
        await generateGraphQLTypes(options.host);
        await nuxt.callHook("builder:generateApp");

        const time = Date.now() - start;
        logger.success(`Generation completed in ${time}ms`);
      });
    }

    nuxt.options.runtimeConfig["graphqlHost"] = options.host;

    // Generate graphql types
    const generatedTypes = await generateGraphQLTypes(options.host);
    addTemplate({
      write: true,
      filename: `base/default.ts`,
      getContents: () => generatedTypes[0].content || "",
    });

    // Generate composable types
    const composables = await generateComposables(options.host);
    addTemplate({
      write: true,
      filename: `base/index.ts`,
      getContents: () => composables || "",
    });

    // Generate imports
    const methods = await getAllMethods(options.host);
    nuxt.hook("imports:extend", (imports) => {
      imports.push(...(methods || []));
    });

    nuxt.options.alias["#base"] = resolver.resolve(
      nuxt.options.buildDir,
      "base"
    );
    nuxt.options.alias["#base/*"] = resolver.resolve(
      nuxt.options.buildDir,
      "base",
      "*"
    );

    logger.info("Outputs generated!");
  },
});
