export default defineNuxtConfig({
  devServer: {
    port: 3001,
  },
  modules: ['../../src/module'],
  nuxtBase: {
    generateTypes: process.env['GENERATE_TYPES'] === '1',
    host: 'http://localhost:3000/graphql',
    schema: '../server/schema.gql',
    storagePrefix: 'playground',
  },
  srcDir: './src',
});
