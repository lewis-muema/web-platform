<template lang="html">
  <div
    class=""
  >
    <p class="sign-up--label">
      Sign up for Sendy
    </p>
    <p class="sign-up--extra">
      Choose an account that fits your needs
    </p>
    <div class="">
      <div
        class=""
        @click="selectCard('Biz')"
      >
        <el-radio
          v-model="radio"
          label="1"
          class="radio-options"
        >
          Business
          <div
            class="upgrade-account-text--inner"
            :class="{ descript_active: getActiveTab === 'Biz' }"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt
          </div>
        </el-radio>
      </div>
      <div
        class=""
        @click="selectCard('Peer')"
      >
        <el-radio
          v-model="radio"
          label="2"
          class="radio-options"
        >
          Personal
          <div
            class="upgrade-account-text--inner"
            :class="{ descript_active: getActiveTab === 'Peer' }"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
            sed do eiusmod tempor incididunt
          </div>
        </el-radio>
      </div>
    </div>
    <div
      class="sign-holder sign-up-btn-outer"
    >
      <input
        value="Submit"
        class="button-primary sign-btn-color unit-submit"
        type="submit"
        name="login_text"
        @click="submit"
      >
    </div>
    <div class="sign-up--info">
      <div class="upgrade-account-text--inner">
        Do you already have an account?
        <router-link
          class="signup-holder__link"
          to="/auth/sign_in"
        >
          Login
        </router-link>
      </div>
      <div class="upgrade-account-text--inner">
        Want to drive for Sendy?
        <a
          class="signup-holder__link"
          href="https://partner.sendyit.com/onboarding_portal/"
        >
          Click here
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'SignUpInitialComponent',
  data() {
    return {
      radio: '1',
    };
  },
  computed: {
    ...mapGetters({
      getActiveTab: '$_auth/getActiveTab',
    }),
  },
  created() {
    let state = '1';
    if (this.getActiveTab === 'Peer') {
      state = '2';
    }
    this.radio = state;
  },
  methods: {
    ...mapMutations({
      setViewState: '$_auth/setViewState',
      setActiveTab: '$_auth/setActiveTab',
    }),
    selectCard(tab) {
      this.setActiveTab(tab);
    },
    submit() {
      let state = 2;
      if (this.radio === '1') {
        state = 3;
      }
      this.setViewState(state);
    },
  },
};
</script>

<style lang="css" >
@import "../../../../src/assets/styles/sign_up.css";

</style>
