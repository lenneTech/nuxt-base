export default defineNuxtConfig({
  modules: ['../src/module'],
  srcDir: './src',
  devServer: {
    port: 3001,
  },
  nuxtBase: {
    host: 'http://localhost:3000/graphql',
    schema: './playground/schema.gql',
    generateTypes: true,
    apollo: {
      authType: 'Bearer',
      authHeader: 'Authorization',
      tokenStorage: 'cookie',
      proxyCookies: true,
    },
  },
});
