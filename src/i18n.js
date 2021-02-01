import Vue from 'vue';
import VueI18n from 'vue-i18n';
import axios from 'axios';
import { createStore } from './store'

Vue.use(VueI18n);

const store = createStore();

function loadLocaleMessages() {
  const locales = require.context('./locales/locales', true, /[A-Za-z0-9-_,\s]+\.js$/i);
  const messages = {};

  locales.keys().forEach((key) => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key).default;
    }
  });
  return messages;
}


const i18n = new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: loadLocaleMessages(),
});

function fetchCountry() {
  axios('https://extreme-ip-lookup.com/json')
    .then((response) => {
      i18n.locale = response.data.countryCode === 'CIV' ? 'fr' : 'en';
      const lang = response.data.countryCode === 'CIV' ? 'fr' : 'en-US,en;q=0.9';
      store.commit('setLanguage', lang);
    })
    .catch(error => error);
}

fetchCountry();

export default i18n;
