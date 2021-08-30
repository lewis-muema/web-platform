/* eslint no-underscore-dangle: 0 */
import Vue from 'vue';
import 'vue-tel-input/dist/vue-tel-input.css';
import * as VueGoogleMaps from 'vue2-google-maps';
import VueTelInput from 'vue-tel-input';
import { createApp } from './app';


// client-specific bootstrapping logic...

const { app, router, store } = createApp();

Vue.use(VueGoogleMaps, {
  load: {
    libraries: ['places', 'geometry'],
    key: process.env.CONFIGS_ENV.GOOGLE_API_KEY,
  },
});
Vue.use(VueTelInput);
if (window.__INITIAL_STATE__) {
  store.replaceState(window.__INITIAL_STATE__);
}

// this assumes App.vue template root element has `id="app"`
router.onReady(() => {
  app.$mount('#app');
});

window.events = new Vue();

/*
 * Bootstrap application with global functions
 * NB: Keep this at a minimum (Only 5 allowed at most)
 */
window.flash = (details) => {
  window.events.$emit('flash', details);
};
