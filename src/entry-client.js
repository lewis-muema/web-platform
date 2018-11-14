import { createApp } from './app'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

// client-specific bootstrapping logic...

const { app, router, store } = createApp()

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDTsp-JumEjWjNNPjPuH5qJEWdFjtQvTsU',
    libraries: 'places', // required if using the Autocomplete plugin
  },
})

if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__)
}

// this assumes App.vue template root element has `id="app"`
router.onReady(() => {
  app.$mount('#app')
})
