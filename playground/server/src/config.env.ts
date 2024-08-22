import {IServerOptions, merge} from '@lenne.tech/nest-server';
import {CronExpression} from '@nestjs/schedule';
import {join} from 'path';

/**
 * Configuration for the different environments
 * See: https://github.com/lenneTech/nest-server/blob/main/src/core/common/interfaces/server-options.interface.ts
 */
export const config: { [env: string]: Partial<IServerOptions> } = {
  // ===========================================================================
  // Local environment
  // ===========================================================================
  develop: {
    automaticObjectIdFiltering: true,
    compression: true,
    cookies: false,
    email: {
      defaultSender: {
        email: 'cade72@ethereal.email',
        name: 'Nest Server Starter Develop',
      },
      smtp: {
        auth: {
          pass: 'jpvTwGYeSajEqDvRKT',
          user: 'cade72@ethereal.email',
        },
        host: 'mailhog.lenne.tech',
        port: 1025,
        secure: false,
      },
    },
    env: 'develop',
    execAfterInit: 'npm run docs:bootstrap',
    filter: {
      maxLimit: null,
    },
    graphQl: {
      driver: {
        introspection: true,
        playground: true,
      },
      maxComplexity: 20,
    },
    healthCheck: {
      configs: {
        database: {
          enabled: true,
        },
      },
      enabled: true,
    },
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
        secret: 'o/z5QUeAoG20nezJgbvuYWq04eKWE49gNWznUIRBaqrOqRnWor+ClgF38nCnhRBJ39dK1Dr2MRTpWT+fUpnu6m/4Ce6/HNRlF829sCPkitpXZ0IQ6aHYaP55XLPvjbIM9o9umJTuIdNkWgQkf/IfDI2wHBEgUHJIATUuEVCs4Wh1/lrqZnWbPvtfNlCnZDBDJVvL6SedngjleFX0Ghb1a/Fl4lDqFsrChTgEII617e2aBbac6ypDivSPV+hWx/z3n6RoTaJaGEcIAOJuaLoXhUzCVExp4A2d6GGbfFD5tuBJgxCcVfjxSyuDRK9buo8hV6/P+W6WP2UXpoub7pQ/Y8bTiNDCVVPEOYeDZ/TDBZ8q2cOERFzZLInWE7U7CPytAtmrCsj0r+xMUEZt0hQ+4cOjyYvfuGPoy+E7hdfBOO5C6WoNyjdzNb+CdV7mb9UqZOg8wgYKltczdG0XWEcnadzJmYfGgFRhGr6qgT1/bnrfNIFEcIaErEU/OhQqk6Mmcix/3OPNHFilZllp2L0nwoNlTEqQdL79YqR4q/XD251kueb1Pxxv8YBhttJxTByDqCuHem8b5X1Xx92Od3HC3WaGPhkO4lLr7YOGNRoq3yFU1vtGCWv91hOD2dSRX5cAGmVLtQf9ZrUWROmuoRztGacowPqLsJwMp976pqKvego=_REFRESH',
        signInOptions: {
          expiresIn: '7d',
        },
      },
      sameTokenIdPeriod: 2000,
      // tslint:disable-next-line:max-line-length
      secret: 'SECRET_OR_PRIVATE_KEY_DEV',
      signInOptions: {
        expiresIn: '15m',
      },
    },
    loadLocalConfig: false,
    logExceptions: true,
    mongoose: {
      uri: 'mongodb://66c2f45ea24b957bdae39787_todo-db:27017/todo-develop',
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

  // ===========================================================================
  // Develop environment
  // ===========================================================================
  local: {
    automaticObjectIdFiltering: true,
    compression: true,
    cookies: false,
    cronJobs: {
      sayHello: {
        cronTime: CronExpression.EVERY_5_MINUTES,
        disabled: true,
        runOnInit: false,
        timeZone: 'Europe/Berlin',
      },
    },
    email: {
      defaultSender: {
        email: 'cade72@ethereal.email',
        name: 'Nest Server Starter Local',
      },
      smtp: {
        auth: {
          pass: 'jpvTwGYeSajEqDvRKT',
          user: 'cade72@ethereal.email',
        },
        host: 'mailhog.lenne.tech',
        port: 1025,
        secure: false,
      },
    },
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
      maxComplexity: 20,
    },
    healthCheck: {
      configs: {
        database: {
          enabled: true,
        },
      },
      enabled: true,
    },
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
        secret: 'uanN8iY0Qu6rS0PvYnbCfqnUHiX1PG19UzBlbdfKPsdpBtCupgAUQ2hIwhD+3iFGE0o6ErYRiEWLsMa92VZrgrhJBTZuVU8bZLsYqtgI3lc610sdYrGHJkl4LxQH0pimML19HL1XbtohNKbh1OcoB/QkeEcABi47ZeLwVt0mgXiMPuh0ATdV6Nsm4LPz4+D8U5qumN+qfM3KfD+lMg2Q8rE0RGLvZAtw0BqHm8ZudHJB2wlnb4FfoBxMHy+Ev6e0l4ysFrsEqUUgpiIvnc3BMz0Q42XPpxMr8hNObQT65Cl0362iHlphGCO2/9PSiQ6L7zWT2cvIHLKl1UDqQhnicYKosfHxxPnLhpmpTCTz8oGAVrn5pOjSXHKnaINuZvbeNt3GxP0e9SYx+I7h+KNIs8oOCiDshbacTgnpfqp9DON/gZAxYSV3GqeyZcc7R7Gd84U/WT/vuATHg2dR1jsJw90sBlWEGzY6AeXYfRIYK2H0iHFwiqlUzq5n2FxdSE06FTo1q9BU0LmDVJP55tvRuJPA/BpU1tglQHbe+a7RRq5irsMe5j2rmPIug/iUgkFAO7M4jG5m8KYmK/5jbRpKbUC4bG4cyreX9cqwu7l9Lpy1RVPR9OJxK/vKhJQXNSKRFfIl1ej32m8oxE3WmyaSujcOUlj4Rcia2egaooZqnZM=_REFRESH',
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
      uri: 'mongodb://127.0.0.1/todo-local',
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

  // ===========================================================================
  // Test environment
  // ===========================================================================
  preview: {
    automaticObjectIdFiltering: true,
    compression: true,
    cookies: false,
    email: {
      defaultSender: {
        email: 'cade72@ethereal.email',
        name: 'Nest Server Starter Preview',
      },
      smtp: {
        auth: {
          pass: 'jpvTwGYeSajEqDvRKT',
          user: 'cade72@ethereal.email',
        },
        host: 'mailhog.lenne.tech',
        port: 1025,
        secure: false,
      },
    },
    env: 'preview',
    execAfterInit: 'npm run docs:bootstrap',
    filter: {
      maxLimit: null,
    },
    graphQl: {
      driver: {
        introspection: true,
        playground: true,
      },
      maxComplexity: 20,
    },
    healthCheck: {
      configs: {
        database: {
          enabled: true,
        },
      },
      enabled: true,
    },
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
        secret: '9iGnA7yDUZK4SB8UZv84wZEjNUHUoYOzs16ZNXVcVP2ZO4YoGIJS+IuiG9h1kOsf31zpjcsG56pTgdGITW9eUF1dYFnI0gGOWwCJNFph3BkkNf+tEuoXAd/1y1aKJps+oVVALx1C5KRemIYVhUuc/mFjxWR2HbH+WKgbMiknvm89yyiNyMtm7EbB2lHzCWjAJr+04ePIqSAHbZ6uMu5K0nbQtz4DnrmdI4zGUCqsiA1YPgKy2JvqeXCxIO1swuL35yNZxiY8yg8AcfCVnyfxyzH7CJVo1NOBaWw1lM8B27uF0mLlmzFaDMJwDAhrmqO9TUoDdbS6t/zQ5TmBQjBroOoqo+pb4fsE6zKmF54f1doK92NhGoYQscubq6uMxqB2IhEVhGEDyz2cMoxCkXsftnYobUOMgpSpcsv/al2M97Jy9J3G0wWDMTEfyvh9AssRpEdYwGdfUNdhCKQa3Sb9FNbYKqPg1khVzpnsR4xI30qGtbjucPWdkt/Er3aMGA2djbw5dGoIKMM5/dRbcOM8cMDNN8g/di5U8lAdPgT0BDL5zrkjGbymMH0+9nWDwauTXoYYoM0ojdLMa/YICou+SHufSGLLaHjdVnb1y8uRCmKXqZ1R/Ow1TSw83jDuhk4VHBgPaV/gP750QQ/RI80ua4HK0K71CzhT/9z9FooBBic=_REFRESH',
        signInOptions: {
          expiresIn: '7d',
        },
      },
      sameTokenIdPeriod: 2000,
      // tslint:disable-next-line:max-line-length
      secret: 'SECRET_OR_PRIVATE_KEY_PREV',
      signInOptions: {
        expiresIn: '15m',
      },
    },
    loadLocalConfig: false,
    logExceptions: true,
    mongoose: {
      uri: 'mongodb://66c2f45ea24b957bdae39787_todo-db:27017/todo-preview',
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

  // ===========================================================================
  // Preview environment
  // ===========================================================================
  production: {
    automaticObjectIdFiltering: true,
    compression: true,
    cookies: false,
    email: {
      defaultSender: {
        email: 'cade72@ethereal.email',
        name: 'Nest Server Starter Productive',
      },
      smtp: {
        auth: {
          pass: 'jpvTwGYeSajEqDvRKT',
          user: 'cade72@ethereal.email',
        },
        host: 'mailhog.lenne.tech',
        port: 1025,
        secure: false,
      },
    },
    env: 'production',
    execAfterInit: 'npm run docs:bootstrap',
    filter: {
      maxLimit: null,
    },
    graphQl: {
      driver: {
        introspection: true,
        playground: false,
      },
      maxComplexity: 20,
    },
    healthCheck: {
      configs: {
        database: {
          enabled: true,
        },
      },
      enabled: true,
    },
    ignoreSelectionsForPopulate: true,
    jwt: {
      // Each secret should be unique and not reused in other environments,
      // also the JWT secret should be different from the Refresh secret!
      // crypto.randomBytes(512).toString('base64') (see https://nodejs.org/api/crypto.html#crypto)
      // Can be created via [lenne.Tech CLI](https://github.com/lenneTech/cli): lt server createSecret
      refresh: {
        renewal: true,
        // crypto.randomBytes(512).toString('base64') (see https://nodejs.org/api/crypto.html#crypto)
        // tslint:disable-next-line:max-line-length
        secret: 'ztz7ZCnwVR/d60pZDbfbkMV5UwqzMqiuABLLKHDRJkKCyK40aq0U8VOVzMJ+6XRkvOSn9+GYFJnTDqRKp/YmCgWGR+MDBoDgORCEx7olRc34u9Qz5ulWzuNAxpI/ZTPAe5UC64azBbqDjlj2QECV7iLv0LPPyIKbTEFPP7w67vfxwIspXVahNHUP41h4m/fhKOEM3AMCadUi8Fk3Dpr2FevbHJhqNwADDOtHSEmfUfohdIFZBHRRB2oi1fa1PABkXGgoxPgRbjsmwcznmLqm1jxxltWtt5W9UgB4psZj0Ue+Y0h+RNcfxeaJMtAtDO6F33NYT/9IJt8P+L6xPUWi2uoOZz5MOROg0jGv+v6I3rEU1lCZvoX5mcaLQCWsa5/pJhpI0jKA6QEe87y4xVcwiauOzmVNH37hUV2G2B1eeTy5rsWq5iJFasgCUUiYJBEwa/631J9sh+KF7AkbAu7Fd3lWxSa/vRy/MZqkuR0OMTuE7PT72uj1jpFSUSGuCUulp5uFj4oMJfkYwUP8ymynDIDniyUk7URK3IQUD1UIfdTVb5L/EnFf6o6SfbaynTVUhwGSLQvVZk2XVjIHx0VMDzKrFy4C4Kp2mM0dgfJDv21CAclWeg9cXCAtxn88Ipnc4ilNfhpkqXvMh2bmDpgwprAwpHBd5GZqbbQ0PoufmuY=_REFRESH',
        signInOptions: {
          expiresIn: '7d',
        },
      },
      sameTokenIdPeriod: 2000,
      // tslint:disable-next-line:max-line-length
      secret: 'SECRET_OR_PRIVATE_KEY_PROD',
      signInOptions: {
        expiresIn: '15m',
      },
    },
    loadLocalConfig: false,
    logExceptions: true,
    mongoose: {
      uri: 'mongodb://66c2f45ea24b957bdae39787_todo-db:27017/todo-prod',
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

  // ===========================================================================
  // Production environment
  // ===========================================================================
  test: {
    automaticObjectIdFiltering: true,
    compression: true,
    cookies: false,
    email: {
      defaultSender: {
        email: 'cade72@ethereal.email',
        name: 'Nest Server Starter Test',
      },
      smtp: {
        auth: {
          pass: 'jpvTwGYeSajEqDvRKT',
          user: 'cade72@ethereal.email',
        },
        host: 'mailhog.lenne.tech',
        port: 1025,
        secure: false,
      },
    },
    env: 'test',
    execAfterInit: 'npm run docs:bootstrap',
    filter: {
      maxLimit: null,
    },
    graphQl: {
      driver: {
        introspection: true,
        playground: true,
      },
      maxComplexity: 20,
    },
    healthCheck: {
      configs: {
        database: {
          enabled: true,
        },
      },
      enabled: true,
    },
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
        secret: 'CAj8arOBM9/a3Zyhbe1NRNWt/TZ4SlFdtMo3Eign0HtTJCBUj1dWpyPSy+AYCKd+byOLTzIG19JbE4+nuWFdm6kLodWEzBsPZ39w392/PYTv4BIekaowdHT6S4yE+TffeJcp0pG6SP5p6x/sPOlhN8HGt4GK3gSm/1UH+kyQz3+0TTFC5KWdxRsHz1M62uhU8Agmr0MIFuXfc78btKfDeam+chvPW4qjb5BsjM1qqKMThVxVv16syvgpA5tvd3sKQSqnzcGzPje4+4atGCOf9jF9sOW1zxeLHRgz8Owf9DoB2DxQMOxbS/Qni+HdE/v3PYqmLz971m1C4sy1w0EWEf+w4njmhgYhC7dzw9GozfJSG6uYJb2aGEySz3s0jixDadjwFoam4aTP9v10EZkA0eSNFo2QSE/eGUiEXudntYSeo/hctokLGQUt4NFUzB2TUiRvblAO1ERW1hSRkp6dVok2CrLAzRW3i8JcnhGIe5XUVKVzrTTTZnOLYxZxNBfUuOhSD4qgLtfszQxuJ0NobOboASYXjY3YpThc3j6+QYwjtG8w7VQjEzFhvNcCU1pwI+SQF9BAhDDrZsSTMq8tBretdcNR/pzIxLlQp0CgoKYdjaZjv+p33R607Hlx6GZrkDM0I66Zj7E/E8GIeje3s8lA/ipxxkY5OkvOGY9iRcs=_REFRESH',
        signInOptions: {
          expiresIn: '7d',
        },
      },
      sameTokenIdPeriod: 2000,
      // tslint:disable-next-line:max-line-length
      secret: 'SECRET_OR_PRIVATE_KEY_TEST',
      signInOptions: {
        expiresIn: '15m',
      },
    },
    loadLocalConfig: false,
    logExceptions: true,
    mongoose: {
      uri: 'mongodb://66c2f45ea24b957bdae39787_todo-db:27017/todo-test',
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
