export default defineNuxtConfig({
  modules: ['../src/module'],
  nuxtBase: {
    host: 'https://api.todo.lenne.tech/graphql'
  }
})
