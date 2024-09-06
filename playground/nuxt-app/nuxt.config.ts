export default defineNuxtConfig({
  compatibilityDate: '2024-08-26',
  devServer: {
    port: 3001,
  },

  experimental: {
    asyncContext: true,
    renderJsonPayloads: false,
    typedPages: true,
  },

  modules: ['../../src/module', '@nuxtjs/tailwindcss'],

  nuxtBase: {
    generateTypes: process.env['GENERATE_TYPES'] === '1',
    gqlHost: 'http://localhost:3000/graphql',
    host: 'http://localhost:3000',
    schema: '../server/schema.gql',
    storagePrefix: 'playground',
  },

  srcDir: './src',

  ssr: true,
});
