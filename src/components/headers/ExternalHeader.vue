<template lang="html">
    <div class="external-header">
        <img class="external-header__img" src="https://images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png" onclick="location.href='https://sendyit.com/';">
    </div>
</template>

<script>
export default {
    name : 'external-header',
}
</script>

<style lang="css">
    .external-header{
        background-color: #1782c5;
        display: block;
        text-align: center;
        padding: 10px;
    }
    .external-header__img{
        height: 60px;
        cursor: pointer;
    }
</style>
