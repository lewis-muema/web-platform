<template lang="html">
    <span>
        <div class="rating-top-fix"></div>
        <div class="rating-submitted-wrapper" :style="wrapper_background" >
            <div class="container">
                <div class="">
                    <div class="rating-submitted">
                        <img :src="getImagesBaseUrl+'rating/submitted.png'" alt="submitted" class="rating-submitted-image">
                        Rating submitted
                    </div>
                    <div class="rate-rider-thank">
                        Thank You for using Sendy!
                    </div>
                </div>
                <div class="rate-grid-wrapper">
                    <div class="">
                        <div class="rate-post-rate-text">
                            <div class="rate-font-small">
                                <div class="rate-font-medium">
                                    Have something <br> <span class="rate-font-big">bigger</span> <br>to deliver?
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <div class="rate-post-rate-text">
                            <div class="rate-font-small">
                                <div class="rate-font-normal">
                                    Whether you require a bike or a pickup for your delivery, with Sendy, you have access to all vehicle sizes.
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="">
                        <div class="rate-post-rate-personal rate-post-personalone">
                            <div class="">
                                <img :src="getImagesBaseUrl+'rating/vendors.png'" alt="vendors" class="rate-post-image">
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <div class="rate-call-to-action">
                            <input type="button" name="" value="New Delivery" @click="NewDelivery()">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </span>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: 'PostRate',
        computed : {
            ...mapGetters(
                [
                    'getStep', 'getScore', 'getImagesBaseUrl','getBaseUrl'
                ]
            ),
            wrapper_background(){
                let uri = 'url('+this.getImagesBaseUrl+'rating/waves_bg.png)';
                return {'background-image' : uri}
            }

        },
        methods : {
            NewDelivery(){
                window.ga('send', {
                    hitType: 'event',
                    eventCategory: 'Form',
                    eventAction: 'click',
                    eventLabel: "New delivery - vendors | Rating Page | Web Platform"
                });
                window.location = this.getBaseUrl;
            }
        }
    }
</script>

<style lang="css">
</style>
