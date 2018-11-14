<template lang="html">
  <div class="user-invite-header">
    <div class="container">
      <div class="row head">
        <div class="user-invite-logo">
          <a href="https://sendyit.com/"><img class="header-logo" src='https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/logo/Sendy_logo_3.png' alt="Sendy Logo"></a>
        </div>
      </div>
    </div>
    <div class="progress">
      <div class="determinate" :style="this.progress_width"></div>
  </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'header-component',
  components: {},
  data: function (){
    return{
      styleObject: {
        width: this.progress_width
      }
    }
  },
  computed: {
    ...mapGetters(
      {
        getViewState : '$_external/getViewState'
      }
    ),
    progress_width: function()
    {
      var real = (this.getViewState/4 *100) + '%'
      return {width:real}
    }
  }
}
</script>

<style lang="css">
.user-invite-header
{
  margin: 10px auto;
  width: 100%;
}
.header-logo
{
  max-height: 50px;
}
.determinate
{
  background-color: #1782c5 !important;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}
.head
{
  margin-bottom: 0px !important;
}
.progress{
  position: relative;
  height: 4px;
  display: block;
  width: 100%;
  background-color: #acece6;
  border-radius: 2px;
  margin: .5rem 0 1rem 0;
  overflow: hidden;
}
/* .progress.determinate{
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  transition: width .3s linear;
} */
</style>
