<template lang="html">
  <div class="screen-one">
    <div class="onboarding-user-header">
      Join the {{ getBizName }} business account on Sendy
    </div>

    <p class="onboard-error">
      {{ message }}
    </p>

    <div class="form-inputs">
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>Name</span>
          </label>
          <input
            v-model="name"
            class="form-control"
            placeholder="John Doe"
            type="text"
            name="name"
            @focus="setCurrentStep(1)"
          >
        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>Email Address</span>
          </label>
          <input
            v-model="email"
            v-validate="'required|email'"
            class="form-control"
            placeholder="you@email.com"
            data-vv-validate-on="blur"
            name="email"
            type="email"
            @focus="setCurrentStep(2)"
          >
          <br>
          <span class="onboarding-email-error">
            {{ errors.first('email') }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>Phone Number</span>
          </label>
          <!-- <input class="form-control" v-validate="'required|check_phone'" data-vv-validate-on="blur" placeholder="07XXXXXXX" name="phone" value="" type="text" v-model="phone" @focus="setCurrentStep(3)">
          <span v-show="errors.has('phone')">{{ errors.first('phone') }}</span> -->
          <vue-tel-input
            v-model="phone"
            v-validate="'required|check_phone'"
            class="form-control"
            name="phone"
            value=""
            data-vv-validate-on="blur"
            :preferred-countries="['ke', 'ug', 'tz']"
            @onBlur="validate_phone"
            @focus="setCurrentStep(3)"
          />
          <span
            v-show="errors.has('phone')"
            class="sign-up-phone-error"
          >
            {{ errors.first('phone') }}
          </span>
        </div>
      </div>
    </div>
    <div class="divide" />
    <div class="form-submits">
      <a class="waves-effect">
        Back
      </a>
      <button
        id="nextBtn"
        class="btn-submit"
        style="width:30% !important;"
        name="next"
        :disabled="!this.is_valid"
        @click="next_view"
      >
        Next
      </button>
    </div>

    <el-dialog
      :visible.sync="phoneVerification"
      class="onboarding-phone-validation"
    >
      <span slot="title">
        <img
          src="https://images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png"
          style="width:85px;"
        >
      </span>
      <div>
        <div class="onboarding-validation-description">
          For your security, Sendy wants to make sure it's really you. We will send a message with
          your verification code.
        </div>

        <div class="onboarding-verification-input">
          <input
            id="onboarding-verif_input"
            v-model="code"
            type="text"
            placeholder="Enter Verification Code"
          >
        </div>
      </div>
      <div class="onboarding-verif-button">
        <button
          type="button"
          class="onboarding-cancel "
          @click="onboardingVerificationCancel"
        >
          Cancel
        </button>
        <button
          type="button"
          class="onboarding-verify"
          @click="onboardingVerificationVerify"
        >
          Verify
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';

export default {
  name: 'OnboardingInfoComponent',
  data() {
    return {
      name: '',
      phone: '',
      email: '',
      message: '',
      phoneVerification: false,
      code: '',
      requestId: '',
    };
  },
  mounted() {
    this.name = this.getName;
    this.email = this.getPerEmail;
  },
  methods: {
    validate_phone() {
      this.$validator.validate();
    },
    ...mapMutations({
      setViewState: '$_external/setViewState',
      updateViewStep: '$_external/updateViewStep',
      updateName: '$_external/updateName',
      updatePhone: '$_external/updatePhone',
      updateBizEmail: '$_external/updateBizEmail',
    }),
    ...mapActions({
      requestOnboardingVerificationVerify: '$_external/requestOnboardingVerificationVerify',
      requestOnboardingPhoneVerification: '$_external/requestOnboardingPhoneVerification',
    }),
    next_view() {
      const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
      const phone_valid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));
      let email_valid = true;
      for (let i = 0; i < this.errors.items.length; i++) {
        if (this.errors.items[i].field == 'email') {
          email_valid = false;
          break;
        }
      }

      if (phone_valid == true && email_valid == true) {
        this.phoneVerification = true;
        this.sendVerificationCode();
      } else {
        this.message = 'Provide valid Email ';
      }
    },
    setCurrentStep(step) {
      this.updateViewStep(step);
      // this.$store.commit('updateViewStep', num);
    },
    onboardingVerificationCancel() {
      this.phoneVerification = false;
      this.doNotification(
        2,
        'Phone Verification',
        'Phone Verification Failed . Retry to complete Onboarding process',
      );
    },

    sendVerificationCode() {
      const phone = this.phone.replace(/[\(\)\-\s]+/g, '');
      const values = {};
      values.phone_no = phone;
      const full_payload = {
        values,
        vm: this,
        app: 'PRIVATE_API',
        endpoint: 'verify_phone',
      };
      this.requestOnboardingPhoneVerification(full_payload).then(
        (response) => {
          if (response.status) {
            this.requestId = response.request_id;
          } else {
            this.doNotification(2, 'Phone Verification', response.message);
          }
        },
        (error) => {
          console.error('Check Internet Connection');
          console.log(error);
        },
      );
    },

    onboardingVerificationVerify() {
      const values = {};
      values.code = this.code;
      values.request_id = this.requestId;
      const full_payload = {
        values,
        vm: this,
        app: 'PRIVATE_API',
        endpoint: 'check_verification',
      };
      this.requestOnboardingVerificationVerify(full_payload).then(
        (response) => {
          if (response.status) {
            this.doNotification(2, 'Phone Verification', 'Phone verification successful !');

            const phone = this.phone.replace(/[\(\)\-\s]+/g, '');

            this.setViewState(2);
            this.updateName(this.name);
            this.updatePhone(phone);
            this.updateBizEmail(this.email);
            this.updateViewStep(0);
          } else {
            this.doNotification(2, 'Phone Verification', response.message);
          }
        },
        (error) => {
          console.error('Check Internet Connection');
          console.log(error);
        },
      );
    },

    doNotification(level, title, message) {
      const notification = {
        title,
        level,
        message,
      };
      this.$store.commit('setNotification', notification);
      this.$store.commit('setNotificationStatus', true);
    },
  },
  computed: {
    ...mapGetters({
      getType: '$_external/getType',
      getBizEmail: '$_external/getBizEmail',
      getBizName: '$_external/getBizName',
      getPerEmail: '$_external/getPerEmail',
      getName: '$_external/getName',
    }),
    is_valid() {
      return this.f_name != '' && this.phone != '' && this.email != '';
    },
    is_type() {
      if (this.getType == 0) {
        return true;
      }
      return false;
    },
  },
};
</script>

