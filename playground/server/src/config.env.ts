import type { IServerOptions } from '@lenne.tech/nest-server';

import { merge } from '@lenne.tech/nest-server';
import { join } from 'path';

/**
 * Configuration for the different environments
 * See: https://github.com/lenneTech/nest-server/blob/main/src/core/common/interfaces/server-options.interface.ts
 */
export const config: { [env: string]: Partial<IServerOptions> } = {
  // ===========================================================================
  // Develop environment
  // ===========================================================================
  local: {
    automaticObjectIdFiltering: true,
    compression: true,
    cookies: false,
    env: 'local',
    execAfterInit: 'npm run docs:bootstrap',
    filter: {
      maxLimit: null,
    },
    graphQl: {
      driver: {
        introspection: true,
        playground: true,
      },
      maxComplexity: 1000,
    },
    healthCheck: {
      configs: {
        database: {
          enabled: true,
        },
      },
      enabled: true,
    },
    hostname: '127.0.0.1',
    ignoreSelectionsForPopulate: true,
    jwt: {
      // Each secret should be unique and not reused in other environments,
      // also the JWT secret should be different from the Refresh secret!
      // crypto.randomBytes(512).toString('base64') (see https://nodejs.org/api/crypto.html#crypto)
      refresh: {
        renewal: true,
        // Each secret should be unique and not reused in other environments,
        // also the JWT secret should be different from the Refresh secret!
        // crypto.randomBytes(512).toString('base64') (see https://nodejs.org/api/crypto.html#crypto)
        // Can be created via [lenne.Tech CLI](https://github.com/lenneTech/cli): lt server createSecret
        // tslint:disable-next-line:max-line-length
        secret: 'SECRET_OR_PRIVATE_KEY_LOCAL_REFRESH',
        signInOptions: {
          expiresIn: '7d',
        },
      },
      sameTokenIdPeriod: 2000,
      // tslint:disable-next-line:max-line-length
      secret: 'SECRET_OR_PRIVATE_KEY_LOCAL',
      signInOptions: {
        expiresIn: '1m',
      },
    },
    loadLocalConfig: false,
    logExceptions: true,
    mongoose: {
      modelDocumentation: false,
      uri: 'mongodb://127.0.0.1/nuxt-playground',
    },
    port: 3000,
    security: {
      checkResponseInterceptor: {
        checkObjectItself: false,
        debug: false,
        ignoreUndefined: true,
        mergeRoles: true,
        removeUndefinedFromResultArray: true,
        throwError: false,
      },
      checkSecurityInterceptor: true,
      mapAndValidatePipe: true,
    },
    sha256: true,
    staticAssets: {
      options: { prefix: '' },
      path: join(__dirname, '..', 'public'),
    },
    templates: {
      engine: 'ejs',
      path: join(__dirname, 'assets', 'templates'),
    },
  },
};

/**
 * Environment specific config
 *
 * default: local
 */
const env = process.env['NODE' + '_ENV'] || 'local';
const envConfig = config[env] || config.local;
console.info(`Configured for: ${envConfig.env}${env !== envConfig.env ? ` (requested: ${env})` : ''}`);
// Merge with localConfig (e.g. config.json)
if (envConfig.loadLocalConfig) {
  let localConfig;
  if (typeof envConfig.loadLocalConfig === 'string') {
    import(envConfig.loadLocalConfig)
      .then((loadedConfig) => {
        localConfig = loadedConfig.default || loadedConfig;
        merge(envConfig, localConfig);
      })
      .catch(() => {
        console.info(`Configuration ${envConfig.loadLocalConfig} not found!`);
      });
  } else {
    // get config from src directory
    import(join(__dirname, 'config.json'))
      .then((loadedConfig) => {
        localConfig = loadedConfig.default || loadedConfig;
        merge(envConfig, localConfig);
      })
      .catch(() => {
        // if not found try to find in project directory
        import(join(__dirname, '..', 'config.json'))
          .then((loadedConfig) => {
            localConfig = loadedConfig.default || loadedConfig;
            merge(envConfig, localConfig);
          })
          .catch(() => {
            console.info('No local config.json found!');
          });
      });
  }
}

/**
 * Export envConfig as default
 */
export default envConfig;
