<template lang="html">
    <span>
        <span v-if="getStep === 3">
            <post-rate-component v-if="getPostRatingComponent === 0"></post-rate-component>
            <post-rate-component-business v-if="getPostRatingComponent === 1"></post-rate-component-business>
        </span>
        <span v-else>
            <div class="container">
          		<div class="rate-rider-middle">
          			<div id="rateriderreuse">
                        <rate-driver-component v-if="getStep === 1"></rate-driver-component>
                        <comments-component v-if="getStep === 2"></comments-component>
                    </div>
                </div>
            </div>
        </span>
        <div class="container-fluid">
            <div class="rate-rider-footer" >

                <div class="rate-rider-external1" >
                    <a href="https://www.facebook.com/SENDY-843869815628934/" target="_blank" >
                        <img src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/emails/fb_icon.png"  alt="Facebook" >
                    </a>

                    <a href="https://twitter.com/sendymobile" target="_blank" >
                        <img src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/emails/twiitter_icon.png"  alt="Twitter" >
                    </a>

                    <a href="https://www.linkedin.com/company/sendy-limited" target="_blank" >
                        <img src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/emails/linkedin_icon.png"  alt="LinkedIn" style=" ">
                    </a>
                </div>

                <div class="rate-rider-address1">
                &copy; {{current_year}} <a href="https://sendyit.com/" >Sendy Ltd</a> Marsabit Plaza - 3rd Floor, Kilimani, Ngong Road, Nairobi.
                </div>
            </div>
        </div>
    </span>
</template>

<script>
    import RateDriver from './components/RateDriver.vue';
    import CommentsComponent from './components/Comments.vue';
    import PostRateComponent from './components/PostRate.vue';
    import PostRateComponentBusiness from './components/PostRateBusiness.vue';
    import getYear from 'date-fns/get_year';
    import {mapGetters} from 'vuex';
    export default {
        components:{CommentsComponent,PostRateComponent,PostRateComponentBusiness,RateDriver},
        created(){
            this.$store.commit('updateScore', window.score);
            this.$store.commit('updateBaseUrl', window.base_url);
            this.$store.commit('updatePackageID', window.package_id);
            this.$store.commit('updateUserEmail', window.user_email);
            this.$store.commit('updateRiderImage', window.rider_image);
            this.$store.commit('updateDriverBaseImage', window.driver_image_base);
            this.$store.commit('updateDriverName', window.driver_name);
            this.$store.commit('updateImagesBaseUrl', window.images_base_url);
            this.setPostRatingComponent();

        },
        mounted(){
            this.landOnRatingPage();
        },
        computed :{
            ...mapGetters(
                [
                    'getStep','getPostRatingComponent', 'getImagesBaseUrl'
                ]
            ),
            current_year(){
                let today = new Date();
                return getYear(today);
            },
            wrapper_background(){
                let uri = 'url('+this.getImagesBaseUrl+'rating/waves_bg.png)';
                return {'background-image' : uri}
            }

        },
        methods : {
            getRandomNo(max){
                return Math.floor(Math.random() * Math.floor(max));
            },
            setPostRatingComponent(){
                let component = this.getRandomNo(2);
                this.$store.commit('updatePostRatingComponent', component);
            },
            landOnRatingPage(){
                window.ga('send', {
                    hitType: 'pageview',
                    page: location.pathname,
                    title: "View Page - Rating Page - Web Platform"
                });
            }
        }
    }
</script>

<style lang="css">
</style>