<style lang="css">

@import '../../../../node_modules/vue-tel-input/dist/vue-tel-input.css';

.form-inputs > div:nth-child(3) > div > div > div > ul {
    z-index: 9;
    width: 354px;
    margin-top: 9px;
    margin-left: -15px;
}

.onboarding-user-header{
  word-wrap: break-word;
  line-height: 38px !important;
  letter-spacing: 0;
  font-size: 28px !important;
  font-weight: 300 !important;
  margin-bottom: 2rem;
  font-family: Slack-Lato,appleLogo,sans-serif;
  margin: 0 0 1rem;
  display: block;
  -webkit-margin-after: 0.67em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
  max-width: 600px;
}
.input-field{
  width: 50%;
  left: auto;
  right: auto;
  padding: 0 .75rem;
  min-height: 1px;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;

}
.input-field2{
  width: 50% !important;
  left: auto;
  right: auto;
  padding: 0 .75rem;
  min-height: 1px;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;

}
.input-classy{
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0;
  outline: none;
  height: 3rem;
  width: 100%;
  font-size: 16px;
  margin: 0 0 8px 0;
  padding: 0;
}
.input-classy2{
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0;
  outline: none;
  height: 3rem;
  width: 100%;
  font-size: 16px;
  margin: 0 0 8px 0;
  padding: 0;
}
.waves-effect{
  position: relative;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  vertical-align: middle;
  z-index: 1;
  transition: .3s ease-out;
  box-shadow: none;
  background-color: transparent;
  color: #343434;
  height: 36px;
  line-height: 36px;
  padding: 0 16px;
  text-transform: uppercase;
}
.row-defined{
  flex-direction: row;
  display: flex;
  width: 120%;
}
.row{
  width: 100%
}
.input-descript{
  margin: 0 0 .25rem;
 display: block;
 font-size: 1rem;
 line-height: 1.5rem;
 font-weight: 400!important;
 margin-bottom: .5rem!important;
}
.onboarding-email-error{
  margin-right: 45%;
  font-size: 13px;
  font-family: 'Rubik', sans-serif;
  color: #e08445;
}
.onboard-error{
  color: #e08445;
  font-family: 'Rubik', sans-serif;
}
#app > div > div.user-invite-body > div > div > div.panel-card > div > div > div.el-dialog__wrapper.onboarding-phone-validation > div > div.el-dialog__header{
  background-color: #1782c5;
  text-align: center;
}
.onboarding-phone-validation > div
{
  margin-top: 18em !important;
  width: 35% !important;
}
.onboarding-validation-description{
  text-align: left;
  line-height: 1.5;
  padding: 10px 0px;
  font-family: "Rubik", sans-serif;
}
.onboarding-verification-input{
  display: flex;
  margin-top: 10px;
}
#onboarding-verif_input{
  border: none;
  padding: 2px;
  border-bottom: 1px solid #ccc;
  width: 50%;
  font-family: "Rubik", sans-serif;
  font-size: 16px;
}
.onboarding-verif-button{
  padding: 19px 20px 20px;
  margin-top: 16px;
  text-align: right;
  border-top: 1px solid #e5e5e5;
}
.onboarding-verify{
    color: #ecf0f1;
    background-color: #1782c5;
    border-color: #1b7fc3;
    cursor: pointer;
    border-radius: 4px;
    height: 40px;
    transition: background-color 0.3s;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 13px;
}
.onboarding-cancel{
    cursor: pointer;
    border-radius: 4px;
    height: 40px;
    transition: background-color 0.3s;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 13px;
    border:none;
    font-family: "Rubik", sans-serif;
}
</style>
