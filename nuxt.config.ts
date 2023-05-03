import { pwa } from './config/pwa'
import { appDescription } from './constants/index'

export default defineNuxtConfig({
  modules: [
    '@nuxtjs/supabase',
    '@vueuse/nuxt',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@vite-pwa/nuxt',
    [
      '@vee-validate/nuxt',
      {
        // disable or enable auto imports
        autoImports: true,
        // Use different names for components
        componentNames: {
          Form: 'VeeForm',
          Field: 'VeeField',
          FieldArray: 'VeeFieldArray',
          ErrorMessage: 'VeeErrorMessage',
        },
      },
    ],
    [
      '@invictus.codes/nuxt-vuetify',
      {
        /* vuetify options */
        vuetifyOptions: {
          // @TODO: list all vuetify options
        },
        moduleOptions: {
          /* nuxt-vuetify module options */
          treeshaking: true,
          useIconCDN: true,
          /* vite-plugin-vuetify options */
          styles: 'sass',
          autoImport: true,
        },
      },
    ],
  ],

  experimental: {
    // when using generate, payload js assets included in sw precache manifest
    // but missing on offline, disabling extraction it until fixed
    payloadExtraction: false,
    inlineSSRStyles: false,
    renderJsonPayloads: true,
  },

  css: [
    // '@unocss/reset/tailwind.css',
    'vue3-toastify/dist/index.css',
    'assets/styles/main.scss',
  ],

  // vuetify: {
  //   /* vuetify options */
  //   vuetifyOptions: {
  //     // @TODO: list all vuetify options
  //   },
  //   moduleOptions: {
  //     /* nuxt-vuetify module options */
  //     treeshaking: true | false,
  //     useIconCDN: true | false,
  //     /* vite-plugin-vuetify options */
  //     styles: true | 'none' | 'expose' | 'sass' | { configFile: string },
  //     autoImport: true | false,
  //   },
  // },

  colorMode: {
    classSuffix: '',
  },

  nitro: {
    esbuild: {
      options: {
        target: 'esnext',
      },
    },
    prerender: {
      crawlLinks: false,
      routes: ['/'],
      ignore: ['/hi'],
    },
  },

  app: {
    head: {
      viewport: 'width=device-width,initial-scale=1',
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'icon', type: 'image/svg+xml', href: '/nuxt.svg' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: appDescription },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      ],
      title: 'My Netflix',
    },
  },

  pwa,

  devtools: {
    enabled: true,
  },
})
