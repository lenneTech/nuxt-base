import {
  addImportsDir,
  addPlugin,
  addTemplate,
  createResolver,
  defineNuxtModule,
  extendViteConfig,
  installModule,
  useLogger
} from '@nuxt/kit';

import {generateFiles} from './generate';

// Module options TypeScript interface definition
export interface ModuleOptions {
  autoImport?: boolean;
  disableGraphql?: boolean;
  generateTypes?: boolean;
  gqlHost: string;
  host: string;
  registerAuthPlugins?: boolean;
  registerCookiePlugin?: boolean;
  schema?: string;
  storagePrefix?: string;
}

const logger = useLogger('[@lenne.tech/nuxt-base] ');

function responseMiddleware(response: any) {
  if (response.errors) {
    const traceId = response.headers.get('x-b3-traceid') || 'unknown';
    console.error(
      `[${traceId}] Request error:
        status ${response.status}
        details: ${response.errors}`,
    );

    // ToDo: Check for error.message === 'Expired refresh token' and clearSession
    if (response.errors.some((error) => error.message === 'Expired refresh token')) {
      console.error('Expired refresh token');
    }
  }
}

export default defineNuxtModule<ModuleOptions>({
  // Default configuration options of the Nuxt module
  defaults: {
    autoImport: false,
    disableGraphql: false,
    generateTypes: true,
    gqlHost: '',
    host: '',
    registerAuthPlugins: false,
    registerCookiePlugin: true,
    schema: undefined,
    storagePrefix: 'base',
  },
  meta: {
    configKey: 'nuxtBase',
    name: '@lenne.tech/nuxt-base',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url);

    logger.info('[@lenne.tech/nuxt-base] Init @lenne.tech/nuxt-base');

    // Transpile runtime
    const runtimeDir = resolver.resolve('runtime');
    nuxt.options.build.transpile.push(runtimeDir);

    const wsUrl = options.gqlHost?.replace('https://', 'wss://').replace('http://', 'ws://');
    nuxt.options.runtimeConfig.public['host'] = options.host ?? 'http://localhost:3000';
    nuxt.options.runtimeConfig.public['gqlHost'] = options.gqlHost ?? 'http://localhost:3000/graphql';
    nuxt.options.runtimeConfig.public['wsUrl'] = wsUrl ?? 'ws://localhost:3000';
    nuxt.options.runtimeConfig.public['schema'] = options.schema ?? null;
    nuxt.options.runtimeConfig.public['storagePrefix'] = options.storagePrefix ?? null;

    if (options.registerCookiePlugin) {
      addPlugin(resolver.resolve('runtime/plugins/cookies'));
    }

    if (!options.disableGraphql) {
      addPlugin(resolver.resolve('runtime/plugins/graphql-meta'));
      addPlugin(resolver.resolve('runtime/plugins/ws.client'));
    }

    if (options.registerAuthPlugins) {
      addPlugin(resolver.resolve('runtime/plugins/auth.server'));
    }

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
    nuxt.options.alias['#base-interfaces'] = resolver.resolve('runtime/interfaces');
    nuxt.options.alias['#base-interfaces/*'] = resolver.resolve('runtime/interfaces', '*');

    addImportsDir(resolver.resolve('runtime/classes'));
    addImportsDir(resolver.resolve('runtime/composables'));
    addImportsDir(resolver.resolve('runtime/states'));
    addImportsDir(resolver.resolve('runtime/interfaces'));
    addImportsDir(resolver.resolve('runtime/enums'));
    addImportsDir(resolver.resolve('runtime/functions'));

    logger.success('[@lenne.tech/nuxt-base] Added imports');

    if (options.generateTypes && !options.disableGraphql) {
      await generateFiles(options, logger, nuxt, resolver);
      setTimeout(() => {
        logger.info('[@lenne.tech/nuxt-base] Exit after generation');
        return process.exit(1);
      }, 5000);
    }

    if (!options.disableGraphql) {
      // TODO: Remove when package fixed with valid ESM exports
      nuxt.options.build.transpile.push(({ isServer }) => !isServer && 'gql-query-builder');
    }

    nuxt.options.build.transpile.push(({ isServer }) => !isServer && 'js-sha256');
    // TODO: Remove when package fixed with valid ESM exports
    extendViteConfig((config) => {
      config.optimizeDeps = config.optimizeDeps || {};
      config.optimizeDeps.include = config.optimizeDeps.include || [];
      config.optimizeDeps.exclude = config.optimizeDeps.exclude || [];
      config.optimizeDeps.include.push('gql-query-builder');
      config.optimizeDeps.include.push('js-sha256');
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
    if (!options.disableGraphql) {
      await installModule(await resolver.resolvePath('nuxt-graphql-request'), {
        clients: {
          default: {
            endpoint: options.gqlHost,
            options: {
              responseMiddleware,
            },
          },
        },
      });
    }

    logger.success('[@lenne.tech/nuxt-base] Installed nuxt-graphql-request');
    logger.success('[@lenne.tech/nuxt-base] Initialize done!');
  },
});
