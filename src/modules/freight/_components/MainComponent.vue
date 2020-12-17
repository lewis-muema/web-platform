<template lang="html">
  <div class="">
    <div
      id="transactions_container"
      class="container"
    >
      <div class="section">
        <router-link
          class="section__link"
          to="/freight/dashboard"
        >
          Dashboard
        </router-link>
        <router-link
          class="section__link"
          to="/freight/transporters"
        >
          Transporters
        </router-link>
        <router-link
          class="section__link"
          to="/freight/orders"
        >
          Orders
        </router-link>
        <router-link
          class="section__link"
          to="/freight/settings"
        >
          Settings
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
@import "../../../assets/styles/section_headers.css";
@import "../../../assets/styles/section_filters.css";
@import "../../../assets/styles/section_pagination.css";
</style>
