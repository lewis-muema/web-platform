<template lang="html">
  <div class="sign-up-main">
    <div
      class="sign-up-container sign-up-main--inner"
    >
      <div class="sign-up-content">
        <div
          class="sign-up-card cards--align"
        >
          <sign-up-initial-component v-if="getViewState === 1" />
          <peer-details-component v-if="getViewState === 2" />
          <biz-details-component v-if="getViewState === 3" />
        </div>
        <div
          class="sign-up-help-card"
        >
          <div class="">
            <div
              v-show="getActiveTab === 'Biz'"
              :class="{ active_tab: getActiveTab === 'Biz' }"
            >
              <p
                class="sign-up--extra extra-text"
              >
                Business account benefits
              </p>

              <div
                v-for="(info, key) in biz"
                :key="key"
                class="sign-up-content align-benefits"
              >
                <div class="">
                  <i class="el-icon-check sign-up-back" />
                </div>
                <div
                  class="benefits-text"
                >
                  <p class="business-benefits--header">
                    {{ info.header }}
                  </p>
                  <p class="business-benefits--description">
                    {{ info.description }}
                  </p>
                </div>
              </div>
            </div>
            <div
              v-show="getActiveTab === 'Peer'"
              :class="{ active_tab: getActiveTab === 'Peer' }"
            >
              <p
                class="sign-up--extra extra-text"
              >
                Personal account benefits
              </p>

              <div
                v-for="(info, key) in peer"
                :key="key"
                class="sign-up-content align-benefits"
              >
                <div class="">
                  <i class="el-icon-check sign-up-back" />
                </div>
                <div
                  class="benefits-text"
                >
                  <p class="business-benefits--header">
                    {{ info.header }}
                  </p>
                  <p class="business-benefits--description">
                    {{ info.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import signUpInitialComponent from './signUpInitialComponent.vue';
import peerDetailsComponent from './peerDetailsComponent.vue';
import bizDetailsComponent from './bizDetailsComponent.vue';

export default {
  name: 'SignUp',
  components: {
    signUpInitialComponent,
    peerDetailsComponent,
    bizDetailsComponent,
  },
  data() {
    return {
      biz: [
        {
          header: 'Title 1',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
        },
        {
          header: 'Title 2',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
        },
        {
          header: 'Title 3',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
        },
      ],
      peer: [
        {
          header: 'Title 4',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
        },
        {
          header: 'Title 5',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
        },
        {
          header: 'Title 6',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt',
        },
      ],
    };
  },
  computed: {
    ...mapGetters({
      getViewState: '$_auth/getViewState',
      getActiveTab: '$_auth/getActiveTab',
    }),
  },
};
</script>

<style lang="css" scoped>

@import "../../../../src/assets/styles/sign_up.css";
</style>
