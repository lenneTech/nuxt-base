export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  modules: ['../src/module'],
  nuxtBase: {
    apollo: {
      authHeader: 'Authorization',
      authType: 'Bearer',
      proxyCookies: true,
      tokenStorage: 'cookie',
    },
    generateTypes: process.env['GENERATE_TYPES'] === '1',
    host: 'http://localhost:3000/graphql',
    schema: './playground/schema.gql',
  },
  srcDir: './src',
});
