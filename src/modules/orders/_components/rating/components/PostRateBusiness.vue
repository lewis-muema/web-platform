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
                <div class="rate-grid-wrapper rate-grid-wrapper-business">
                    <div class="">
                        <div class="rate-post-rate-text">
                            <div class="rate-font-small">
                                <div class="rate-font-medium">
                                <span class="rate-font-bigless">Personal</span> <br> or <span class="rate-font-bigless">Business</span> <br>delivery?
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <div class="rate-post-rate-text">
                            <div class="rate-font-small">
                                <div class="rate-font-normal rate-font-normalless">
                                    Whether you require a delivery for yourself or at work, Sendy has you covered.
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="">
                        <div class="rate-post-rate-personal rate-post-rate-personaless">
                            <div class="">
                                <img :src="getImagesBaseUrl+'rating/personal.png'" alt="vendors" class="rate-post-image rate-post-imageless">
                            </div>
                            <div class="rate-font-normal rate-post-rate-business-personal-text">
                                <span></span>Personal
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <div class="rate-post-rate-business">
                            <div class="">
                                <img :src="getImagesBaseUrl+'rating/business.png'" alt="business" class="rate-post-image rate-post-imageless">
                            </div>
                            <div class=" rate-font-normal rate-post-rate-business-personal-text">
                                Business
                            </div>
                        </div>
                    </div>
                    <div class="">
                        <div class="rate-call-to-action rate-call-to-actionless">
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
        name: 'PostRateBusiness',
        computed : {
            ...mapGetters(
                [
                    'getStep', 'getScore', 'getImagesBaseUrl', 'getBaseUrl'
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
                    eventLabel: "New delivery - account types | Rating Page | Web Platform"
                });
                window.location = this.getBaseUrl;
            }
        }
    }
</script>

<style lang="css">
</style>
