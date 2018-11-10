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

<style>
.body{
    margin: unset
}
.app {
  font-family: 'Helvetica Neue', Helvetica, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
