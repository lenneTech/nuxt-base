import {
  addImportsDir,
  addPlugin,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
  useLogger,
} from '@nuxt/kit';
import { generateFiles } from './generate';

// Module options TypeScript interface definition
export interface ModuleOptions {
  host: string;
  schema?: string;
  watch: boolean;
  generateTypes?: boolean;
  storagePrefix?: string;
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

const logger = useLogger('[@lenne.tech/nuxt-base] ');

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@lenne.tech/nuxt-base',
    configKey: 'nuxtBase',
    compatibility: {
      nuxt: '3.6.5',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: (_nuxt) => ({
    host: '',
    schema: null,
    watch: true,
    generateTypes: true,
    storagePrefix: '',
    apollo: {
      authType: 'Bearer',
      authHeader: 'Authorization',
      tokenStorage: 'cookie',
      proxyCookies: true,
    },
  }),
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    logger.info('[@lenne.tech/nuxt-base] Init @lenne.tech/nuxt-base');

    nuxt.options.build.transpile.push(resolver.resolve('runtime'));

    nuxt.options.runtimeConfig.public['host'] = options.host;
    nuxt.options.runtimeConfig.public['schema'] = options.schema ?? null;
    nuxt.options.runtimeConfig.public['storagePrefix'] = options.storagePrefix ?? null;

    addPlugin(resolver.resolve('runtime/plugins/graphql'));
    addPlugin(resolver.resolve('runtime/plugins/apollo'));

    addImportsDir(resolver.resolve('runtime/composables'));
    addImportsDir(resolver.resolve('runtime/stores'));
    addImportsDir(resolver.resolve('runtime/interfaces'));
    addImportsDir(resolver.resolve('runtime/enums'));
    addImportsDir(resolver.resolve('runtime/classes'));
    addImportsDir(resolver.resolve('runtime/functions'));
    logger.success('[@lenne.tech/nuxt-base] Added imports');

    if (options.generateTypes) {
      await generateFiles(options, logger, nuxt, resolver);
    }

    // TODO: Remove when package fixed with valid ESM exports
    nuxt.options.build.transpile.push(
      ({ isServer }) => !isServer && 'gql-query-builder',
    );

    // TODO: Remove when package fixed with valid ESM exports
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
      config.optimizeDeps.include.push('gql-query-builder');
    });

    nuxt.hook('nitro:config', (nitro) => {
      if (nitro.imports === false) {
        return;
      }

      nitro.externals = nitro.externals || {};
      nitro.externals.inline = nitro.externals.inline || [];
      nitro.externals.inline.push(resolver.resolve('runtime'));
    });

    if (options.watch) {
      nuxt.hook('builder:watch', async () => {
        const start = Date.now();

        if (options.generateTypes) {
          await generateFiles(options, logger, nuxt, resolver);
        }

        await nuxt.callHook('builder:generateApp');
        const time = Date.now() - start;
        logger.success(
          `[@lenne.tech/nuxt-base] Generation completed in ${time}ms`,
        );
      });
    }

    await installModule(await resolver.resolvePath('@nuxtjs/apollo'), {
      autoImports: true,
      clients: {
        default: {
          httpEndpoint: options.host || null,
          ...options.apollo,
        },
      },
    });
    logger.success('[@lenne.tech/nuxt-base] Installed @nuxtjs/apollo');

    await installModule(await resolver.resolvePath('@pinia/nuxt'), {
      autoImports: ['defineStore'],
    });
    logger.success('[@lenne.tech/nuxt-base] Installed @pinia/nuxt');

    logger.info('[@lenne.tech/nuxt-base] Initialize done!');
  },
});
