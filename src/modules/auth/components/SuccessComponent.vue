<template lang="html">
  <div>
    <div class="success--bypass-title">
      {{ payment_loading_title }}
    </div>
    <div class="success--bypass-image">
      <img src="https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/success.png">
    </div>
  </div>
</template>

<script>
export default {
  name: 'SuccessComponent',
  data() {
    return {
      loading: true,
    };
  },
  computed: {
    payment_loading_title() {
      return this.$t('successComponent.verify_success');
      }
  },
  mounted() {
  },
  methods: {
  },
};
</script>

<style lang="css">
.success--bypass-title {
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
  line-height: 34px;
}
.success--bypass-image {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 50px;
}
.success--bypass-image img {
  width: 100px;
  height: 100px;
}
</style>
