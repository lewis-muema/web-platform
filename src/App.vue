<template>
  <div id="app" class="box app">
    <router-view class="box"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style lang="css">
@import './assets/fonts/font.css';
html, .body{
    margin: 0;
    height: 100%;
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
.box
{
  display: flex;
  flex-flow: column;
  height: 100%;
}

.box .header
{
  flex: 0 1 auto;
}

.box .content
{
  display: flex;
  flex-flow: column;
  flex: 1 1 auto;
  overflow-y: auto;
}
</style>
