<template lang="html">
  <div>
    <div class="daily--stats--loading-title">
      {{ stats_loading_title }}
    </div>
    <div class="user--bypass-loader" />
  </div>
</template>

<script>

export default {
  name: 'LoadingComponent',
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    stats_loading_title() {
      return this.$t('loadingComponent.verify');
    },
  },
  methods: {},
};
</script>

<style lang="css">
.user--bypass-loader,
.user--bypass-loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.user--bypass-loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid #2c82c5;
  border-right: 1.1em solid #f3f3f3;
  border-bottom: 1.1em solid #f3f3f3;
  border-left: 1.1em solid #f3f3f3;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
