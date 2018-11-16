<template lang="html">
    <div class="">
        <div class="free-delivery-container">
            <div class="section">
                <router-link class="section__link" to="/user/free-deliveries">Free delivery</router-link>
            </div>
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
                        <span> 35 <br> Credits earned</span>
                        <span> 15 <br> Friends referred</span>
                        <span> 5 <br> Friends joined</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "FreeDeliveries",
    }
</script>

<style lang="css">

    .free-delivery-container {
        margin: 0 100px 8px 100px !important;
        padding-top: 60px;
    }

    .free-deliveries--background {
        width: 100%;
        height: 270px;
        background-color: #fff;
    }

    .free-deliveries--inner {
        width: 50%;
        margin-top: 0;
        height: 230px;
        background-color: transparent;
        margin-left: 18%;
        position: absolute;
    }

    .show-txt {
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
        width: 200px !important;
    }

    .free-delivery--button {
        display: inline-block;
        margin: 10px;
        margin-left: -37px;
    }

    .free-delivery--title1 {
        color: #333;
        font-size: 15px;
        padding-top: 15px;
    }
    .free-delivery--text {
        font-size: 14px;
        padding-top: 15px;
        line-height: 1.6;
        text-align: center;
        font-family: 'Rubik', sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #555;
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
        margin-top: 210px;
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
        margin-right: 0px !important;
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