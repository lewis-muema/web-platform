<template>
  <div id="app" class="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="css">
@import './assets/fonts/font.css';
.body{
    margin: 0;
}
.app {
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
}
.container
{
  width: 90%;
  margin: 0px auto;
}
</style>
