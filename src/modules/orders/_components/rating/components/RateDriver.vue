<template lang="html">
    <span>
        <div class="container-image">
            <div class="rate-rider-image" id="rate-rider-imager">

            </div>
        </div>

        <div class="rate-rider-content" id="rate-rider-content">
            <div class="rate-rider-please">
                Please Rate Driver Name{{getDriverName}}
            </div>

            <div class="rate-rider-star">
                <div class="submit-stars">
                  <el-rate v-model="rated_score" :colors="['#99A9BF', '#F57f20', '#1782C5']">
                  </el-rate>
                    <textarea v-model="rating_comment" class="rate-comment--textareabox"></textarea>
                  <button class="rate-rider-primary" @click="rateOrder"> SUBMIT </button>
                </div>
            </div>

            <div class="rate-rider-desc">
                We will use your rating to match you with the best rider
            </div>
        </div>
    </span>
</template>

<script>
    import {mapGetters, mapMutations, mapActions} from 'vuex';

    export default {
        name: 'rate-driver-component',
        computed: {
            ...mapGetters({
                getDriverName: '$_rating/getDriverName',
                getRiderImage: '$_rating/getRiderImage',
                getBaseUrl: '$_rating/getBaseUrl',
                getUserEmail: '$_rating/getUserEmail',
                getPackageID: '$_rating/getPackageID'
            }),
            driver_background() {
                let uri = 'url(' + this.getRiderImage + ')';
                return {background: "white " + uri}
            }
        },
        data() {
            return {
                rated_score: 1,
                show_rating: false,
                rating_comment: "Share your experience with us.",
                timeliness: false,
                payment: false,
                directions: false,
                cleanliness: false,
                politeness: false,
                pricing: false,
                app: false
            }
        },
        methods: {
            ...mapMutations(
                {
                    updateScore: '$_rating/updateScore',
                    updateStep: '$_rating/updateStep'
                }
            ),
            rateOrder() {
                this.show_rating = false;
                this.postRating();
                this.moveNext();
                this.submitScore();
                this.updateComment();
            },
            postRating() {
                let rating_status_payload = {
                    "score": this.rated_score,
                    "user_email": this.getUserEmail,
                    "package_id": this.getPackageID
                }
                let rating_status_full_payload = {
                    "values" : rating_status_payload,
                    "vm":this,
                    "app":"NODE_PRIVATE_API",
                    "endpoint":"Rate/insertRate"
                }
                this.$store.dispatch("$_rating/requestRatingStatus", rating_status_full_payload).then(response => {
                    console.log(response);
                }, error => {
                    console.log(error);
                });
            },
            moveNext() {
                this.updateStep(3);
            },
            submitScore() {
                this.updateScore(this.rated_score);
            },
            updateComment() {
                let rating_payload = {
                    "score":this.getScore,
                        "user_email":this.getUserEmail,
                        "package_id":this.getPackageID,
                        "timeliness":this.timeliness,
                        "payment":this.payment,
                        "directions":this.directions,
                        "cleanliness":this.cleanliness,
                        "politeness":this.politeness,
                        "pricing":this.pricing,
                        "app":this.app,
                        "comment":this.rating_comment
                }
                let rating_full_payload = {
                    "values" : rating_payload,
                    "vm":this,
                    "app":"NODE_PRIVATE_API",
                    "endpoint":"Rate/updateRate"
                }
                this.$store.dispatch("$_rating/requestUpdateRating", rating_full_payload).then(response => {
                    console.log(response);
                }, error => {
                    console.log(error);
                });

            },
            ...mapActions([
                '$_rating/requestRatingStatus',
                '$_rating/requestUpdateRating',
            ]),
        }
    }
</script>

<style lang="css">

    .rate-rider-image {
        background: url(https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/20160823_115845.jpg) 50% / cover white;
        width: 100px;
        height: 100px;
        border-radius: 70px;
        margin: 0px auto;
    }

    .rate-rider-content {
        text-align: center;
        font-size: 15px;
        line-height: 1.42857143;
        color: #595d62 !important;
        margin-top: 20px;
        padding: 15px;
        font-family: 'Rubik', sans-serif;
    }

    .rate-rider-please {
    }

    .rate-rider-star {
        padding: 20px;
    }
    .rate-rider-primary {
        margin: 0 auto;
        color: #ecf0f1;
        background-color: #1782c5;
        border-color: #1b7fc3;
        cursor: pointer;
        position: relative;
        margin-top: 10px !important;
        display: block;
        border-radius: 4px;
        height: 40px;
        transition: background-color .3s;
        padding-left: 20px;
        padding-right: 20px;
        font-size: 14px;
    }

    .rate-rider-primary:focus, .button-primary:hover {
        background: #285e8e;
        border-color: #285e8e;
        color: #ecf0f1;
    }
    .submit-stars{
        text-align: center;
    }
    .rate-comment--textareabox {
        height: 50px!important;
        border: 1px solid #dcdfe6 !important;
        border-radius: 4px !important;
        text-align: center !important;
        margin-top: 40px!important;
        padding: 10px;
        font-size: 14px;
        color: #999999;
        width: 200px !important;
    }
    .rate-comment--textareabox:focus{
        border: 1px solid #1782c5 !important;
        -webkit-box-shadow: none !important;
        outline:none;
        box-shadow: none !important;
    }
</style>
