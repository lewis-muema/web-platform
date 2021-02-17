<template lang="html">
  <div class="">
    <div
      id="transactions_container"
      class="container"
    >
      <div class="section">
        <router-link
          class="section__link"
          to="/freight/transporters"
        >
          {{$t('mainComponent.transporters')}}
        </router-link>
        <router-link
          class="section__link"
          to="/freight/orders"
        >
          {{$t('mainComponent.shipment')}}
        </router-link>
        <router-link
          class="section__link"
          to="/freight/dashboard"
        >
          {{$t('mainComponent.activity_log')}}
        </router-link>
        <router-link
          v-if="copAcc"
          class="section__link"
          to="/freight/settings"
        >
          {{$t('mainComponent.settings')}}
        </router-link>
      </div>
      <div class="">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import MainHeader from '../../../components/headers/MainHeader.vue';

library.add(faStar);

export default {
  name: 'Main',
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
    copAcc() {
      const session = this.$store.getters.getSession;
      const resp = session.default === 'biz';
      return resp;
    },
  },
  watch: {
    getSession: {
      handler(val, oldVal) {
        if (oldVal !== val) {
          this.$router.push('/orders');
        }
        this.$router.push('/freight');
      },
      deep: true,
    },
  },
  mounted() {},
  methods: {
    ...mapActions({}),
  },
};
</script>

<style lang="css">
@import "../../../assets/styles/section_headers.css?v=4";
@import "../../../assets/styles/section_filters.css?v=4";
@import "../../../assets/styles/section_pagination.css?v=4";
</style>
