/* eslint-disable import/prefer-default-export */
import Vue from 'vue';
import { sync } from 'vuex-router-sync';

import moment from 'moment';

// import Element from "element-ui";
// import "element-ui/lib/theme-chalk/index.css";

import lang from 'element-ui/lib/locale/lang/en';
import locale from 'element-ui/lib/locale';

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
} from 'element-ui';

import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import exportFromJSON from 'export-from-json';
import { createStore } from './store';
import { createRouter } from './router';
import App from './App.vue';

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
Vue.use(exportFromJSON);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
Vue.component('font-awesome-icon', FontAwesomeIcon);
export function createApp() {
  // create router and store instances
  const router = createRouter();
  const store = createStore();

  // sync so that route state is available as part of the store
  sync(store, router);

  // create the app instance, injecting both the router and the store
  const app = new Vue({
    router,
    store,
    render: h => h(App),
  });

  // expose the app, the router and the store.
  return { app, router, store };
}
