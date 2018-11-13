<template lang="html">
    <span>
        <div id="rated" class="rider2-rate" :class="class_full_comments"></div>
        <div class="row describe-rider">{{getCommentsTitle()}}</div>
        <span class="rider-space"></span>
        <div class="row rider-space-padding">
            <span v-if="getScore < 5">
                <span v-if="getScore <= 2">
                    <div class="col s12 m4">
                        <div class="card">
                            <div class="card-image"><img :src="cards_background"><span class="card-title .center-align">Timeliness</span></div>
                            <div class="card-content grey-text">
                                <p>The delivery was late</p>
                            </div>
                            <div class="card-action"><a  id="score21" data-card="timeliness" href="#writecomment" @click="selectReason(1)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                    <div class="col s12 m4">
                        <div class="card">
                            <div class="card-image"><img :src="cards_background"><span class="card-title">Politeness</span></div>
                            <div class="card-content grey-text">
                                <span class="card-title"></span>
                                <p>The rider was not polite</p>
                            </div>
                            <div class="card-action"><a id="score22" data-card="politeness" href="#writecomment" @click="selectReason(5)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                    <div class="col s12 m4">
                        <div class="card ">
                            <div class="card-image"><img :src="cards_background"><span class="card-title">Pricing</span></div>
                            <div class="card-content grey-text">
                                <p>The pricing was not fair</p>
                            </div>
                            <div class="card-action"><a id="score23" data-card="pricing" href="#writecomment" @click="selectReason(6)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                    <div class="col s12 m4">
                        <div class="card">
                            <div class="card-image"><img :src="cards_background"><span class="card-title">Payment</span></div>
                            <div class="card-content grey-text">
                                <span class="card-title"></span>
                                <p>The payment process was complex</p>
                            </div>
                            <div class="card-action"><a id="score24" data-card="payment" href="#writecomment" @click="selectReason(2)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                    <div class="col s12 m4">
                        <div class="card">
                            <div class="card-image"><img :src="cards_background"><span class="card-title">App</span></div>
                            <div class="card-content grey-text">
                                <p>The app is not easy to use</p>
                            </div>
                            <div class="card-action"><a id="score25" data-card="app" href="#writecomment" @click="selectReason(7)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                    <div class="col s12 m4">
                        <div class="card">
                            <div class="card-image"><img :src="cards_background"><span class="card-title">Directions</span></div>
                            <div class="card-content grey-text">
                                <p>The rider was lost</p>
                            </div>
                            <div class="card-action"><a id="score26" data-card="directions" href="#writecomment" @click="selectReason(3)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                </span>
                <span v-if="getScore == 3">
                    <div class="col s12 m4">
                            <div class="card">
                            <div class="card-image"><img :src="cards_background"><span class="card-title .center-align">Timeliness</span></div>
                            <div class="card-content grey-text">
                                <p>Deliver on time</p>
                            </div>
                            <div class="card-action"><a id="score31" data-card="timeliness" href="#writecomment" @click="selectReason(1)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                    <div class="col s12 m4">
                        <div class="card">
                            <div class="card-image"><img :src="cards_background"><span class="card-title">Payment</span></div>
                            <div class="card-content grey-text">
                                <span class="card-title"></span>
                                <p>Make payment process easier</p>
                            </div>
                            <div class="card-action"><a id="score32" data-card="payment" href="#writecomment" @click="selectReason(2)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                    <div class="col s12 m4">
                        <div class="card ">
                            <div class="card-image"><img :src="cards_background"><span class="card-title">Directions</span></div>
                            <div class="card-content grey-text">
                                <p>Send a rider farmiliar with the location</p>
                            </div>
                            <div class="card-action"><a id="score33" data-card="directions" href="#writecomment" @click="selectReason(3)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                </span>
                <span v-if="getScore == 4">
                    <div class="col s12 m4">
                                    <div class="card">
                            <div class="card-image"><img :src="cards_background"><span class="card-title .center-align">Timeliness</span></div>
                            <div class="card-content grey-text">
                                <p>Speedy delivery</p>
                            </div>
                            <div class="card-action"><a data-card="1" href="#writecomment" @click="selectReason(1)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                    <div class="col s12 m4">
                        <div class="card">
                            <div class="card-image"><img :src="cards_background"><span class="card-title">Politeness</span></div>
                            <div class="card-content grey-text">
                                <span class="card-title"></span>
                                <p>Polite riders</p>
                            </div>
                            <div class="card-action"><a data-card="2" href="#writecomment" @click="selectReason(5)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                    <div class="col s12 m4">
                        <div class="card ">
                            <div class="card-image"><img :src="cards_background"><span class="card-title">Directions</span></div>
                            <div class="card-content grey-text">
                                <p>Clear directions</p>
                            </div>
                            <div class="card-action"><a data-card="3" href="#writecomment" @click="selectReason(3)" class="fancybox">Comment</a></div>
                        </div>
                    </div>
                </span>
                <span class="rider-space"></span>
                <div id="writecomment" style="display:none">
                    <div class='rate-rider-thank'>Thank You</div>
                    <div id='rated1' class='rider3-rate'></div>
                    <div class='rate-rider-tell'>
                        Please take a moment to share your experience with us

                    </div>
                    <form action="" method="post" v-on:submit.prevent="submitRating()">
                        <input type="hidden" name="timeliness" id="form-timeliness" v-model="timeliness">
                        <input type="hidden" name="payment" id="form-payment" v-model="payment">
                        <input type="hidden" name="directions" id="form-directions" v-model="directions">
                        <input type="hidden" name="cleanliness" id="form-cleanliness" v-model="cleanliness" >
                        <input type="hidden" name="politeness" id="form-politeness" v-model="politeness" >
                        <input type="hidden" name="app" id="form-app" v-model="app" >
                        <input type="hidden" name="pricing" id="form-pricing" v-model="pricing">
                        <div class='rate-rider-feedback'><textarea name="comment" id="form-comment" v-model="comment"></textarea></div>
                        <div class='rate-rider-submit' ><input type="submit"  value="Submit"></div>
                    </form>
                </div>
            </span>
            <span v-else>
                <span class="rider-spaceless"></span>
                <div id="writecomment">
                    <div class='rate-rider-thank'>Thank You</div>
                    <div id='rated1' class='rider3-rate'></div>
                    <div class='rate-rider-tell'>
                        Please take a moment to share your experience with us

                    </div>
                    <form action="" method="post" v-on:submit.prevent="submitRating()">
                        <input type="hidden" name="timeliness" id="form-timeliness" v-model="timeliness">
                        <input type="hidden" name="payment" id="form-payment" v-model="payment">
                        <input type="hidden" name="directions" id="form-directions" v-model="directions">
                        <input type="hidden" name="cleanliness" id="form-cleanliness" v-model="cleanliness" >
                        <input type="hidden" name="politeness" id="form-politeness" v-model="politeness" >
                        <input type="hidden" name="app" id="form-app" v-model="app" >
                        <input type="hidden" name="pricing" id="form-pricing" v-model="pricing">
                        <div class='rate-rider-feedback'><textarea name="comment" id="form-comment" v-model="comment"></textarea></div>
                        <div class='rate-rider-submit' ><input type="submit"  value="Submit"></div>
                    </form>
                </div>
            </span>

        </div>
    </span>

