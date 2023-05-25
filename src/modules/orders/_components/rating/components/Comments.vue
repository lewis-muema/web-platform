<template lang="html">
  <span>
    <div
      id="rated"
      class="rider2-rate"
      :class="class_full_comments"
    />
    <div class="row describe-rider">
      {{ getCommentsTitle() }}
    </div>
    <span class="rider-space" />
    <div class="row rider-space-padding">
      <span v-if="getScore < 5">
        <span v-if="getScore <= 2">
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title .center-align">
                  {{$t('general.timeliness')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <p>{{$t('general.delivery_late')}}</p>
              </div>
              <div class="card-action">
                <a
                  id="score21"
                  data-card="timeliness"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(1)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title">
                  {{$t('general.politeness')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <span class="card-title" />
                <p> {{$t('general.rider_not_polite')}}</p>
              </div>
              <div class="card-action">
                <a
                  id="score22"
                  data-card="politeness"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(5)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
          <div class="col s12 m4">
            <div class="card ">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title">
                  {{$t('general.pricing')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <p>
                  {{$t('general.pricing_not_fair')}}
                  </p>
              </div>
              <div class="card-action">
                <a
                  id="score23"
                  data-card="pricing"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(6)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title">
                  {{$t('general.payment')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <span class="card-title" />
                <p>{{$t('general.payment_process_was_complex')}}</p>
              </div>
              <div class="card-action">
                <a
                  id="score24"
                  data-card="payment"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(2)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title">
                  {{$t('general.app')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <p>{{$t('general.app_not_easy_to_use')}}</p>
              </div>
              <div class="card-action">
                <a
                  id="score25"
                  data-card="app"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(7)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title">
                  {{$t('general.directions')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <p>{{$t('general.rider_was_lost')}}</p>
              </div>
              <div class="card-action">
                <a
                  id="score26"
                  data-card="directions"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(3)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
        </span>
        <span v-if="getScore === 3">
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title .center-align">
                  {{$t('general.timeliness')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <p>{{$t('general.deliver_on_time')}}</p>
              </div>
              <div class="card-action">
                <a
                  id="score31"
                  data-card="timeliness"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(1)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title">
                  {{$t('general.payment')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <span class="card-title" />
                <p>{{$t('general.make_payment_process_easier')}}</p>
              </div>
              <div class="card-action">
                <a
                  id="score32"
                  data-card="payment"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(2)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
          <div class="col s12 m4">
            <div class="card ">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title">
                  {{$t('general.directions')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <p>{{$t('general.send_rider_farmiliar_with_the_location')}}</p>
              </div>
              <div class="card-action">
                <a
                  id="score33"
                  data-card="directions"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(3)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
        </span>
        <span v-if="getScore === 4">
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title .center-align">
                  {{$t('general.timeliness')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <p>{{$t('general.speedy_delivery')}}</p>
              </div>
              <div class="card-action">
                <a
                  data-card="1"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(1)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
          <div class="col s12 m4">
            <div class="card">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title">
                  {{$t('general.politeness')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <span class="card-title" />
                <p>{{$t('general.polite_riders')}}</p>
              </div>
              <div class="card-action">
                <a
                  data-card="2"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(5)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
          <div class="col s12 m4">
            <div class="card ">
              <div class="card-image">
                <img :src="cards_background"><span class="card-title">
                  {{$t('general.directions')}}
                </span>
              </div>
              <div class="card-content grey-text">
                <p>{{$t('general.clear_directions')}}</p>
              </div>
              <div class="card-action">
                <a
                  data-card="3"
                  href="#writecomment"
                  class="fancybox"
                  @click="selectReason(3)"
                >
                  {{$t('general.comment')}}
                </a>
              </div>
            </div>
          </div>
        </span>
        <span class="rider-space" />
        <div
          id="writecomment"
          style="display:none"
        >
          <div class="rate-rider-thank">
            {{$t('general.thank_you')}}
          </div>
          <div
            id="rated1"
            class="rider3-rate"
          />
          <div class="rate-rider-tell">
            {{$t('general.please_share_your_experience')}}
          </div>
          <form
            action=""
            method="post"
            @submit.prevent="submitRating()"
          >
            <input
              id="form-timeliness"
              v-model="timeliness"
              type="hidden"
              name="timeliness"
            >
            <input
              id="form-payment"
              v-model="payment"
              type="hidden"
              name="payment"
            >
            <input
              id="form-directions"
              v-model="directions"
              type="hidden"
              name="directions"
            >
            <input
              id="form-cleanliness"
              v-model="cleanliness"
              type="hidden"
              name="cleanliness"
            >
            <input
              id="form-politeness"
              v-model="politeness"
              type="hidden"
              name="politeness"
            >
            <input
              id="form-app"
              v-model="app"
              type="hidden"
              name="app"
            >
            <input
              id="form-pricing"
              v-model="pricing"
              type="hidden"
              name="pricing"
            >
            <div class="rate-rider-feedback">
              <textarea
                id="form-comment"
                v-model="comment"
                name="comment"
              />
            </div>
            <div class="rate-rider-submit">
              <input
                type="submit"
                value="Submit"
              >
            </div>
          </form>
        </div>
      </span>
      <span v-else>
        <span class="rider-spaceless" />
        <div id="writecomment">
          <div class="rate-rider-thank">
            {{$t('general.thank_you')}}
          </div>
          <div
            id="rated1"
            class="rider3-rate"
          />
          <div class="rate-rider-tell">
            {{$t('general.please_share_your_experience')}}
          </div>
          <form
            action=""
            method="post"
            @submit.prevent="submitRating()"
          >
            <input
              id="form-timeliness"
              v-model="timeliness"
              type="hidden"
              name="timeliness"
            >
            <input
              id="form-payment"
              v-model="payment"
              type="hidden"
              name="payment"
            >
            <input
              id="form-directions"
              v-model="directions"
              type="hidden"
              name="directions"
            >
            <input
              id="form-cleanliness"
              v-model="cleanliness"
              type="hidden"
              name="cleanliness"
            >
            <input
              id="form-politeness"
              v-model="politeness"
              type="hidden"
              name="politeness"
            >
            <input
              id="form-app"
              v-model="app"
              type="hidden"
              name="app"
            >
            <input
              id="form-pricing"
              v-model="pricing"
              type="hidden"
              name="pricing"
            >
            <div class="rate-rider-feedback">
              <textarea
                id="form-comment"
                v-model="comment"
                name="comment"
              />
            </div>
            <div class="rate-rider-submit">
              <input
                type="submit"
                value="Submit"
              >
            </div>
          </form>
        </div>
      </span>
    </div>
  </span>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'Comments',
  mixins: [NotificationMxn],
  data() {
    return {
      timeliness: false,
      payment: false,
      directions: false,
      cleanliness: false,
      politeness: false,
      pricing: false,
      app: false,
      comment: '',
    };
  },
  computed: {
    ...mapGetters({
      getStep: '$_rating/getStep',
      getScore: '$_rating/getScore',
      getImagesBaseUrl: '$_rating/getImagesBaseUrl',
      getBaseUrl: '$_rating/getBaseUrl',
      getDriverName: '$_rating/getDriverName',
      getRiderImage: '$_rating/getDriverName',
      getUserEmail: '$_rating/getUserEmail',
      getPackageID: '$_rating/getPackageID',
    }),
    cards_background() {
      return 'https://app.sendyit.com/biz/image/sendy_blue_card.png';
    },
    class_full_comments() {
      return { full_comments: this.getScore === 5 };
    },
  },
  methods: {
    ...mapMutations({
      updateStep: '$_rating/updateStep',
    }),
    getCommentsTitle() {
      if (this.getScore <= 2) {
        return this.$t('general.what_did_we_messUp_on');
      }
      if (this.getScore === 3) {
        return this.$t('general.how_to_do_better_next_time');
      }
      if (this.getScore === 4) {
        return this.$t('general.like_us_improve_on');
      }
      return '';
    },
    submitRating() {
      this.postRating();
      this.moveNext();
    },
    postRating() {
      const payload = {
        score: this.getScore,
        user_email: this.getUserEmail,
        package_id: this.getPackageID,
        timeliness: this.timeliness,
        payment: this.payment,
        directions: this.directions,
        cleanliness: this.cleanliness,
        politeness: this.politeness,
        pricing: this.pricing,
        app: this.app,
        comment: this.comment,
      };
      this.$store.dispatch('$_rating/requestRatingUpdate', payload).then(
        (response) => {},
        (error) => {
          const notification = { title: '', level: 2, message: this.$t('general.something_went_wrong') }; // notification object
          this.displayNotification(notification);
        },
      );
    },
    moveNext() {
      this.updateStep(3);
    },
    resetSelectReasons() {
      this.timeliness = false;
      this.payment = false;
      this.directions = false;
      this.cleanliness = false;
      this.politeness = false;
      this.pricing = false;
      this.app = false;
    },
    selectReason(id) {
      this.resetSelectReasons();
      if (id === 1) {
        this.timeliness = true;
      } else if (id === 2) {
        this.payment = true;
      } else if (id === 3) {
        this.directions = true;
      } else if (id === 4) {
        this.cleanliness = true;
      } else if (id === 5) {
        this.politeness = true;
      } else if (id === 6) {
        this.pricing = true;
      } else if (id === 7) {
        this.app = true;
      } else {
        // growth
      }
    },
    ...mapActions(['$_rating/requestRatingUpdate']),
  },
};
</script>

<style lang="css">
.rate-rider-cards{
    display: table;
}
.rate-rider-cards-inner{
    display: table-cell;
}
</style>
