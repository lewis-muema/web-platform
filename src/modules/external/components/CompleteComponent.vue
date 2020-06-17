<template lang="html">
  <div class="complete-outer">
    <div class="complete-header">
      Congratulations
    </div>
    <div class="complete-contents">
      <div class="complete-pair">
        <p>You can now enjoy Sendy services at work and at home!</p>
        <p v-if="getPerEmail !== ''">
          Woah - that’s double the convenience!
        </p>
      </div>
      <div
        v-if="getPerEmail !== ''"
        class="complete-pair"
      >
        <p>
          Your two accounts have now been connected and you can access either account with your one
          selected password.
        </p>
        <p>Login at any time to your two account profiles using the emails below.</p>
      </div>
      <div
        v-else
        class="complete-pair"
      >
        <p>
          Your account has now been created and you can access the account with your
          selected password.
        </p>
        <p>Login at any time to your account profile using the email below.</p>
      </div>
      <div class="complete-pair">
        <p>{{ getBizName }}: {{ getBizEmail }}</p>
        <p v-if="getPerEmail !== ''">
          Personal: {{ getPerEmail }}
        </p>
      </div>
    </div>
    <div class="complete-continue">
      <a
        class="btn-submit mid"
        :href="getBaseUrl"
      >
        Continue to App
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CompleteComponent',
  computed: {
    ...mapGetters({
      getBizName: '$_external/getBizName',
      getBizEmail: '$_external/getBizEmail',
      getBaseUrl: '$_external/getBaseUrl',
      getPerEmail: '$_external/getPerEmail',
    }),
  },
};
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
  height: 40px;
  padding-top: 1%;
}
</style>
