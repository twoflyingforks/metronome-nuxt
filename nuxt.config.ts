// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite';

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', 'shadcn-nuxt'],
  devtools: { enabled: true },
  css: ['~/assets/css/tailwind.css'],
  compatibilityDate: '2025-05-15',
  vite: {
    plugins: [tailwindcss()],
  },
  // eslint: {
  //   config: {
  //     stylistic: false, // Keep this if you want to disable other stylistic rules
  // },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui',
  },
});
