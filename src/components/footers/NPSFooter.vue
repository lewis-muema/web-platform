<template lang="html">
  <form
    v-if="isValid"
    ref="form"
    class="form-inline"
    @submit.prevent="submitSurvey"
  >
    <div class="nps-footer">
      <div class="nps-header">
        <h3>{{ heading }}</h3>
      </div>
      <div
        v-if="!submitted"
        class="nps-info"
      >
        <div
          v-if="score === null"
        >
          <div class="btn-group">
            <button
              type="button"
              class="btn btn-secondary likely side-btn"
            >
              0 Not Likely
            </button>
            <span class="score-holder">
              <span
                v-for="(value, index) in scores"
                :key="index"
              >
                <button
                  :id="`score_${index}`"
                  type="button"
                  class="btn btn-secondary btn-holder"
                  @click="onChange($event, value)"
                >{{ value }}</button>
              </span>
            </span>
            <button
              type="button"
              class="btn btn-secondary unlikely side-btn"
            >
              10 Very Likely
            </button>
            <button
              type="button"
              class="btn btn-secondary dismiss"
              @click="dismiss()"
            >
              &times;
            </button>
          </div>
        </div>
        <div v-if="score !== null">
          <div class="form-group">
            <textarea
              id="reason"
              v-model="reason"
              type="text"
              name="reason"
              placeholder="Write your feedback here"
              class="form-control reason-box"
            />
            <button class="btn btn-primary form-control action-button">
              Submit
            </button>
            <span class="clearfix">&nbsp;</span>
            <button class="btn btn-primary form-control action-button reason-dismiss">
              <span
                type="button"
                class="close"
                data-dismiss="modal"
                @click="dismiss()"
              >
                &times;
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>
<script>
import { mapMutations, mapActions } from 'vuex';
import NpsMixin from '../../mixins/nps_mixin';

export default {
  name: 'NPSFooter',
  mixins: [NpsMixin],
  data() {
    return {
      scores: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      score: null,
      reason: '',
      heading: 'How likely are you to invite a friend or collegue to join Sendy?',
      submitted: false,
      isValid: null,
    };
  },
  computed: {
    session() {
      const session = this.$store.getters.getSession;
      return session;
    },
    userType() {
      const userType = this.session.default;
      return userType;
    },
    respondentType() {
      return this.userType === 'biz' ? 'cop' : this.userType;
    },
    userID() {
      return this.session[this.userType].user_id;
    },
    countryCode() {
      return this.session[this.userType].country_code;
    },
  },
  mounted() {
    this.validateUser();
  },

  methods: {
    ...mapMutations({
      setNPSStatus: 'setNPSStatus',
    }),
    ...mapActions({
      verifyNpsUser: 'verifyNpsUser',
      storeNpsSurvey: 'storeNpsSurvey',
    }),
    validateUser() {
      const userDetails = {
        respondent_type: this.respondentType,
        respondent_id: this.userID,
      };

      const payload = {
        values: userDetails,
        vm: this,
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'nps/verify',
      };
      this.verifyNpsUser(payload).then(
        (response) => {
          const { valid } = response.data;
          this.isValid = valid;
        },
        (error) => {
          this.trackMixpanelEvent('Place Order', {
            'Account ': this.userID,
            'Account Type': this.userType === 'peer' ? 'Personal' : 'Business',
            'Client Type': 'Web Platform',
            'Response Error': error.response.data[0].message,
          });
        },
      );
    },
    onChange(event, score) {
      this.score = score;
      this.heading = 'What do you like most about Sendy? (Optional)';
    },
    dismiss() {
      const userDetails = {
        respondent_type: this.respondentType,
        respondent_id: this.userID,
        business_unit_id: 1,
        country_code: this.countryCode,
        score: null,
        reason: '',
        dismissed: true,
      };
      const payload = {
        values: userDetails,
        vm: this,
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'nps/surveys',
      };
      this.storeNpsSurvey(payload).then(
        (response) => {
          if (response.success) {
            this.submitted = true;
            this.heading = 'Thank you. We will use your feedback to improve our service';
            setTimeout(() => {
              this.setNPSStatus(true);
            }, 3000);
          }
        },
        (error) => {
          this.heading = error.response.data[0].message;
        },
      );
    },
    submitSurvey() {
      const userDetails = {
        respondent_type: this.respondentType,
        respondent_id: this.userID,
        business_unit_id: 1,
        country_code: this.countryCode,
        score: this.score,
        reason: this.reason,
        dismissed: false,
      };
      const payload = {
        values: userDetails,
        vm: this,
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'nps/surveys',
      };

      this.storeNpsSurvey(payload).then(
        (response) => {
          if (response.success) {
            this.submitted = true;
            this.heading = 'Thank you. We will use your feedback to improve our service';
            setTimeout(() => {
              this.setNPSStatus(true);
            }, 3000);
          }
        },
        (error) => {
          this.heading = error.response.data[0].message;
        },
      );
    },

  },
};
</script>
<style scoped>
.nps-footer {
    position: fixed;
    bottom: 0;
    width: 100%;
   left: 0;
    background-color: #fff;
    color: #555;
    font-size: 13px;
    min-height: 90px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0px rgba(0, 0, 0, 0.02);
    border-radius: 3px;
  text-align: center;
}
.nps-header {
    width: 100%;
    margin-top: 25px;
    font-size: 15px;
}
.nps-info {
    width: 100%;
    margin-bottom: 20px;
    margin-left: 3em;
}
.btn-holder {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    background: #FFFFFF;
    border: 1px solid #BDBDBD;
    box-sizing: border-box;
    margin-right: 15px;
    cursor: pointer;
    transition-duration: 0.4s;
}

.btn-holder:hover {
  background-color: #F57F20;
  color: white;
  font-weight: 700;
  border: none;
}
.score-holder {
    margin-left: 2em;
    margin-right: 2em;
}
.side-btn {
    color: #474747;
    border: none;
    font-size: 12px;
}
.dismiss {
    color: #041F38;
    border: none;
    font-size: 19px;
    margin-left: 15px;
    cursor: pointer;
}
.nps-header h3 {
    color: #064773;
    font-weight: 500;
}
.reason-box {
    width: 34%;
    height: 52px;
}
.action-button {
    position: absolute;
    width: 5%;
    margin-top: 6px;
    background: #f57f20;
    color: #ffffff;
    border-radius: 4px;
    cursor: pointer;
    line-height: 30px;
    height: 36px;
}
.clearfix {
     margin-right: 7em;
}
.reason-dismiss {
    background: #ffffff;
    border: none;
    color: #041F38;
    border: none;
    font-size: 19px;
    margin-left: 15px;
    cursor: pointer;
}
button span {
    display: block;
    padding: 0;
}
.form-group {
    margin-bottom: .3em;
}
</style>