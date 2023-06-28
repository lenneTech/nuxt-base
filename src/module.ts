import {
  addImportsDir,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
  useLogger,
} from "@nuxt/kit";
import generateGraphQLTypes, {
  generateComposables,
  getAllMethods,
  loadMetaServer,
} from "./generate";

// Module options TypeScript interface definition
export interface ModuleOptions {
  host: string;
  schema?: string;
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
      nuxt: "3.6.1",
    },
  },
  // Default configuration options of the Nuxt module
  defaults: (_nuxt) => ({
    host: "",
    schema: null,
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
    const resolver = createResolver(import.meta.url);

    logger.info("[@lenne.tech/nuxt-base] Init @lenne.tech/nuxt-base");

    nuxt.options.build.transpile.push(resolver.resolve("runtime"));

    nuxt.options.runtimeConfig.public["host"] = options.host;
    nuxt.options.runtimeConfig.public["schema"] = options.schema ?? null;

    addPlugin(resolver.resolve("runtime/plugins/graphql"));
    addPlugin(resolver.resolve("runtime/plugins/apollo"));

    if (options.autoImport) {
      addImportsDir(resolver.resolve("runtime/composables"));
      addImportsDir(resolver.resolve("runtime/stores"));
      addImportsDir(resolver.resolve("runtime/interfaces"));
      addImportsDir(resolver.resolve("runtime/enums"));
      addImportsDir(resolver.resolve("runtime/classes"));
      addImportsDir(resolver.resolve("runtime/functions"));
      logger.success("[@lenne.tech/nuxt-base] Added imports");

      try {
        const meta = await loadMetaServer({ public: options });

        // Generate graphql types
        const generatedTypes = await generateGraphQLTypes(
          options.schema ?? options.host
        );
        addTemplate({
          write: true,
          filename: `base/default.ts`,
          getContents: () => generatedTypes[0].content || "",
        });
        logger.success("[@lenne.tech/nuxt-base] Generated base/default.ts");

        // Generate composable types
        const composables = await generateComposables(meta);
        addTemplate({
          write: true,
          filename: `base/index.ts`,
          getContents: () => composables || "",
        });
        logger.success("[@lenne.tech/nuxt-base] Generated base/index.ts");

        // Generate imports
        nuxt.hook("imports:extend", async (imports) => {
          const methods = await getAllMethods(meta);
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
        console.log(e);
        logger.warn(
          "[@lenne.tech/nuxt-base] Generated failed. Please check your host."
        );
      }
    }

    // TODO: Remove when package fixed with valid ESM exports
    nuxt.options.build.transpile.push(
      ({ isServer }) => !isServer && "gql-query-builder"
    );

    // TODO: Remove when package fixed with valid ESM exports
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
      config.optimizeDeps.include.push("gql-query-builder");
    });

    nuxt.hook("nitro:config", (nitro) => {
      if (nitro.imports === false) {
        return;
      }

      nitro.externals = nitro.externals || {};
      nitro.externals.inline = nitro.externals.inline || [];
      nitro.externals.inline.push(resolver.resolve("runtime"));
    });

    if (options.watch) {
      nuxt.hook("builder:watch", async (event, path) => {
        const start = Date.now();
        try {
          const meta = await loadMetaServer({ public: options });

          // Generate graphql types
          const generatedTypes = await generateGraphQLTypes(
            options.schema ?? options.host
          );
          addTemplate({
            write: true,
            filename: `base/default.ts`,
            getContents: () => generatedTypes[0].content || "",
          });
          logger.success("[@lenne.tech/nuxt-base] Generated base/default.ts");

          // Generate composable types
          const composables = await generateComposables(meta);
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
          console.error(e);
          logger.warn(
            "[@lenne.tech/nuxt-base] Generated failed. Please check your host."
          );
        }
        const time = Date.now() - start;
        logger.success(
          `[@lenne.tech/nuxt-base] Generation completed in ${time}ms`
        );
      });
    }

    await installModule(await resolver.resolvePath("@nuxtjs/apollo"), {
      autoImports: true,
      clients: {
        default: {
          httpEndpoint: options.host || null,
          ...options.apollo,
        },
      },
    });
    logger.success("[@lenne.tech/nuxt-base] Installed @nuxtjs/apollo");

    await installModule(await resolver.resolvePath("@pinia/nuxt"), {
      autoImports: ["defineStore"],
    });
    logger.success("[@lenne.tech/nuxt-base] Installed @pinia/nuxt");

    logger.info("[@lenne.tech/nuxt-base] Initialize done!");

    nuxt.hook("ready", (nitro) => {});
  },
});
