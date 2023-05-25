<template lang="html">
  <div class="header">
    <div class="header-top header-outer">
      <font-awesome-icon
        icon="exclamation-triangle"
        width="15px"
        class="header-exclamation"
      />
      {{ $t('mainHeader.Reminder') }} 
    </div>
    <div class="header--item">
      <div class="external--item__left">
        <img
          src="https://images.sendyit.com/web_platform/logo/rebrand_logo.png"
          alt="logo"
          class="external-logo"
          onclick="location.href='https://sendyit.com/';"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

library.add(faExclamationTriangle);

export default {
  name: 'ExternalHeader',
};
</script>

<style lang="css">
@import "../../assets/styles/internal_header.css";

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
