<template lang="html">
  <span class="rating">
    <span v-if="getStep === 3">
      <PostRateComponent v-if="getPostRatingComponent === 0" />
      <PostRateComponentBusiness v-if="getPostRatingComponent == 1" />
    </span>
    <span v-else>
      <div class="container">
        <div class="rate-rider-middle">
          <div id="rateriderreuse">
            <RateDriver v-if="getStep === 1" />
            <!--<CommentsComponent v-if="getStep == 2"></CommentsComponent>-->
          </div>
        </div>
      </div>
    </span>
  </span>
</template>

<script>
import getYear from 'date-fns/get_year';
import { mapGetters, mapMutations } from 'vuex';
import RateDriver from './components/RateDriver.vue';
import CommentsComponent from './components/Comments.vue';
import PostRateComponent from './components/PostRate.vue';
import PostRateComponentBusiness from './components/PostRateBusiness.vue';
import rating_store from './_store';
import RegisterStoreModule from '../../../../mixins/register_store_module';

export default {
  name: 'Rating',
  components: {
    CommentsComponent,
    PostRateComponent,
    PostRateComponentBusiness,
    RateDriver,
  },
  mixins: [RegisterStoreModule],
  created() {
    const STORE_KEY = '$_rating';
    this.$store.registerModule(STORE_KEY, rating_store);
    this.updateScore(0);
    this.updateBaseUrl();
    this.updatePackageID();
    this.updateUserEmail();
    this.updateRiderImage();
    this.updateDriverBaseImage();
    this.updateDriverName();
    this.updateImagesBaseUrl();
    this.setPostRatingComponent();
  },
  mounted() {
    this.landOnRatingPage();
  },
  computed: {
    ...mapGetters({
      getState: '$_rating/getViewState',
      getStep: '$_rating/getStep',
      getPostRatingComponent: '$_rating/getPostRatingComponent',
      getImagesBaseUrl: '$_rating/getImagesBaseUrl',
    }),
    current_year() {
      const today = new Date();
      return getYear(today);
    },
    wrapper_background() {
      const uri = `url(${this.getImagesBaseUrl}rating/waves_bg.png)`;
      return { 'background-image': uri };
    },
  },
  methods: {
    ...mapMutations({
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
    }),
    getRandomNo(max) {
      return Math.floor(Math.random() * Math.floor(max));
    },
    setPostRatingComponent() {
      const component = this.getRandomNo(2);
      this.updatePostRatingComponent(component);
    },
    landOnRatingPage() {
      // window.ga('send', {
      //     hitType: 'pageview',
      //     page: location.pathname,
      //     title: "View Page - Rating Page - Web Platform"
      // });
    },
  },
};
</script>

<style lang="css">
.rating {
  height: 100%;
  width: 100%;
  position: absolute;
  /*margin-left: 10px;*/
  background: white;
}
.rate-rider-footer {
  background: #f1f3f4;
  border-collapse: collapse;
  border-spacing: 0 !important;
  border-top-color: #e4e5e7;
  border-top-style: solid;
  border-width: 1px 0 0;
  margin: 0 auto !important;
  width: 100%;
  display: inline-block;
  text-rendering: optimizeLegibility !important;
  font-size: 14px;
  line-height: 1.42857143;
  color: #595d62 !important;
  font-weight: normal;
  text-align: center;
  position: fixed;
  padding: 1em !important;
  bottom: 0;
}
.rate-rider-external1 {
  padding: 2em;
}
.container-image {
  margin-top: 10px;
}
</style>
