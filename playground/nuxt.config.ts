export default defineNuxtConfig({
  modules: ['../src/module'],
  nuxtBase: {
    host: 'https://swapi-graphql.netlify.app/.netlify/functions/index'
  }
})
