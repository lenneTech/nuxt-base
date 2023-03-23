export default defineNuxtConfig({
  modules: ['../src/module'],
  nuxtBase: {
    host: 'http://localhost:3000/graphql'
  }
})
