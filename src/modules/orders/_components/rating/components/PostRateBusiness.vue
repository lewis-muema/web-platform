<template lang="html">
  <span>
    <div class="rating-top-fix" />
    <div class="rating-submitted-wrapper" :style="wrapper_background">
      <div class="container">
        <div class="post-rate">
          <div class="rating-submitted">
            <img
              :src="
                'https://s3-eu-west-1.amazonaws.com/sendy-web-apps-assets/biz/rating/submitted.png'
              "
              alt="submitted"
              class="rating-submitted-image"
            />
          </div>
          <div class="rate-rider-thank">
            Rating submitted
          </div>
          <div class="rate-rider-thank">
            Thank You for using Sendy!
          </div>
        </div>
      </div>
    </div>
  </span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'PostRateBusiness',
  computed: {
    ...mapGetters({
      getStep: '$_rating/getStep',
      getScore: '$_rating/getScore',
      getImagesBaseUrl: '$_rating/getImagesBaseUrl',
      getBaseUrl: '$_rating/getBaseUrl',
    }),
    wrapper_background() {
      const uri = `url(${this.getImagesBaseUrl}rating/waves_bg.png)`;
      return { 'background-image': uri };
    },
  },
  methods: {
    NewDelivery() {
      // window.ga('send', {
      //     hitType: 'event',
      //     eventCategory: 'Form',
      //     eventAction: 'click',
      //     eventLabel: "New delivery - account types | Rating Page | Web Platform"
      // });
      // window.location = this.getBaseUrl;
    },
  },
};
</script>

<style lang="css">
.post-rate{
    text-align: center !important;
}
.rate-rider-thank{
    margin-top: 30px;
}
</style>
