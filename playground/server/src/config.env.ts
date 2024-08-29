import {IServerOptions, merge} from '@lenne.tech/nest-server';
import {CronExpression} from '@nestjs/schedule';
import {join} from 'path';

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
        secret: 'yXMe0vDRswXrhVcNL4pzcQUSrHEftxF8bUD1eH9E+rLCfIWKDCc6VTB7ejXXLwYHuDxXX3uhWUCuf5v0TwhepdOCSUFs+LppZ9oEYw3lWdIPvHPdy+N3IgWT/By1MWlGvb00kRxH/ZCQM3rUSLlnLGkbWZFgoDIsj62NLyph4yYA7GzXhw/5dY2V9pOavMfjSVXKQmUyZJ7OjKmzWdRTRzXWvToPpjfCeohkSbOOjVP1th/cxWInEiAh6AihgJ/yMAul42gUK7eHWy5u587gtqVEokLZJYznz8njQP3tgrcL0DaNluEWPK0wgXWId1FDwey1i7hC+tbveRVb3BiEIGJgK+5eDa6QJDobqA9F5p9u6DLIp/ux4lgw7OD2xmavmi6HJ32rg+Lqawm/WUlkVVHbqX39ubLnxdGOgg8YDDa8pUbcxacTPy51kHx17rJUAHA6g34Q9rxFSCSbGs+zCwwf5Sm2ftG3M4fvtHk2paY1sWeBoiK/YT0rBuTb48Enh7KrYA7JgBk9QXr49tUubjUM6r/NUmqoModmVoYLHJhW50HZCOfCfDvE06n/ANTBNgbAxJeL3cuO0h+K3LmhjOEp2itCXejDz/yh7KhDuohm0SaChpNjaBATil7aR1OHt1hio9pOsmkp/ejVURfLmUFgUBokR1ObnEK6qD2NyN4=_REFRESH',
        signInOptions: {
          expiresIn: '7d',
        },
      },
      sameTokenIdPeriod: 2000,
      // tslint:disable-next-line:max-line-length
      secret: 'SECRET_OR_PRIVATE_KEY_LOCAL',
      signInOptions: {
        expiresIn: '15m',
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
    import(envConfig.loadLocalConfig).then((loadedConfig) => {
      localConfig = loadedConfig.default || loadedConfig;
      merge(envConfig, localConfig);
    }).catch(() => {
      console.info(`Configuration ${envConfig.loadLocalConfig} not found!`);
    });
  } else {
    // get config from src directory
    import(join(__dirname, 'config.json')).then((loadedConfig) => {
      localConfig = loadedConfig.default || loadedConfig;
      merge(envConfig, localConfig);
    }).catch(() => {
      // if not found try to find in project directory
      import(join(__dirname, '..', 'config.json')).then((loadedConfig) => {
        localConfig = loadedConfig.default || loadedConfig;
        merge(envConfig, localConfig);
      }).catch(() => {
        console.info('No local config.json found!');
      });
    });
  }
}

/**
 * Export envConfig as default
 */
export default envConfig;
