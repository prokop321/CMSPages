// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  app: {
    baseURL: "/CMSPages/",
  },
  modules: ["@pinia/nuxt", "@nuxtjs/tailwindcss", "@nuxtjs/mdc"],
  css: ["~/assets/css/main.scss"],
  ssr: false,
});
