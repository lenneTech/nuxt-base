export default defineNuxtConfig({
  modules: ['../src/module'],
  nuxtBase: {
    host: 'https://api.suedwestfalen-aktiv.de/graphql'
  }
})
