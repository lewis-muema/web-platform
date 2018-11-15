<template lang="html">
    <div class="">
        <main-header></main-header>
        <div class="module-container">
            <div class="free-deliveries--background">
                <div class="free-delivery--intro">
                    <div class="free-delivery--title1">GET FREE DELIVERIES</div>
                    <div class="free-delivery--text">
                        Every time you invite a friend, they will receive a free delivery up to KES 500. Once they
                        complete their first order, you will automatically get a similar free delivery credit into your
                        account.
                    </div>
                </div>
                <div class="free-deliveries--inner">
                    <div class="show-txt">
                        <input readonly :value="this.getInviteLink" type="text" class="input-control">
                    </div>
                    <div class="free-delivery--button">
                        <a v-on:click="copy_link" class="btn-submit">Copy</a>
                    </div>
                    <div class="free-delivery--social">
                        <a v-on:click="copy_link" class="btn-submit mail-button">Mail</a>
                        <a v-on:click="copy_link" class="btn-submit share-button">Share</a>
                        <a v-on:click="copy_link" class="btn-submit tweet-button">Tweet</a>
                    </div>
                </div>
                <div class="free-delivery--stats">
                    <div class="free-delivery--title1">REFERRAL STATS</div>
                    <div class="stats">
                        <span>Credits earned</span>
                        <span>Friends referred</span>
                        <span>Friends joined</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import MainHeader from '../../../components/headers/MainHeader.vue'

    export default {
        name: "FreeDeliveries",
        components: {MainHeader},
    }
</script>

<style lang="css">
    @import "../../../assets/styles/section_headers.css";

    .module-container {
        margin: 0 100px 8px 100px !important;
    }

    .free-deliveries--background {
        width: 100%;
        height: 270px;
        background-color: #E4E7ED;
    }

    .free-deliveries--inner {
        width: 50%;
        /*height: 230px;*/
        margin-top: 90px;
        height: 230px;
        background-color: white;
        /*margin-top: 60px;*/
        margin-left: 18%;
        position: absolute;
        border: 1px solid #C0C4CC;
    }

    .show-txt {
        display: flex;
        flex-direction: column;
        flex: 3;
        width: 75%;
        margin-top: 10%;
        margin-left: 5%;
        margin-right: 5%;
        display: inline-block;
    }

    .btn-submit {
        padding: 11px !important;
    }

    .free-delivery--button {
        display: inline-block;
        margin: 10px;
        margin-left: -37px;
    }

    .free-delivery--title1 {
        color: #333;
        font-size: 14px;
        padding-top: 15px;
    }
    .free-delivery--text {
        color: #333;
        font-size: 14px;
        /*padding: 15px;*/
        text-align: center;
    }

    .free-delivery--social {
        height: 80px;
        /*background-color: antiquewhite;*/
        margin: 10%;
        margin-left: 5%;
        margin-top: 5%;
        margin-bottom: 10px;
    }

    .free-delivery--stats {
        margin: 34px;
        height: 80px;
        margin-top: 380px;
        text-align: center;
        width: 50%;
        background-color: white;
        margin-left: 18%;
        position: absolute;
    }

    .free-delivery--intro {
        height: 80px;
        text-align: center;
        width: 58%;
        margin-left: 21%;
    }

    .tweet-button {
        margin-right: 393px !important;
    }

    div.stats {
        padding-top: 40px;
        display: table;
        width: 100%;
    }

    div.stats span {
        display: table-cell;
        text-align: center;
    }

</style>