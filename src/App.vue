<template>
  <div id="app" class="box app app-overflow">
    <!-- Global component responsible for flashing notifications -->
    <sendy-flash details="" />

    <router-view class="box" />
  </div>
</template>

<script>
import * as Sentry from '@sentry/browser';
import Vue from 'vue';

const ENV = process.env.CONFIGS_ENV;

export default {
  name: 'App',
  computed: {
    notification_status() {
      // this is never always fired :-(
      return this.$store.getters.getNotificationStatus;
    },
  },
  beforeMount() {
    Sentry.init({
      dsn: ENV.SENTRY_DSN,
      integrations: [new Sentry.Integrations.Vue({ Vue })],
    });
  },
  watch: {
    notification_status(val, oldVal) {
      if (val) {
        this.showNotification();
      }
    },
  },
  created() {
    this.$store.commit('setENV', ENV);
  },
  methods: {
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
        notification.title,
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

        if (notification.title !== '' || notification.message !== '') {
          this.$notify({
            title: notification.title,
            message: notification.message,
          });
          20;
        }
      }
      // reset notification status
      this.$store.commit('setNotificationStatus', false);
    },
  },
};
</script>

<style lang="css">
@import url("https://fonts.googleapis.com/css?family=Rubik:300,400,500,700");
@import "./assets/styles/app.css";
@import "./assets/styles/overide.css";
</style>
