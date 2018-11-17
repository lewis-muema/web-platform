<template>
  <div id="app" class="box app">
    <router-view class="box"></router-view>
  </div>
</template>

<script>
const ENV = process.env.NODE_ENV;
export default {
  name: 'app',
  created() {
    this.$store.commit('setENV', ENV);  
  }
};
</script>

<style lang="css">
@import url('https://fonts.googleapis.com/css?family=Rubik:300,400,500,700');
@import './assets/styles/app.css';
@import './assets/styles/overide.css';

</style>
