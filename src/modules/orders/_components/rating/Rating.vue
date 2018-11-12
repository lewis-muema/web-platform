<template lang="html">
    <div class="rating_container">
        <div class="image_container">
            <img src="../../../../../public/evans.png"/>
        </div>
        <div class="rider_content">
            <div class="rate-rider-please">

            </div>

            <div class="rate-rider-star">

            </div>

            <div class="rate-rider-desc">

            </div>
        </div>
        <div class="menu">
            <p class="button">
                <a class="button__element"> rate </a>
                <br> <br>
            </p>
        </div>
        <div class="rating_stars">
            <p class="rating_button">
                <a class="rating_button__element"> rate </a>
            </p>
            <star-rating v-bind:increment="1"
                         v-bind:max-rating="5"
                         inactive-color="#d8d8d8"
                         active-color="#1782c5"
                         v-bind:star-size="30">
            </star-rating>

        </div>
    </div>
</template>

<script>
    import StarRating from 'vue-star-rating';

    export default {
        name: "Rating",
        components: {
            StarRating
        }

    }
</script>

<style lang="css">
    @import "../../../../styles/datatable.css";

    body {
        font-family: 'Raleway', sans-serif;
    }

    img{
        height: 100%;
    }
    .rating_container {
        background-color: #f8f8f8;
        margin-top: 30px;
        padding: 10px;
        height: auto;
    }
    .rider_content{
        display: inline-block !important;
    }
    .rating_button {

    }

    .image_container {
        width: 100px;
        height: 100px;
        object-fit: cover;
        overflow: hidden;
    }

    .rating_stars {
        /*display: none;*/
        background-color: white;
        padding: 8px;
        width: 28%;
        align-content: center;
    }

    .button {
        float: left;
    }

    .rating_button__element {
        text-transform: uppercase;
        display: inline-block !important;
        padding: 5px 20px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.42857143;
        text-align: center;
        float: right !important;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border-radius: 3px;
        color: #fff;
        background-color: #1782C5;
        border-color: #357ebd;
        text-decoration: none;
    }

    .button__element {
        text-transform: uppercase;
        display: inline-block;
        padding: 5px 50px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border-radius: 3px;
        color: #fff;
        background-color: #1782C5;
        border-color: #357ebd;
        text-decoration: none;
    }

    .menu {
        display: flow-root;
    }
</style>
