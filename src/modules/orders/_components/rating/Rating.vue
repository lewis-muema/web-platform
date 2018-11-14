<template lang="html">
    <span>
        <span v-if="getStep === 3">
            <PostRateComponent v-if="getPostRatingComponent == 0"></PostRateComponent>
            <PostRateComponentBusiness v-if="getPostRatingComponent == 1"></PostRateComponentBusiness>
        </span>
        <span v-else>
            <div class="container">
          		<div class="rate-rider-middle">
          			<div id="rateriderreuse">
                        <RateDriver v-if="getStep == 1"></RateDriver>
                        <CommentsComponent v-if="getStep == 2"></CommentsComponent>
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
    import {mapGetters, mapMutations} from 'vuex';
    import rating_store from './_store';
    import RegisterStoreModule from '../../../../mixins/register_store_module';
    export default {
        name:'rating',
        mixins: [ RegisterStoreModule ],
        components:{CommentsComponent,PostRateComponent,PostRateComponentBusiness,RateDriver},
        created(){
            const STORE_KEY = '$_rating';
            this.$store.registerModule(STORE_KEY, rating_store);
            this.updateScore (window.score);
            this.updateBaseUrl (window.base_url);
            this.updatePackageID (window.package_id);
            this.updateUserEmail (window.user_email);
            this.updateRiderImage (window.rider_image);
            this.updateDriverBaseImage (window.driver_image_base);
            this.updateDriverName (window.driver_name);
            this.updateImagesBaseUrl (window.images_base_url);
            this.setPostRatingComponent();

        },
        mounted(){
            this.landOnRatingPage();
        },
        computed :{
            ...mapGetters(
                {
                    getState: '$_rating/getViewState',
                    getStep: '$_rating/getStep',
                    getPostRatingComponent: '$_rating/getPostRatingComponent',
                    getImagesBaseUrl: '$_rating/getImagesBaseUrl'
                }
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
            ...mapMutations(
                {
                    updateViewState: '$_rating/setViewState',
                    updateScore: '$_rating/updateScore',
                    updateBaseUrl: '$_rating/updateBaseUrl',
                    updateImagesBaseUrl: '$_rating/updateImagesBaseUrl',
                    updateDriverName: '$_rating/updateDriverName',
                    updateDriverBaseImage: '$_rating/updateDriverBaseImage',
                    updateRiderImage: '$_rating/updateRiderImage',
                    updateUserEmail: '$_rating/updateUserEmail',
                    updatePackageID: '$_rating/updatePackageID',
                    updatePostRatingComponent: '$_rating/updatePostRatingComponent',
                }
            ),
            getRandomNo(max){
                return Math.floor(Math.random() * Math.floor(max));
            },
            setPostRatingComponent(){
                let component = this.getRandomNo(2);
                this.updatePostRatingComponent(component);
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
