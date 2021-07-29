<template lang="html">
  <div>
    <img
      src="https://images.sendyit.com/partner_portal/images/login-page-banner.svg"
      class="no-activity-img"
    >
    <div class="static-component-label">
      For your peace of mind and trust, we verify everyone we onboard on our platform. We have sent
      your details to independent verification partners and we will get back to you in 48hours.
    </div>
    <div class="static-component-label static-content-margin">
      In the meantime, you can try to find transporters on our platform
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
