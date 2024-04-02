import { addImportsDir, addPlugin, addTemplate, createResolver, defineNuxtModule, extendViteConfig, installModule, useLogger } from '@nuxt/kit';

import { generateFiles } from './generate';

// Module options TypeScript interface definition
export interface ModuleOptions {
  apollo?: {
    httpLinkOptions?: any;
    websocketsOnly?: boolean;
    wsEndpoint?: string;
    wsLinkOptions?: any;
  };
  autoImport?: boolean;
  generateTypes?: boolean;
  host: string;
  registerAuthPlugins?: boolean;
  schema?: string;
  storagePrefix?: string;
}

const logger = useLogger('[@lenne.tech/nuxt-base] ');

export default defineNuxtModule<ModuleOptions>({
  // Default configuration options of the Nuxt module
  defaults: (_nuxt) => ({
    autoImport: false,
    generateTypes: true,
    host: '',
    registerAuthPlugins: false,
    schema: null,
    storagePrefix: 'base',
  }),
  meta: {
    compatibility: {
      nuxt: '3.11.1',
    },
    configKey: 'nuxtBase',
    name: '@lenne.tech/nuxt-base',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    logger.info('[@lenne.tech/nuxt-base] Init @lenne.tech/nuxt-base');

    nuxt.options.build.transpile.push(resolver.resolve('runtime'));

    const wsUrl = options.host?.replace('https://', 'wss://').replace('http://', 'ws://');
    nuxt.options.runtimeConfig.public['host'] = options.host ?? 'http://localhost:3000';
    nuxt.options.runtimeConfig.public['wsUrl'] = wsUrl ?? 'ws://localhost:3000';
    nuxt.options.runtimeConfig.public['schema'] = options.schema ?? null;
    nuxt.options.runtimeConfig.public['storagePrefix'] = options.storagePrefix ?? null;

    addPlugin(resolver.resolve('runtime/plugins/cookies'));
    addPlugin(resolver.resolve('runtime/plugins/graphql'));

    if (options.registerAuthPlugins) {
      addPlugin(resolver.resolve('runtime/plugins/auth.server'));
    }

    addPlugin(resolver.resolve('runtime/plugins/apollo'));

    // prettier-ignore
    addTemplate({
      filename: 'base-types/fields.d.ts',
      getContents: () => [
        'type SimpleTypes = string | number | boolean | Date | string[] | number[] | boolean[] | Date[];',
        'type UnArray<\T> = T extends Array<infer U> ? UnArray<U> : T;',
        'type SimpleKeysFromObject<\T> = { [K in keyof T]: T[K] extends SimpleTypes ? K : never; }[keyof T];',
        'type SubFields<\T extends object, K extends keyof T = keyof T> =',
        '    K extends SimpleKeysFromObject<\T> ?',
        '      K :',
        '      T[K] extends any[] ?',
        '          { [P in K]: UnArray<\T[P]> extends object ?',
        '            SubFields<\Required<UnArray<T[P]>>>[] :',
        '            never } :',
        '          {',
        '            [P in K]: T[P] extends object ?',
        '              SubFields<\Required<T[P]>>[] :',
        '              never',
        '          };',
        'type InputFields<\T> = SubFields<Required<T>>;',
        'export { InputFields };',
      ].join('\n'),
    });
    nuxt.options.alias['#base-types'] = resolver.resolve(nuxt.options.buildDir, 'base-types');

    nuxt.options.alias['#base-types/*'] = resolver.resolve(nuxt.options.buildDir, 'base-types', '*');

    addImportsDir(resolver.resolve('runtime/composables'));
    addImportsDir(resolver.resolve('runtime/states'));
    addImportsDir(resolver.resolve('runtime/interfaces'));
    addImportsDir(resolver.resolve('runtime/enums'));
    addImportsDir(resolver.resolve('runtime/classes'));
    addImportsDir(resolver.resolve('runtime/functions'));

    logger.success('[@lenne.tech/nuxt-base] Added imports');

    if (options.generateTypes) {
      await generateFiles(options, logger, nuxt, resolver);
      setTimeout(() => {
        logger.info('[@lenne.tech/nuxt-base] Exit after generation');
        return process.exit(1);
      }, 5000);
    }

    // TODO: Remove when package fixed with valid ESM exports
    nuxt.options.build.transpile.push(({ isServer }) => !isServer && 'gql-query-builder');

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

    logger.success('[@lenne.tech/nuxt-base] Set WebSocket url:', wsUrl);
    await installModule(await resolver.resolvePath('@nuxtjs/apollo'), {
      autoImports: true,
      clients: {
        default: {
          authHeader: 'Authorization',
          authType: 'Bearer',
          defaultOptions: {
            watchQuery: {
              fetchPolicy: 'no-cache',
            },
          },
          httpEndpoint: options.host || null,
          proxyCookies: true,
          tokenName: `apollo:${options.storagePrefix}.token`,
          tokenStorage: 'cookie',
          wsEndpoint: wsUrl || null,
          ...options.apollo,
        },
      },
    });

    logger.success('[@lenne.tech/nuxt-base] Installed @nuxtjs/apollo');

    await installModule(await resolver.resolvePath('@pinia/nuxt'), {
      autoImports: ['defineStore'],
    });

    logger.success('[@lenne.tech/nuxt-base] Installed @pinia/nuxt');
    logger.success('[@lenne.tech/nuxt-base] Initialize done!');
  },
});
