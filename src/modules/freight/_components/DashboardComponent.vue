<template lang="html">
  <div class="">
    <div>
      <img
        src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/freight/unavailable.svg"
        class="no-activity-img"
      >
      <div class="no-activity-label">
        No Activity at the moment
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
};
</script>

<style lang="css" scoped>
.no-activity-img {
  width: 35%;
  display: block;
  margin: auto;
}
.no-activity-label{
  text-align: center;
}
</style>
