import {
  addImportsDir,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
  useLogger,
} from '@nuxt/kit';
import { generateFiles } from './generate';
import { SimpleTypes } from '#build/src/runtime/types/fields';

// Module options TypeScript interface definition
export interface ModuleOptions {
  host: string;
  schema?: string;
  watch: boolean;
  generateTypes?: boolean;
  exitAfterGeneration?: boolean;
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
      nuxt: '3.7.3',
    },
  },
  // Default configuration options of the Nuxt module
  defaults: (_nuxt) => ({
    host: '',
    schema: null,
    watch: true,
    generateTypes: true,
    exitAfterGeneration: false,
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

    addPlugin(resolver.resolve('runtime/plugins/01.graphql'));
    addPlugin(resolver.resolve('runtime/plugins/02.auth.server'));
    addPlugin(resolver.resolve('runtime/plugins/03.apollo'));

    addTemplate({
      filename: 'base/types/fields.d.ts',
      getContents: () => [
        'type SimpleTypes = string | number | boolean | Date | string[] | number[] | boolean[] | Date[];',
        'type UnArray<T> = T extends Array<infer U> ? UnArray<U> : T;',
        'type SimpleKeysFromObject<T> = { [K in keyof T]: T[K] extends SimpleTypes ? K : never; }[keyof T];',
        'type SubFields<T extends object, K extends keyof T = "keyof" T> =',
        '    K extends SimpleKeysFromObject<T> ?',
        '      K :',
        '      T[K] extends any[] ?',
        '          { [P in K]: UnArray<T[P]> extends object ?',
        '            SubFields<Required<UnArray<T[P]>>>[] :',
        '            never } :',
        '          {',
        '            [P in K]: T[P] extends object ?',
        '              SubFields<Required<T[P]>>[] :',
        '              never',
        '          };',
        'export type InputFields<T> = SubFields<Required<T>>;',
      ].join('\n'),
    });

    nuxt.options.alias['#base'] = resolver.resolve(
      nuxt.options.buildDir,
      'base',
    );

    nuxt.options.alias['#base/*'] = resolver.resolve(
      nuxt.options.buildDir,
      'base',
      '*',
    );

    addImportsDir(resolver.resolve('runtime/types'));
    addImportsDir(resolver.resolve('runtime/composables'));
    addImportsDir(resolver.resolve('runtime/states'));
    addImportsDir(resolver.resolve('runtime/interfaces'));
    addImportsDir(resolver.resolve('runtime/enums'));
    addImportsDir(resolver.resolve('runtime/classes'));
    addImportsDir(resolver.resolve('runtime/functions'));
    logger.success('[@lenne.tech/nuxt-base] Added imports');

    if (options.generateTypes) {
      await generateFiles(options, logger, nuxt, resolver);

      if (options.exitAfterGeneration) {
        setTimeout(() => process.exit(), 2000);
      }
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

        if (options.generateTypes && !options.exitAfterGeneration) {
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
