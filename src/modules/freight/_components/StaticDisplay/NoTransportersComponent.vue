<template lang="html">
  <div>
    <img
      src="https://images.sendyit.com/partner_portal/images/login-page-banner.svg"
      class="no-activity-img"
    >
    <div class="static-component-label">
      {{ $t('freightDetailsUpdate.no_transporters') }}
    </div>
    <div class="static-component-label static-content-margin">
      {{ $t('freightDetailsUpdate.no_transporters_info') }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Static',
};
</script>

<style lang="css">
.no-activity-img {
  width: 35%;
  display: block;
  margin: auto;
}
.static-component-label{
  text-align: center;
  font-weight: 600;
  color: #303133;
}
.static-content-margin{
  margin-top: 3% !important;
}
</style>
