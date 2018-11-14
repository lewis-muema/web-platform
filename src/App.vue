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
@import './assets/styles/overide.css';
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
  min-height: 68px;
  flex: 0 1 auto;
}

.box .content
{
  display: flex;
  flex-flow: column;
  flex: 1 1 auto;
  overflow-y: auto;
}
.input-control
{
  height: 42px;
  width: 100%;
  font-size: 14px;
  line-height: 1.42857143;
  color: #555;
  padding: 6px 12px;
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
</style>
