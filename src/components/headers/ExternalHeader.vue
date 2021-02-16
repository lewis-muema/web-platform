<template lang="html">
  <div class="header">
    <div class="header--item external-header__img">
      <div class="header--item__left">
        <img
          src="https://images.sendyit.com/web_platform/logo/rebrand_main_logo.png"
          alt="logo"
          class="logo"
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
@import "../../assets/styles/internal_header.css?v=4";
.external-header__img{
    cursor: pointer;
    width: 60%;
    padding-left: 40%;
}
@media (max-width: 500px) {
  .external-header__img {
    width: 100%;
    padding-left: 30%;
   }
  .header--item__left {
    text-align: center;
  }
  .logo {
    margin: auto;
    padding: 0px;
  }
}
</style>
