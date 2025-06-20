// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/icon',
    '@nuxt/scripts',
    '@nuxt/ui',
    'nuxt-auth-sanctum',
  ],
  css: ['~/assets/css/main.css'],
  sanctum: {
    baseUrl: 'http://api.todo.test',
  },
  devServer: {
    host: 'todo.test'
  }
})