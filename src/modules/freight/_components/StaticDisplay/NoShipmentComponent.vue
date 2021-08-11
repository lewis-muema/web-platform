<template lang="html">
  <div>
    <img
      src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/freight/no-freight-shipment.svg"
      class="no-shipment-img"
    >
    <div class="static-component-label">
      {{ $t('freightDetailsUpdate.no_shipment') }}
    </div>
    <div class="no-activity-label">
      {{ $t('freightDetailsUpdate.no_shipment_info') }}
    </div>
    <div class="static-component-label static-content-margin">
      <button
        type="button"
        class="button-primary manage-approvers align-static-btn"
        @click="directToTransporters"
      >
        {{ $t('freightDetailsUpdate.find_transporters') }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Static',
  data() {
    return {};
  },
  methods: {
    directToTransporters() {
      this.$router.push('/freight/transporters');
    },
  },
};
</script>

<style lang="css">
.no-shipment-img {
  width: 35%;
  display: block;
  margin: auto;
  height: 250px;
  margin-top: 3%;
}
.static-component-label{
  text-align: center;
  font-weight: 600;
  color: #303133;
}
.static-content-margin{
  margin-top: 3% !important;
}
.align-static-btn{
  margin: auto !important;
}
.no-activity-label{
  text-align: center;
  margin-top: 2%;
}
</style>
