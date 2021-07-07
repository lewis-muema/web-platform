<template lang="html">
  <div class="header freight-header">
    <div class="header--item">
      <div class="external--item__left">
        <img
          src="https://images.sendyit.com/web_platform/logo/freight_logo.png"
          alt="logo"
          class="external-logo"
          onclick="location.href='https://sendyit.com/';"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ExternalHeader',
};
</script>

<style lang="css">
@import "../../../assets/styles/internal_header.css";
.freight-header{
  background: #527CBD !important;
}
@media (max-width: 500px) {
  .header--item__left {
    text-align: center;
  }
  .logo {
    margin: auto;
    padding: 0px;
  }
}
</style>
