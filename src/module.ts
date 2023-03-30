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
  apollo?: {
    browserHttpEndpoint?: string;
    wsEndpoint?: string;
    httpLinkOptions?: any;
    wsLinkOptions?: any;
    websocketsOnly?: boolean;
    connectToDevTools?: boolean;
    defaultOptions?: any;
    inMemoryCacheOptions?: any;
    tokenName?: string;
    tokenStorage?: string;
    authType?: string;
    authHeader?: string;
  };
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
    apollo: {
      authType: "Bearer",
      authHeader: "Authorization",
      tokenStorage: "cookie",
      proxyCookies: true,
    },
  }),
  async setup(options, nuxt) {
    logger.info("[@lenne.tech/nuxt-base] Init @lenne.tech/nuxt-base");
    await installModule("@nuxtjs/apollo", {
      autoImports: true,
      clients: {
        default: {
          httpEndpoint: options.host || null,
          ...options.apollo
        },
      },
    });
    logger.success("[@lenne.tech/nuxt-base] Installed @nuxtjs/apollo");

    await installModule("@pinia/nuxt", {
      autoImports: ["defineStore"],
    });
    logger.success("[@lenne.tech/nuxt-base] Installed @pinia/nuxt");

    const resolver = createResolver(import.meta.url);
    nuxt.options.build.transpile.push(resolver.resolve("runtime"));
    addImportsDir(resolver.resolve("runtime/composables"));
    addImportsDir(resolver.resolve("runtime/stores"));
    logger.success("[@lenne.tech/nuxt-base] Added imports");

    if (options.watch) {
      nuxt.hook("builder:watch", async (event, path) => {
        const start = Date.now();

        // Generate graphql types
        const generatedTypes = await generateGraphQLTypes(options.host);
        addTemplate({
          write: true,
          filename: `base/default.ts`,
          getContents: () => generatedTypes[0].content || "",
        });
        logger.success("[@lenne.tech/nuxt-base] Generated base/default.ts");

        // Generate composable types
        const composables = await generateComposables(options.host);
        addTemplate({
          write: true,
          filename: `base/index.ts`,
          getContents: () => composables || "",
        });
        logger.success("[@lenne.tech/nuxt-base] Generated base/index.ts");

        await nuxt.callHook("builder:generateApp");

        const time = Date.now() - start;
        logger.success(`[@lenne.tech/nuxt-base] Generation completed in ${time}ms`);
      });
    }

    nuxt.options.runtimeConfig.public["graphqlHost"] = options.host;

    // Generate graphql types
    const generatedTypes = await generateGraphQLTypes(options.host);
    addTemplate({
      write: true,
      filename: `base/default.ts`,
      getContents: () => generatedTypes[0].content || "",
    });
    logger.success("[@lenne.tech/nuxt-base] Generated base/default.ts");

    // Generate composable types
    const composables = await generateComposables(options.host);
    addTemplate({
      write: true,
      filename: `base/index.ts`,
      getContents: () => composables || "",
    });
    logger.success("[@lenne.tech/nuxt-base] Generated base/index.ts");

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

    logger.info("[@lenne.tech/nuxt-base] Initialize done!");
  },
});