</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name:'Comments',
        computed : {
            ...mapGetters(
                [
                    'getStep', 'getScore', 'getBaseUrl', 'getDriverName','getRiderImage', 'getBaseUrl', 'getUserEmail', 'getPackageID'
                ]
            ),
            cards_background(){
                return this.getBaseUrl+'image/sendy_blue_card.png';
            },
            class_full_comments(){
                return {'full_comments' : this.getScore == 5};
            }
        },
        data(){
            return {
                timeliness : false,
                payment : false,
                directions : false,
                cleanliness : false,
                politeness : false,
                pricing : false,
                app : false,
                comment:""
            }
        },
        methods : {
            getCommentsTitle(){
                if(this.getScore <= 2){
                    return 'Ooh no! What did we mess up on?';
                }
                else if(this.getScore == 3){
                    return 'How can we do better next time?';
                }
                else if(this.getScore == 4){
                    return 'What would you like us to improve on?';
                }
                else{
                    return '';
                }
            },
            submitRating(){
                this.postRating();
                this.closeFancyBox();
                this.moveNext();
            },
            postRating(){
                let self = this;
                let url = this.getBaseUrl+'Rate/updateRate';
                let data = {"score":this.getScore, "user_email":this.getUserEmail, "package_id":this.getPackageID, "timeliness":this.timeliness, "payment":this.payment, "directions":this.directions,"cleanliness":this.cleanliness,"politeness":this.politeness,"pricing":this.pricing, "app":this.app, "comment":this.comment };
                axios.post(url,data)
                    .then(function (response) {
                        console.log(response.data);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            },
            moveNext(){
                this.$store.commit('updateStep', 3);
            },
            closeFancyBox(){
                parent.$.fancybox.close();
            },
            resetSelectReasons(){
                this.timeliness = false;
                this.payment = false;
                this.directions = false;
                this.cleanliness = false;
                this.politeness = false;
                this.pricing = false;
                this.app = false;
            },
            selectReason(id){
                this.resetSelectReasons();
                if(id == 1){
                    this.timeliness = true;
                }
                else if(id == 2){
                    this.payment = true;
                }
                else if(id == 3){
                    this.directions = true;
                }
                else if(id == 4){
                    this.cleanliness = true;
                }
                else if(id == 5){
                    this.politeness = true;
                }
                else if(id == 6){
                    this.pricing = true;
                }
                else if(id == 7){
                    this.app = true;
                }
                else{
                    // growth
                }
            }
        }
    }
</script>

<style lang="css">
</style>
