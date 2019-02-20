<template lang="html">
  <span>
    <div class="container-image">
      <div class="rate-rider-image">
        <img
          class="rider-photo"
          :src="this.driver_photo"
          alt=""
        >
      </div>
    </div>

    <div
      id="rate-rider-content"
      class="rate-rider-content"
    >
      <div class="rate-rider-please">
        Please Rate {{ driver_name }}
      </div>

      <div class="rate-rider-star">
        <div class="submit-stars">
          <el-rate
            v-model="rated_score"
            :colors="['#99A9BF', '#F57f20', '#1782C5']"
          />
          <textarea
            v-model="rating_comment"
            placeholder="Share your experience with us."
            class="rate-comment--textareabox"
          />
          <button
            class="rate-rider-primary"
            @click="postRating"
          >
            SUBMIT
          </button>
        </div>
      </div>

      <div class="rate-rider-desc">
        We will use your rating to match you with the best rider
      </div>
    </div>
  </span>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'RateDriverComponent',
  mounted() {
    const order_id = this.$route.params.order_no;
    this.order = order_id;
    const payload = {
      order_no: order_id,
    };
    const users_full_payload = {
      values: payload,
      app: 'NODE_PRIVATE_API',
      endpoint: 'pending_delivery',
    };
    this.$store.dispatch('$_rating/requestOrder', users_full_payload).then(
      (response) => {
        this.driver_name = response.rider.rider_name;
        this.driver_photo = response.rider.rider_photo;
        this.user_email = response.user.email;
      },
      (error) => {
        console.log(error);
      },
    );
  },
  computed: {
    ...mapGetters({
      getOrder: '$_rating/getOrder',
      getDriverName: '$_rating/getDriverName',
      getRiderImage: '$_rating/getRiderImage',
      getBaseUrl: '$_rating/getBaseUrl',
      getUserEmail: '$_rating/getUserEmail',
      getPackageID: '$_rating/getPackageID',
    }),
    driver_background() {
      const uri = `url(${this.getRiderImage})`;
      return { background: `white ${uri}` };
    },
  },
  data() {
    return {
      rated_score: 1,
      show_rating: false,
      driver_name: 'Sendy Driver',
      driver_photo: '',
      order: '',
      user_email: '',
      rating_comment: '',
      timeliness: false,
      payment: false,
      directions: false,
      cleanliness: false,
      politeness: false,
      pricing: false,
      app: false,
    };
  },
  methods: {
    ...mapMutations({
      updateScore: '$_rating/updateScore',
      updateStep: '$_rating/updateStep',
    }),
    postRating() {
      const payload = {
        values: {
          value: this.rated_score,
          user_email: this.user_email,
          package_id: this.order,
          comment: this.rating_comment,
        },
      };
      const rating_status_full_payload = {
        values: payload,
        app: 'PRIVATE_API',
        endpoint: 'insert_rate',
      };
      this.$store.dispatch('$_rating/requestRatingStatus', rating_status_full_payload).then(
        (response) => {
          console.log(response);
          this.updateStep(3);
          this.updateScore(this.rated_score);
        },
        (error) => {
          console.log(error);
        },
      );
    },
    ...mapActions(['$_rating/requestRatingStatus', '$_rating/requestUpdateRating']),
  },
};
</script>

<style lang="css">

.rate-rider-image {
    width: 100px;
    height: 100px;
    border-radius: 70px;
    margin: 0px auto;
}
.rider-photo{
    max-width:100%;
    max-height:100%;
    border-radius: 50%;
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
