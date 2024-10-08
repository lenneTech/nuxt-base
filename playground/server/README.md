# server
Nuxt playground server for testing

## Requirements

- [Node.js incl. npm](https://nodejs.org):
the runtime environment for your server

- [MongoDB](https://docs.mongodb.com/manual/installation/#mongodb-community-edition-installation-tutorials)
the database for your objects


## Start the server

`$ npm run start:dev`


## Extend the server

This server is based on [lenne.Tech Nest Server](https://github.com/lenneTech/nest-server).

Since the lenne.Tech Nest Server is based on [Nest](https://nestjs.com/), you can find all information about extending
the **server** in the [documentation of Nest](https://docs.nestjs.com/).

The documentation of the extensions and auxiliary classes that the
[lenne.Tech Nest Server](https://github.com/lenneTech/nest-server) contains is currently under construction.
As long as this is not yet available,have a look at the
[source code](https://github.com/lenneTech/nest-server/tree/master/src/core).
There you will find a lot of things that will help you to extend your server, such as:

- [GraphQL scalars](https://github.com/lenneTech/nest-server/tree/master/src/core/common/scalars)
- [Filter and pagination](https://github.com/lenneTech/nest-server/tree/master/src/core/common/args)
- [Decorators for restrictions and roles](https://github.com/lenneTech/nest-server/tree/master/src/core/common/decorators)
- [Authorisation handling](https://github.com/lenneTech/nest-server/tree/master/src/core/modules/auth)
- [Ready to use user module](https://github.com/lenneTech/nest-server/tree/master/src/core/modules/user)
- [Common helpers](https://github.com/lenneTech/nest-server/tree/master/src/core/common/helpers) and
[helpers for tests](https://github.com/lenneTech/nest-server/blob/master/src/test/test.helper.ts)
- ...


## Further information

### Running the app

```bash
# Development
$ npm start

# Watch mode
$ npm run start:dev

# Production mode
$ npm run start:prod
```

### Test

```bash
# e2e tests
$ npm run test:e2e
```
