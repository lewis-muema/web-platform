<template lang="html">
  <div class="complete-outer">
    <div class="complete-header">
      Congratulations
    </div>
    <div class="complete-contents">
      <div class="complete-pair">
        <p>You can now enjoy Sendy services at work and at home!</p>
        <p>Woah - that’s double the convenience!</p>
      </div>
      <div class="complete-pair">
        <p>Your two accounts have now been connected and you can access either account with your one selected password.</p>
        <p>Login at any time to your two account profiles using the emails below.</p>
      </div>
      <div class="complete-pair">
        <p>{{this.getBizName}}: {{this.getBizEmail}}</p>
        <p>Personal: {{this.getPerEmail}}</p>
      </div>
    </div>
    <div class="complete-continue">
      <a class="btn-submit mid" :href="this.getBaseUrl">Continue to App</a>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'

export default {
  name: 'complete-component',
  computed: {
    ...mapGetters(
      {
         getBizName:'$_external/getBizName',
         getBizEmail:'$_external/getBizEmail'
        // 'getBaseUrl',
        // 'getBizName',
        // 'getBizEmail',
        // 'getPerEmail'
      }
    )
  }
}
</script>

<style lang="css">
.complete-outer
{
  margin: 1% 10%;
}
.complete-header
{
  font-size: 28px;
  text-align: center;
  font-weight: 500;
  margin-bottom: 30px;
}
.complete-contents
{
  font-size: initial;
  text-align: center;
}
.complete-pair
{
  margin-bottom: 30px;
}
.complete-continue
{
  display: flex;
  margin-top: 5%;
  padding-top: 5%;
  border-top: 1px solid #c2c3c4;
  align-items: center;
  justify-content: center;
}
.mid
{
  text-align: center;
  height: 20px;
}
</style>
