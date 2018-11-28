<template>
  <div id="app" class="box app">
    <router-view class="box"></router-view>
  </div>
</template>

<script>
const ENV = process.env.CONFIGS_ENV;
export default {
  name: "app",
  created() {
    this.$store.commit("setENV", ENV);
  },
  computed: {
    notification_status() {
      //this is never always fired :-(
      return this.$store.getters.getNotificationStatus;
    }
  },
  methods: {
    showNotification() {
      console.log("somebody is trying to show a notification");
      let notification = this.$store.getters.getNotification;

      if (notification.level == 1) {
        //success
        this.$notify({
          type: "success",
          title: notification.title,
          message: notification.message,
          offset: 20
        });
      } else if (notification.level == 2) {
        //warning
        this.$notify({
          title: notification.title,
          message: notification.message,
          type: "warning",
          offset: 20
        });
      } else if (notification.level == 3) {
        //error
        title: notification.title,
          this.$notify({
            type: "error",
            message: notification.message,
            offset: 20
          });
      } else {
        //default
        //check to make sure that either title or message is set
        //reset notification status

        if (notification.title !== "" || notification.message !== "") {
          this.$notify({
            title: notification.title,
            message: notification.message
          });
          offset: 20;
        }
      }
      //reset notification status
      this.$store.commit("setNotificationStatus", false);
    }
  },
  watch: {
    notification_status(val, oldVal) {
      console.log(val);
      if (val == true) {
        this.showNotification();
      }
    }
  }
};
</script>

<style lang="css">
@import url("https://fonts.googleapis.com/css?family=Rubik:300,400,500,700");
@import "./assets/styles/app.css";
@import "./assets/styles/overide.css";
</style>
