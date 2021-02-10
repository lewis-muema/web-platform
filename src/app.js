/* eslint-disable import/prefer-default-export */
/* eslint no-unused-vars: "error" */
/* exported exportFromJSON */
import Vue from 'vue';
import { sync } from 'vuex-router-sync';
import { ApmVuePlugin } from '@elastic/apm-rum-vue';

import moment from 'moment';
import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';
import VueGeolocation from 'vue-browser-geolocation';
import vueCountryRegionSelect from 'vue-country-region-select';

import {
  Pagination,
  Dropdown,
  Dialog,
  DropdownMenu,
  DropdownItem,
  Input,
  InputNumber,
  Radio,
  Checkbox,
  Select,
  Option,
  Button,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Icon,
  Rate,
  Steps,
  Step,
  Row,
  Col,
  Loading,
  MessageBox,
  Message,
  Notification,
  Popover,
  RadioGroup,
  RadioButton,
  Autocomplete,
  Upload,
  CheckboxGroup,
} from 'element-ui';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueMask from 'v-mask';
import { createStore } from './store';
import { createRouter } from './router';
import App from './App.vue';
import i18n from './i18n';

Vue.prototype.moment = moment;
// configure language
locale.use(lang);

Vue.use(Pagination);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Dropdown);
Vue.use(Dialog);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(Steps);
Vue.use(Step);
Vue.use(Select);
Vue.use(Row);
Vue.use(Col);
Vue.use(Option);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimeSelect);
Vue.use(TimePicker);
Vue.use(Icon);
Vue.use(Rate);
Vue.use(Popover);
Vue.use(Autocomplete);
Vue.use(Loading.directive);
Vue.use(VueGeolocation);
Vue.use(VueMask);
Vue.use(Upload);
Vue.use(vueCountryRegionSelect);
Vue.use(CheckboxGroup);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.component('font-awesome-icon', FontAwesomeIcon);

require('./views');
const firebase = require('firebase/app');
require('firebase/messaging');

const config = process.env.CONFIGS_ENV.FIREBASE_CONFIG;

if (process.browser) {
  firebase.initializeApp(config);

  if (firebase.messaging.isSupported()) {
    Vue.prototype.$messaging = firebase.messaging();
  }
}

export function createApp() {
  if (process.browser) {
    // initialize firebase
    navigator.serviceWorker
      .register('./firebase-messaging-sw.js', { scope: './' })
      .then((registration) => {
        Vue.prototype.$messaging.useServiceWorker(registration);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.log(err);
      });
  }
  // create router and store instances
  const router = createRouter();
  const store = createStore();

  // sync so that route state is available as part of the store
  sync(store, router);

  // apm plugin configuration
  Vue.use(ApmVuePlugin, {
    router,
    config: {
      serviceName: process.env.CONFIGS_ENV.ELASTIC_APM_SERVICE_NAME,
      // agent configuration
      serverUrl: process.env.CONFIGS_ENV.ELASTIC_APM_SERVER_URL,
      serviceVersion: process.env.CONFIGS_ENV.ELASTIC_APM_SERVICE_VERSION,
      environment: process.env.CONFIGS_ENV.ELASTIC_APM_ENVIRONMENT,
      distributedTracingOrigins: [process.env.CONFIGS_ENV.ELASTIC_APM_DISTRIBUTED_TRACING_ORIGINS],
    },
  });

  // create the app instance, injecting both the router and the store
  const app = new Vue({
    router,
    store,
    i18n,
    render: h => h(App),
  });

  // expose the app, the router and the store.
  return { app, router, store };
}
