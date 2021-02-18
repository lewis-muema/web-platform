<template lang="html">
  <div class="sign-up-main">
    <div class="sign-up-container sign-up-main--inner">
      <div class="sign-up-content">
        <div class="sign-up-help-card">
          <div class="">
            <div>
              <img
                src="https://images.sendyit.com/web_platform/orders/Sign-Up-banner.svg"
                class="sign-up-logo"
              >
            </div>
            <div>
              <div class="row logo-outer">
                <img
                  class="logo-display"
                  :src="getPartnerLogo('safaricom')"
                  alt=""
                >
                <img
                  class="logo-display"
                  :src="getPartnerLogo('highlands')"
                  alt=""
                >
                <img
                  class="logo-display"
                  :src="getPartnerLogo('copia')"
                  alt=""
                >
                <img
                  class="logo-display"
                  :src="getPartnerLogo('crown')"
                  alt=""
                >
                <img
                  class="logo-display"
                  :src="getPartnerLogo('kenafric')"
                  alt=""
                >
                <img
                  class="logo-display"
                  :src="getPartnerLogo('unilever')"
                  alt=""
                >
              </div>
              <p
                class="sign-up--extra extra-text"
              >
                {{$t('signUp.join')}}
                <a class="partners-brand-text">{{ $t('signUp.customers') }} </a>{{ $t('signUp.trust') }}
              </p>
            </div>
          </div>
        </div>
        <div class="sign-up-card cards--align sign-up-details-section">
          <sign-up-details-component />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import signUpDetailsComponent from './signUpDetailsComponent.vue';

export default {
  name: 'SignUp',
  components: {
    signUpDetailsComponent,
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    getPartnerLogo(id) {
      return `https://images.sendyit.com/web_platform/partners_logo/${id}.png`;
    },
  },
};
</script>

<style lang="css" scoped>

@import "../../../../src/assets/styles/sign_up.css?v=1";
</style>
