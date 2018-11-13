<template lang="html">
    <span>
        <div class="container-image">
            <div id="rate-rider-imager" style="background: white url('<?php echo $rider_image;?>');width:100px;height:100px;background-size:cover; -moz-border-radius: 70px;  -webkit-border-radius: 70px;border-radius: 70px;background-position-x:center;margin:0px auto" :style="driver_background">
            </div>
        </div>

        <div id="rate-rider-content">
            <div class="rate-rider-please">
                Please Rate {{getDriverName}}
            </div>

            <div class="rate-rider-star">
                <form action="" method="post" v-on:submit.prevent="submitRating()">

                    <div id="stars" >
                        <input id="stars1" name="value1" v-model="rated_score">

                    </div>
                    <div class="submit-stars">
                            <!-- <a id="submitit">Submit</a> -->
                        <input type="submit" value="Submit" >
                    </div>
                </form>


            </div>

            <div class="rate-rider-desc">
                We will use your rating to match you with the best rider
            </div>
        </div>
    </span>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name:'RateDriver',
        computed : {
            ...mapGetters(
                [
                    'getDriverName','getRiderImage', 'getBaseUrl', 'getUserEmail', 'getPackageID'
                ]
            ),
            driver_background(){
                let uri = 'url('+this.getRiderImage+')';
                return {background : "white "+uri}
            }
        },
        data(){
            return {
                rated_score :0.5
            }
        },
        methods :{
            submitRating(){
                this.rated_score = $('#stars1').val();
                if(this.rated_score < 1){
                    this.rated_score = 1;
                }
                this.postRating();
                this.moveNext();
                this.submitScore();
            },
            postRating(){
                let self = this;
                let url = this.getBaseUrl+'Rate/insertRate';
                let data = {"score":this.rated_score, "user_email":this.getUserEmail, "package_id":this.getPackageID};
                axios.post(url,data)
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            moveNext(){
                // if(this.rated_score == 5){
                //     this.$store.commit('updateStep', 3);
                // }
                // else{
                this.$store.commit('updateStep', 2);
                // }
            },
            submitScore(){
                this.$store.commit('updateScore', this.rated_score);
            }
        }
    }
</script>

<style lang="css">
</style>
