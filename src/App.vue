<template>
  <div id="app"
class="box app app-overflow">
    <!-- Global component responsible for flashing notifications -->
    <sendy-flash details />

    <router-view class="box" />
  </div>
</template>

<script>
import * as Sentry from '@sentry/browser';
import Vue from 'vue';
import firebase from 'firebase/app';
import { mapGetters } from 'vuex';

const ENV = process.env.CONFIGS_ENV;

export default {
  name: 'App',
  data() {
    return {
      fcmToken: '',
    };
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
      getNotificationStatus: 'getNotificationStatus',
    }),
  },
  watch: {
    getNotificationStatus(val) {
      if (val) {
        this.showNotification();
      }
    },
    // watch session so as to only update token on session
    getSession(val) {
      if (val) {
        this.updateFirebaseToken();
      }
    },
  },
  beforeMount() {
    Sentry.init({
      dsn: ENV.SENTRY_DSN,
      integrations: [
        new Sentry.Integrations.Vue({
          Vue,
        }),
      ],
    });
  },
  created() {
    this.$store.commit('setENV', ENV);
    if (process.browser) {
      // initilize firebase on load
      this.initializeFirebase();
      this.loadFCMListeners();
    }
  },
  methods: {
    loadFCMListeners() {
      const channel = new BroadcastChannel('sw-messages');
      channel.addEventListener('message', (event) => {
        const orderNo = event.data.focusOrder;
        if (orderNo !== undefined) {
          this.$router.push({
            name: 'tracking',
            params: {
              order_no: orderNo,
            },
          });
        }
      });

      const logsChannel = new BroadcastChannel('sw-logs');
      logsChannel.addEventListener('message', (event) => {
        const { logAction, logData } = event.data;
        const session = this.getSession;
        // eslint-disable-next-line no-prototype-builtins
        if ({}.hasOwnProperty.call(session, 'default')) {
          if (logAction === 'notification') {
            // add log for notification recieved
            this.trackMixpanelEvent('FCM Notification Received - Web', {
              'Order No': logData.order_no,
              'Cop Id': session[session.default].cop_id,
              'User Id': session[session.default].user_id,
            });
          }

          if (logAction === 'click') {
            // add log for notification clicked
            this.trackMixpanelEvent('FCM Notification Clicked - Web', {
              'Order No': logData.order_no,
              'Cop Id': session[session.default].cop_id,
              'User Id': session[session.default].user_id,
            });
          }
        } else {
          // no session
          if (logAction === 'notification') {
            // add log for notification recieved
            this.trackMixpanelEvent('FCM Notification Received - Web', {
              'Order No': logData.order_no,
            });
          }

          if (logAction === 'click') {
            // store redirect details for after login use
            this.$store.commit('setRedirectStatus', true);
            this.$store.commit('setRedirectOrder', logData.order_no);

            // add log for notification clicked
            this.trackMixpanelEvent('FCM Notification Clicked - Web', {
              'Order No': logData.order_no,
            });
          }
        }
      });
    },
    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },
    updateFirebaseToken() {
      const session = this.getSession;
      const fcmPayload = {
        client_type: 'corporate',
      };
      if (session.default === 'biz') {
        fcmPayload.cop_user_id = session[session.default].user_id;
      } else {
        fcmPayload.user_id = session[session.default].user_id;
      }

      fcmPayload.token = this.$store.getters.getFCMToken;

      const payload = {
        values: fcmPayload,
        app: 'NODE_PRIVATE_API',
        vm: this,
        endpoint: 'firebase_token',
      };

      this.$store
        .dispatch('requestAxiosPost', payload)
        .then(response => response)
        .catch(err => err);
    },
    initializeFirebase() {
      this.$messaging
        .requestPermission()
        .then(() => firebase.messaging().getToken())
        .then((token) => {
          this.fcmToken = token;
          this.$store.commit('setFCMToken', token);

          // check if session exists and if so update
          const session = this.getSession;
          // eslint-disable-next-line no-prototype-builtins
          if ({}.hasOwnProperty.call(session, 'default')) {
            this.updateFirebaseToken();
          }
        })
        .catch((err) => {
          console.log('Unable to get permission to notify.', err);
          // TOOD: we could update this to force the user to give us notification permissions
        });

      this.$messaging.onMessage((payload) => {
        const notificationData = payload.data;
        const orderNo = notificationData.order_no;

        this.$store.commit('setFCMData', notificationData);

        // fire internal notification
        const level = 1;
        const notification = {
          title: payload.notification.title,
          level,
          message: payload.notification.body,
        };
        this.$store.commit('setNotification', notification);
        this.$store.commit('setNotificationStatus', true);

        // redirect to tracking page when order no has been provided
        // TODO : create new logic for internal redirects

        // TODO: fire different events to act on message recieved
        // proposed central notifications actor class to process different types of notifiacations
      });
    },
    showNotification() {
      const notification = this.$store.getters.getNotification;
      if (notification.level === 0) {
        // success
        this.$notify.info({
          title: notification.title,
          message: notification.message,
          offset: 20,
          duration: 5000,
        });
      } else if (notification.level === 1) {
        // success
        this.$notify({
          type: 'success',
          title: notification.title,
          message: notification.message,
          offset: 20,
          duration: 5000,
        });
      } else if (notification.level === 2) {
        // warning
        this.$notify({
          title: notification.title,
          message: notification.message,
          type: 'warning',
          offset: 20,
          duration: 5000,
        });
      } else if (notification.level === 3) {
        // error
        this.$notify({
          type: 'error',
          message: notification.message,
          offset: 20,
          duration: 5000,
        });
      } else {
        // default
        // check to make sure that either title or message is set
        // reset notification status

        // eslint-disable-next-line no-lonely-if
        if (notification.title !== '' || notification.message !== '') {
          this.$notify({
            title: notification.title,
            message: notification.message,
            offset: 20,
            duration: 5000,
          });
        }
      }
      // reset notification status
      this.$store.commit('setNotificationStatus', false);
    },
  },
};
</script>

<style lang="css">
@import url('https://fonts.googleapis.com/css?family=Rubik:300,400,500,700');
@import './assets/styles/app.css';
@import './assets/styles/overide.css';
</style>
