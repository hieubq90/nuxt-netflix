import Vue3Toasity, { type ToastContainerOptions } from 'vue3-toastify'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(Vue3Toasity, {
    autoClose: 1000,
    // ...
  } as ToastContainerOptions)
})
