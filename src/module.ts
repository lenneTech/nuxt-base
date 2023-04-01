import {
  addImportsDir,
  addTemplate,
  createResolver,
  defineNuxtModule,
  installModule,
  useLogger,
} from "@nuxt/kit";
import { getSchema } from "./functions/graphql-meta";
import generateGraphQLTypes, {
  generateComposables,
  getAllMethods,
} from "./generate";

// Module options TypeScript interface definition
export interface ModuleOptions {
  host: string;
  watch: boolean;
  autoImport: boolean;
  apollo?: {
    browserHttpEndpoint?: string;
    wsEndpoint?: string;
    httpLinkOptions?: any;
    wsLinkOptions?: any;
    websocketsOnly?: boolean;
    connectToDevTools?: boolean;
    proxyCookies?: boolean;
    defaultOptions?: any;
    inMemoryCacheOptions?: any;
    tokenName?: string;
    tokenStorage?: string;
    authType?: string;
    authHeader?: string;
  };
}

const logger = useLogger("[@lenne.tech/nuxt-base] ");

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: "@lenne.tech/nuxt-base",
    configKey: "nuxtBase",
    compatibility: {
      nuxt: "3.3.2",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: (_nuxt) => ({
    host: "",
    watch: true,
    autoImport: true,
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
          ...options.apollo,
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

    nuxt.options.runtimeConfig.public["graphqlHost"] = options.host;

    if (options.autoImport) {
      addImportsDir(resolver.resolve("runtime/composables"));
      addImportsDir(resolver.resolve("runtime/stores"));
      addImportsDir(resolver.resolve("interfaces"));
      addImportsDir(resolver.resolve("enums"));
      addImportsDir(resolver.resolve("functions"));
      logger.success("[@lenne.tech/nuxt-base] Added imports");

      try {
        await getSchema(options.host);
      
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
        nuxt.hook("imports:extend", async (imports) => {
          const methods = await getAllMethods(options.host);
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
      } catch (e) {
        logger.warn("[@lenne.tech/nuxt-base] Generated failed. Please check your host.");
      }
    }

    nuxt.hook('nitro:config', (nitro) => {
      if (nitro.imports === false) { return }

      nitro.externals = nitro.externals || {}
      nitro.externals.inline = nitro.externals.inline || []
      nitro.externals.inline.push(resolver.resolve('runtime'))
    });

    if (options.watch) {
      nuxt.hook("builder:watch", async (event, path) => {
        const start = Date.now();
        try {
          await getSchema(options.host);

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

          nuxt.options.alias["#base"] = resolver.resolve(
            nuxt.options.buildDir,
            "base"
          );

          nuxt.options.alias["#base/*"] = resolver.resolve(
            nuxt.options.buildDir,
            "base",
            "*"
          );

          await nuxt.callHook("builder:generateApp");
        } catch (e) {
          logger.warn("[@lenne.tech/nuxt-base] Generated failed. Please check your host.");
        }
        const time = Date.now() - start;
        logger.success(
          `[@lenne.tech/nuxt-base] Generation completed in ${time}ms`
        );
      });
    }

    logger.info("[@lenne.tech/nuxt-base] Initialize done!");
  },
});
