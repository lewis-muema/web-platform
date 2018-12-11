import { createApp } from './app'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

// client-specific bootstrapping logic...

const { app, router, store } = createApp()

Vue.use(VueGoogleMaps, {
  load: {
    libraries: ['places','geometry'],
    key: process.env.CONFIGS_ENV['GOOGLE_API_KEY']
  },
})

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// this assumes App.vue template root element has `id="app"`
router.onReady(() => {
  app.$mount('#app')
})
