<template>
  <div
    id="app"
    class="box app app-overflow"
  >
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
import VeeValidate, { Validator } from 'vee-validate';
import fr from 'vee-validate/dist/locale/fr';

const ENV = process.env.CONFIGS_ENV;

export default {
  name: 'App',
  data() {
    return {
      fcmToken: '',
      notificationData: '',
    };
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
      getPickUpFilledStatus: 'getPickUpFilledStatus',
      getLanguage: 'getLanguage',
    }),
    notification_status() {
      return this.$store.getters.getNotificationStatus;
    },
  },
  watch: {
    notification_status(val) {
      this.trackMixpanelEvent('Notification state', {
        'Notification Status': val,
      });

      if (val) {
        this.showNotification();
        this.trackMixpanelEvent('Notification initiated');
        this.showReschedulePopup();
      }
    },
    // watch session so as to only update token on session
    getSession(val) {
      if (val) {
        this.updateFirebaseToken();
      }
    },
    $route(to, from) {
      if (
        document.querySelector('.body').id.includes('beacon-active')
        && (to.path === '/auth' || to.path === '/auth/sign_in' || to.path === '/orders')
      ) {
        this.autoPopBeacon(2);
      }
    },
    getLanguage(val) {
      if (val === 'fr') {
        Validator.localize('fr', fr);
      }
    },
  },
  mounted() {
    // beacon click listener
    window.Beacon('on', 'open', () => {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      try {
        if (analyticsEnv === 'production') {
          window.ga('send', 'event', {
            eventCategory: 'Beacon Chat',
            eventAction: 'Click',
            eventLabel: 'Chat Icon - Beacon',
          });
        }
      } catch (er) {
        // ...
      }
    });
    if (this.getLanguage === 'fr') {
      Validator.localize('fr', fr);
    }
  },
  beforeMount() {
    if (ENV.DOMAIN !== 'localhost') {
      Sentry.init({
        dsn: ENV.SENTRY_DSN,
        integrations: [
          new Sentry.Integrations.Vue({
            Vue,
          }),
        ],
      });
    }
  },
  created() {
    this.$store.commit('setENV', ENV);
    if (process.browser) {
      // initilize firebase on load
      this.initializeFirebase();
      this.loadFCMListeners();
      this.detectAndroid();
      this.detectIOS();
      if (document.querySelector('.body').id.includes('beacon-active')) {
        this.autoPopBeacon(1);
      }
    }
  },
  methods: {
    loadFCMListeners() {
      const channel = new BroadcastChannel('sw-messages');
      channel.addEventListener('message', (event) => {
        const orderNo = event.data.focusOrder;
        if (orderNo !== undefined) {
          this.$router.push(event.data.url);
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
            this.trackMixpanelEvent('FCM Notification Recieved - Web', {
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
            this.trackMixpanelEvent('FCM Notification Recieved - Web', {
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
    showReschedulePopup() {
      if (Object.prototype.hasOwnProperty.call(this.notificationData.data, 'scheduled') && JSON.parse(this.notificationData.data.scheduled)) {
        this.$root.$emit('Show reschedule dialogue', this.notificationData);
      }
    },
    updateFirebaseToken() {
      const session = this.getSession;
      if (Object.keys(session).length > 0) {
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
      }
    },
    initializeFirebase() {
      if (firebase.messaging.isSupported()) {
        this.$messaging
          .requestPermission()
          .then(() => firebase.messaging().getToken())
          .then((token) => {
            this.fcmToken = token;
            if (token !== null) {
              this.$store.commit('setFCMToken', token);
              // check if session exists and if so update
              const session = this.getSession;
              // eslint-disable-next-line no-prototype-builtins
              if ({}.hasOwnProperty.call(session, 'default')) {
                this.updateFirebaseToken();
              }
            }
          })
          .catch((err) => {
            console.log('Unable to get permission to notify.', err);
            // TOOD: we could update this to force the user to give us notification permissions
          });

        this.$messaging.onMessage((payload) => {
          const notificationData = payload.data;
          this.notificationData = payload;
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
      }
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

    detectAndroid() {
      if (navigator.userAgent.match(/Android/i) && !this.$route.path.includes('reset_password')) {
        const notification = {
          title: 'Mobile redirect',
          level: 2,
          message:
            'We have detected you are using an android device. We will redirect you to the play store to download the app in the next few seconds for the best experience',
        };
        this.$store.commit('setNotification', notification);
        this.$store.commit('setNotificationStatus', true);
        this.trackMixpanelEvent('Redirect to the android app/store from mobile web');
        setTimeout(() => {
          window.location = 'https://play.app.goo.gl/?link=https://play.google.com/store/apps/details?id=com.sendy.co.ke.sendyy&ddl=1&pcampaignid=web_ddl_1';
        }, 10000);
      }
    },
    detectIOS() {
      if (
        (navigator.userAgent.match(/webOS/i)
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)
        || navigator.userAgent.match(/iPod/i))
        && !this.$route.path.includes('reset_password')
      ) {
        const notification = {
          title: 'Mobile redirect',
          level: 2,
          message:
            'We have detected you are using an IOS device. We will redirect you to the app store to download the app in the next few seconds for the best experience',
        };
        this.$store.commit('setNotification', notification);
        this.$store.commit('setNotificationStatus', true);
        this.trackMixpanelEvent('Redirect to the IOS app/store from mobile web');
        setTimeout(() => {
          window.location = 'itms://itunes.apple.com/us/app/sendy-delivery-app/id1088688361?mt=8';
        }, 10000);
      }
    },
    autoPopBeacon(id) {
      if (id === 1) {
        window.Beacon('on', 'ready', () => {
          this.beaconActions();
        });
      }
      if (id === 2) {
        this.beaconActions();
      }
    },
    beaconActions() {
      if (this.$route.path === '/auth' || this.$route.path === '/auth/sign_in') {
        window.Beacon('close');
        window.Beacon('open');
        window.Beacon('navigate', '/answers/');
        setTimeout(() => {
          window.Beacon('suggest', ['59d5bc412c7d3a40f0ed346c']);
        }, 2000);
      }
      if (this.$route.path === '/orders' && !this.getPickUpFilledStatus) {
        const session = this.$store.getters.getSession;
        window.Beacon('close');
        window.Beacon('open');
        window.Beacon('navigate', '/answers/');

        setTimeout(() => {
          window.Beacon('suggest', ['59d5e11f2c7d3a40f0ed34fe']);
          this.trackMixpanelEvent('Auto pop up helpscout beacon for order placement', {
            'user name': session[session.default].user_name,
            'user email': session[session.default].user_email,
            'user phone': session[session.default].user_phone,
          });
        }, 2000);
      }
    },
  },
};
</script>

<style lang="css">
@import 'https://fonts.googleapis.com/css?family=Nunito:300,400,500,700';
@import './assets/styles/app.css';
@import './assets/styles/overide.css';
</style>
