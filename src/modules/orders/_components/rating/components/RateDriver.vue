<template lang="html">
  <span>
    <div class="container-image">
      <div class="rate-rider-image">
        <img
          class="rider-photo"
          :src="driver_photo"
        >
      </div>
    </div>

    <div
      id="rate-rider-content"
      class="rate-rider-content"
    >
      <div class="rate-rider-please">{{$t('general.please_rate_drivername', {driver_name: driver_name})}}</div>

      <div class="rate-rider-star">
        <div class="submit-stars">
          <span class="submit-stars-container">
            <p class="rate-text rate-text-right">{{$t('general.very_bad')}}</p>
            <el-rate
              v-model="rated_score"
              :colors="['#99A9BF', '#F57f20', '#1782C5']"
            />
            <p class="rate-text rate-text-left">{{$t('general.very_good')}}</p>
          </span>
          <textarea
            v-model="rating_comment"
            :placeholder="$t('general.please_share_your_experience')" 
            class="rate-comment--textareabox"
          />
          <div class="rate-buttons-container">
            <button
              class="rate-rider-primary"
              @click="postRating"
            >
              {{$t('general.submitCapital')}}
            </button>
            <button class="skip-rider-primary" @click="skipRating">
              {{$t('general.skip')}}
            </button>
          </div>
        </div>
      </div>

      <div class="rate-rider-desc">
       {{$t('general.will_use_your_rating_to_match')}}
      </div>
    </div>
  </span>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'RateDriverComponent',
  mixins: [NotificationMxn],
  data() {
    return {
      rated_score: 0,
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
  mounted() {
    const orderId = this.$route.params.order_no;
    this.order = orderId;
    const payload = {
      order_no: orderId,
    };
    const usersFullPayload = {
      values: payload,
      vm: this,
      app: 'NODE_PRIVATE_API',
      endpoint: 'pending_delivery',
    };
    this.$store.dispatch('$_rating/requestOrder', usersFullPayload).then(
      (response) => {
        if (response.status) {
          this.driver_name = response.rider.rider_name;
          this.driver_photo = response.rider.rider_photo;
          this.user_email = response.user.email;
        }
      },
      (error) => {
        const notification = { title: '', level: 2, message: this.$t('general.something_went_wrong') }; // notification object
        this.displayNotification(notification);
      },
    );
  },
  methods: {
    ...mapMutations({
      updateScore: '$_rating/updateScore',
      updateStep: '$_rating/updateStep',
    }),
    postRating() {
      if (this.rated_score > 0) {
        const payload = {
          values: {
            value: this.rated_score,
            user_email: this.user_email,
            package_id: this.order,
            comment: this.rating_comment,
          },
        };
        const ratingStatusFullPayload = {
          values: payload,
          vm: this,
          app: 'PRIVATE_API',
          endpoint: 'insert_rate',
        };
        this.$store.dispatch('$_rating/requestRatingStatus', ratingStatusFullPayload).then(
          (response) => {
            this.updateStep(3);
            this.updateScore(this.rated_score);
          },
          (error) => {
            const notification = { title: '', level: 2, message: this.$t('general.something_went_wrong') }; // notification object
            this.displayNotification(notification);
          },
        );
      } else {
        const notification = { title: '', level: 2, message: this.$t('general.please_enter_rating') };
        this.displayNotification(notification);
      }
    },
    skipRating() {
      this.$router.push('/orders');
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
    font-family: 'Nunito', sans-serif;
}

.rate-rider-please {
}

.rate-rider-star {
    padding: 20px;
}
.rate-rider-primary {
    margin: 0 auto;
    color: #ecf0f1;
    background-color: #1782C5;
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
.skip-rider-primary {
    margin: 0 auto;
    color: #1782C5;
    background-color: #ecf0f1;
    border-color: #1782C5;
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
    width: 90px;
}

.rate-rider-primary:focus, .button-primary:hover {
    background: #285e8e;
    border-color: #285e8e;
    color: #ecf0f1;
}
.rate-buttons-container {
    display: flex;
    width: 250px;
    margin: auto;
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
    border: 1px solid #1782C5 !important;
    -webkit-box-shadow: none !important;
    outline:none;
    box-shadow: none !important;
}
.submit-stars-container {
    display: flex;
    justify-content: center;
}
.rate-text {
    font-size: 9px;
    margin-top: 20px;
}
.rate-text-right {
    margin-right: -22px;
}
.rate-text-left {
    margin-left: -28px;
}
</style>
