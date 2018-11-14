<template lang="html">
    <span>
        <div class="container-image">
            <div id="rate-rider-imager" style="background: white url('placeholder.png');width:100px;height:100px;background-size:cover; -moz-border-radius: 70px;  -webkit-border-radius: 70px;border-radius: 70px;background-position-x:center;margin:0px auto" :style="driver_background">
            </div>
        </div>

        <div id="rate-rider-content">
            <div class="rate-rider-please">
                Please Rate {{getDriverName}}
            </div>

            <div class="rate-rider-star">
                 <div class="rider_details_rating">
                <div class="block">
                    <el-rate
                            v-model="orderRating"
                            :colors="['#99A9BF', '#f57f20', '#1b7fc3']">
                    </el-rate>
                     <el-button class="rider_details_rate_btn" @click="renderRiderRating"> RATE </el-button>
                </div>
              </div>
                <!--<form action="" method="post" v-on:submit.prevent="submitRating()">-->

                    <!--<div id="stars" >-->
                        <!--<input id="stars1" name="value1" v-model="rated_score">-->

                    <!--</div>-->
                    <!--<div class="submit-stars">-->
                            <!--&lt;!&ndash; <a id="submitit">Submit</a> &ndash;&gt;-->
                        <!--<input type="submit" value="Submit" >-->
                    <!--</div>-->
                <!--</form>-->


            </div>

            <div class="rate-rider-desc">
                We will use your rating to match you with the best rider
            </div>
        </div>
    </span>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';
    import axios from 'axios';
    import $ from 'jquery'
    export default {
        name:'RateDriver',
        computed : {
            // ...mapGetters(
            //     [
            //         'getDriverName','getRiderImage', 'getBaseUrl', 'getUserEmail', 'getPackageID'
            //     ]
            // ),
            ...mapGetters(
                {
                    getDriverName: '$_rating/getDriverName',
                    getRiderImage: '$_rating/getRiderImage',
                    getBaseUrl: '$_rating/getBaseUrl',
                    getUserEmail: '$_rating/getUserEmail',
                    getPackageID: '$_rating/getPackageID',

                }
            ),
            driver_background(){
                let uri = 'url('+this.getRiderImage+')';
                return {background : "white "+uri}
            }
        },
        data() {
            return {
                show_rating:false,
            }
        },
        methods :{
            ...mapMutations(
                {
                    updateStep: '$_rating/updateStep',
                    updateScore: '$_rating/updateScore'
                }
            ),
            renderRiderRating(rating) {
                let rating_template ='';
                for(let i =0 ; i < 5; i++){
                    if(i < rating){
                        rating_template += '<span class="fa fa-star rating_checked"></span>';
                    } else {
                        rating_template += '<span class="fa fa-star"></span>'
                    }
                }
                return rating_template;
            }
        }
    }
</script>

<style lang="css">
    .rate-rider-please {
        font: 400 20px/26px 'Helvetica Neue', Helvetica, Arial, sans-serif;
        margin: 2em;
        color: #826D6D;
        text-align: center;
    }
    .rate-rider-star {
        display: inline-block;
        text-align: center !important;
        /*margin:0 auto !important;*/
        margin-left: 38%;
        font-size: 14px;
        line-height: 1.42857143;
        font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
    .rate-rider-desc {
        font: 200 14px/26px 'Helvetica Neue', Helvetica, Arial, sans-serif;
        margin: 2em;
        text-align: center;
        color: #595d62 !important;
    }
    .rider_details_rating {
        margin-top: 10px;
        padding: 20px 20px 20px 20px;
         background: #fff !important;
    }
</style>
