<template lang="html">
  <div
    id="log_in"
    class="log-item"
  >
    <div
      v-if="canDisplaySecondScreen"
      id="sign-up-v2-container"
      class="sign-inner"
    >
      <div class="sign-text font-control-title">
        Welcome to Sendy
      </div>
      <div class="sign-text">
        Please fill in the details below to create your new Sendy account.
      </div>
      <div>
        <div class="sign-holder dimen">
          <vue-tel-input
            v-model.trim="phone"
            v-validate="'required|check_phone'"
            class="input-control sign-up-form font-control tel-input-control"
            name="phone"
            value=""
            data-vv-validate-on="blur"
            :preferred-countries="['ke', 'ug', 'tz']"
            @onBlur="validate_phone"
          />
          <p
            v-show="errors.has('phone')"
            class="sign-up-phone-error"
          >
            {{ errors.first('phone') }}
          </p>
        </div>
        <div class="sign-holder dimen">
          <input
            v-model="name"
            class="input-control sign-up-form tel-input-control"
            type="text"
            name="name"
            placeholder="Name"
            value=""
          >
        </div>

        <div class="sign-holder dimen">
          <input
            v-model="email"
            v-validate="'required|email'"
            class="input-control sign-up-form tel-input-control"
            type="email"
            name="email"
            placeholder="Email"
            value=""
          >
          <br>
          <p class="sign-up-email-error">
            {{ errors.first('email') }}
          </p>
        </div>
        <div
          id="outer_u_pass"
          class="sign-holder dimen"
        >
          <span>
            <input
              v-model="password"
              class="input-control sign-up-form tel-input-control"
              type="password"
              name="password"
              placeholder="Create a password"
              @keyup="validate_pass"
            >
            <br>
            <p class="pass-validate-error">
              {{ pass_msg }}
            </p>
          </span>
        </div>
        <div class="">
          <input
            id="signup"
            v-model="sign_up_text"
            class="continue-submit-button"
            type="submit"
            name="sign_up_text"
            aria-invalid="false"
            @click="getCurrency"
          >
        </div>
      </div>
      <el-dialog
        :visible.sync="phoneVerification"
        class="sign-up-phone-validation"
      >
        <span slot="title">
          <img
            src="https://images.sendyit.com/web_platform/logo/Sendy_logo_whitewhite.png"
            class="signup-sendy-logo"
          >
        </span>
        <div>
          <div class="signup-validation-description">
            For your security, Sendy wants to make sure it's really you. We will send a message with
            your verification code.
          </div>

          <div class="signup-verification-input">
            <input
              id="signup-verif_input"
              v-model="code"
              type="text"
              placeholder="Enter Verification Code"
            >
          </div>
        </div>
        <div class="signup-verif-button">
          <button
            type="button"
            class="signup-cancel"
            @click="signUpVerificationCancel"
          >
            Cancel
          </button>
          <button
            type="button"
            class="signup-verify"
            @click="signUpVerificationVerify"
          >
            Verify
          </button>
        </div>
      </el-dialog>
    </div>
    <div
      v-if="showingFirstPage"
      class="sign-inner"
    >
      <div class="sign-text">
        Welcome to Sendy
      </div>
      <div>
        <template>
          <country-select
            v-model="country"
            class="country-select-input"
            :country="country"
          />
          <!--          <region-select v-model="region" :country="country" :region="region" />-->
        </template>
      </div>
      <div class="continue-holder">
        <input
          id="continue"
          v-model="sign_up_text"
          class="continue-submit-button"
          type="submit"
          name="Continue"
          aria-invalid="false"
          @click="checkCountry"
        >
      </div>
    </div>
    <div
      v-if="showingCurrencyPage"
      class="sign-inner"
    >
      <div class="sign-text">
        Select your account currency
      </div>
      <div
        v-for="currency in countryCurrencies"
        :key="currency.id"
        class="radio-box-positioning"
      >
        <input
          v-model="defaultCurrency"
          type="radio"
          name="profileImg"
          class=""
          :value="currency.id"
        >
        <span class="statement__column-10">
          <p class="no-margin small-font currency--raadio">{{ currency.currency_name }}</p>
          <p class="no-margin small-font currency-radio-desc">{{ currency.description }}</p>
        </span>
      </div>
      <div
        class="sign-holder sign-holder-next"
        style="text-align:center;"
      >
        <input
          v-model="u_terms"
          type="checkbox"
          name="u_terms"
          class="hiddeny"
        >
        <span class="sign-holder__smaller">
          By creating a Sendy account you’re agreeing to the
          <a
            class=" sign-holder__grey"
            href="https://sendyit.com/terms"
          >
            terms and conditions
          </a>
        </span>
      </div>
      <div class="continue-holder">
        <input
          id="countryCurrency"
          v-model="sign_up_text"
          class="submit-button"
          type="submit"
          name="Submit"
          aria-invalid="false"
          @click="sign_up"
        >
      </div>
    </div>
    <div
      v-if="!countrySupported"
      class="sign-inner"
    >
      <p
        class="sign-up-error"
      >
        Sorry! We are not yet in your country.
      </p>
    </div>
    <div v-if="canDisplaySecondScreen">
      <div class=" sign-holder sign-forgot-pass sign-smaller">
        Do you already have an account?
        <router-link
          class="sign-holder__link"
          to="/auth/sign_in"
        >
          Login
        </router-link>
      </div>
      <div class=" sign-holder sign-forgot-pass sign-smaller driver-sign-up">
        Want to drive for Sendy?
        <a
          class="sign-holder__link2"
          href="https://partner.sendyit.com/onboarding_portal/"
        >
          Click here
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export default {
  name: 'SignUp',
  data() {
    return {
      name: '',
      phone: '',
      email: '',
      countrySupported: true,
      showingFirstPage: true,
      defaultCurrency: '',
      password: '',
      canDisplaySecondScreen: false,
      showingCurrencyPage: false,
      u_terms: '',
      country: '',
      placeholder: {
        type: String,
        default: 'Select Your Country',
      },
      countryCurrencies: [
        {
          currency_id: 1,
          currency_name: 'KES - Kenya Shillings',
          description: 'I want to move goods locally.',
        },
        {
          currency_id: 2,
          currency_name: 'USD - US Dollars',
          description: 'I want to export and import goods',
        },
      ],
      region: '',
      pass_validation: 'false',
      sign_up_text: 'Continue',
      message: '',
      pass_msg: '',
      phoneVerification: false,
      phoneVerificationForm: {},
      code: '',
      verificationState: false,
    };
  },
  methods: {
    validate_phone() {
      this.$validator.validate();
    },
    ...mapMutations({
      setPassword: '$_auth/setPassword',
      setPhone: '$_auth/setPhone',
      setEmail: '$_auth/setEmail',
      setName: '$_auth/setName',
      setUserCountryCode: '$_auth/setUserCountryCode',
      setVerificationRequestId: '$_auth/setVerificationRequestId',
    }),
    ...mapActions({
      requestSignUpCheck: '$_auth/requestSignUpCheck',
      requestSignUpPhoneVerification: '$_auth/requestSignUpPhoneVerification',
      requestSignUpVerificationVerify: '$_auth/requestSignUpVerificationVerify',
    }),
    ...mapGetters({
      getVerificationRequestId: '$_auth/getVerificationRequestId',
    }),
    sign_up() {
      if (this.name !== '' && this.email !== '' && this.phone !== '' && this.password !== '') {
        const phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));
        const phoneNumber = parsePhoneNumberFromString(this.phone);
        this.setUserCountryCode(phoneNumber.country);
        let emailValid = true;
        for (let i = 0; i < this.errors.items.length; i++) {
          if (this.errors.items[i].field === 'email') {
            emailValid = false;
            break;
          }
        }
        if (phoneValid && emailValid && this.pass_validation) {
          if (this.u_terms) {
            const phone = this.phone.replace(/[()\-\s]+/g, '');
            this.phone = phone;
            const values = {};
            values.phone = phone;
            values.email = this.email;
            const fullPayload = {
              values,
              vm: this,
              app: 'NODE_PRIVATE_API',
              endpoint: 'sign_up_check',
            };
            this.requestSignUpCheck(fullPayload).then(
              (response) => {
                if (response.length > 0) {
                  response = response[0];
                }
                if (response.status) {
                  this.phoneVerification = true;
                  this.setName(this.name);
                  this.setEmail(this.email);
                  this.setPhone(this.phone);
                  this.setPassword(this.password);
                  this.sendVerificationCode();
                } else {
                  this.message = response.data.reason;
                  this.doNotification(2, 'Sign Up failed', response.data.reason);
                }
              },
              (error) => {
                this.doNotification(2, 'Sign Up Error ', 'Check Internet connection and retry');
              },
            );
          } else {
            this.message = 'Agree to Terms and Conditions';
            this.doNotification(2, 'Sign Up failed', 'Agree to Terms and Conditions');
          }
        } else {
          this.message = 'Invalid Details';
          this.doNotification(2, 'Sign Up failed', 'Invalid details');
        }
      } else {
        this.message = 'Please provide all details';
        this.doNotification(2, 'Sign Up failed', 'Provide all details');
      }
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
    validate_pass() {
      const patt = new RegExp('^.*(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9@#$%^&+=]*$');
      const res = patt.test(this.password);
      if (!res) {
        this.pass_msg = 'Password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.';
      } else {
        this.pass_msg = '';
        this.pass_validation = true;
      }
    },

    signUpVerificationCancel() {
      this.phoneVerification = false;
      this.doNotification(
        2,
        'Phone Verification',
        'Phone Verification Failed . Retry to complete SignUp process',
      );
    },

    signUpVerificationVerify() {
      const values = {};
      values.code = this.code;
      values.request_id = this.getVerificationRequestId();
      const fullPayload = {
        values,
        vm: this,
        app: 'PRIVATE_API',
        endpoint: 'check_verification',
      };
      this.requestSignUpVerificationVerify(fullPayload).then(
        (response) => {
          if (response.status) {
            this.doNotification(2, 'Phone Verification', 'Phone verification successful !');
            this.$router.push('/auth/sign_up_verification');
            this.verificationState = true;
          } else {
            this.doNotification(2, 'Phone Verification', response.message);
          }
        },
        (error) => {
          this.doNotification(
            2,
            'Phone Verification Error ',
            'Check Internet connection and retry',
          );
        },
      );
    },

    sendVerificationCode() {
      const phone = this.phone.replace(/[()\-\s]+/g, '');
      const values = {};
      values.phone_no = phone;
      const fullPayload = {
        values,
        vm: this,
        app: 'PRIVATE_API',
        endpoint: 'verify_phone',
      };
      this.requestSignUpPhoneVerification(fullPayload).then(
        (response) => {
          if (response.status) {
            this.setVerificationRequestId(response.request_id);
          } else {
            this.doNotification(2, 'Phone Verification', response.message);
          }
        },
        (error) => {
          this.doNotification(
            2,
            'Phone Verification Error ',
            'Check Internet connection and retry',
          );
        },
      );
    },
    checkCountry() {
      const sendyCountries = [
        {
          country_id: 1,
          country_name: 'Kenya',
          country_code: 'KE',
          supported: true,
        },
        {
          country_id: 2,
          country_name: 'Uganda',
          country_code: 'UG',
          supported: true,
        },
        {
          country_id: 3,
          country_name: 'Tanzania',
          country_code: 'TZ',
          supported: true,
        },
        {
          country_id: 4,
          country_name: 'Nigeria',
          country_code: 'NG',
          supported: true,
        },
      ];
      if (sendyCountries.some(item => item.country_code === this.country) === true) {
        this.countrySupported = true;
        this.showingFirstPage = false;
        this.canDisplaySecondScreen = true;
      } else {
        this.countrySupported = false;
        this.showingFirstPage = false;
      }
    },
    getCurrency() {
      this.showingCurrencyPage = true;
      this.canDisplaySecondScreen = false;
    },
  },
};
</script>

<style lang="css">
@import "../../../../node_modules/vue-tel-input/dist/vue-tel-input.css";

#sign-up-v2-container > div:nth-child(3) > div:nth-child(3) > div > div > ul {
  z-index: 9;
  width: 320px;
  margin-top: 9px;
  margin-left: -15px;
}

.log-item {
  /*text-align: center;*/
  border: 0px solid #ccc;
  margin: 5px;
}
.sign-inner {
  max-width: 22rem;
  border: 1px solid #d8dfe6;
  border-radius: 4px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: "Helvetica Nueu", "Helvetica", "Arial", "sans-serif";
}
.sign-text {
  font-size: 1.3rem;
  line-height: 1.7em;
  font-weight: 500;
  /*text-align: center;*/
  color: #666;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: large;
  margin-bottom: 50px;
}
.sign-button {
  width: 91.9%;
  margin: 1em;
  background-color: #30487b;
  color: #fff;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: initial;
  letter-spacing: 1.1px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}
.sign-holder {
  display: block;
  margin: 1em;
}
.sign-holder-next {
    margin: 24% 1em -9% -4% !important;
}
.sign-holder input:not([type="checkbox"]) {
  width: 100%;
}
.sign-holder .form-control {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  height: 30px;
}
.sign-smaller {
  font-size: 14px;
  color: #999999;
}
.sign-forgot-pass,
.sign-sign-up {
  text-align: center;
}
.sign-buttom__img {
  vertical-align: middle;
  width: 14px;
  padding-bottom: 3px;
  margin-right: 10px;
}
.sign-holder__link {
  color: #1782c5;
  text-decoration: none;
}
.sign-holder__link2 {
  color: #555454;
  text-decoration: none;
}
.dimen {
  width: 83%;
}
.sign-holder__grey {
  color: #555454;
}
.sign-holder__smaller {
  font-size: 13px;
  color: #999999;
}
.sign-up-form {
  height: 42px !important;
  width: 110% !important;
}
.sign-up-error {
  color: #1782c5;
  padding: 2em;
  font-family: "Rubik", sans-serif;
}
.sign-up-email-error {
  font-size: 13px;
  font-family: "Rubik", sans-serif;
  color: #e08445;
  text-align: left;
}
.sign-up-phone-error {
  margin-right: 25%;
  font-size: 13px;
  font-family: "Rubik", sans-serif;
  color: #e08445;
  text-align: left;
}
.signup-submit {
  width: 100% !important;
  border-width: 0px !important;
}
.pass-validate-error {
  color: #e08445;
  font-family: "Rubik", sans-serif;
  text-align: left;
  font-size: 13px;
  width: 320px;
}
#sign-up-v2-container > div.el-dialog__wrapper > div > div.el-dialog__header{
  background-color: #1782c5;
}
.sign-up-phone-validation > div
{
  margin-top: 18em !important;
  width: 35% !important;
}
.signup-validation-description{
  text-align: left;
  line-height: 1.5;
  padding: 10px 0px;
  font-family: "Rubik", sans-serif;
}
.signup-verification-input{
  display: flex;
  margin-top: 10px;
}
#signup-verif_input{
  border: none;
  padding: 2px;
  border-bottom: 1px solid #ccc;
  width: 50%;
  font-family: "Rubik", sans-serif;
  font-size: 16px;
}
.signup-verif-button{
  padding: 19px 20px 20px;
  margin-top: 16px;
  text-align: right;
  border-top: 1px solid #e5e5e5;
}
.signup-verify{
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
.signup-cancel{
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
.signup-sendy-logo{
    width:85px;
}
.country-select-input{
  height: 42px !important;
  width: 100% !important;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  color: #606266;
  line-height: 40px;
  padding: 0 15px;
  font-size: 13px;
  text-align: center;
  margin-top: 10%;
}
.continue-submit-button{
  color: #ecf0f1;
  background-color: #1782c5;
  border-color: #1b7fc3;
  cursor: pointer;
  position: relative;
  display: block;
   border-radius: 40px;
  height: 40px;
  transition: background-color 0.3s;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 13px;
  width: 35% !important;
  text-transform: uppercase;
  margin-left: 60% !important;
}
.submit-button{
  color: #ecf0f1;
  background-color: #1782c5;
  border-color: #1b7fc3;
  cursor: pointer;
  position: relative;
  display: block;
   border-radius: 40px;
  height: 40px;
  transition: background-color 0.3s;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 13px;
  width: 50% !important;
  text-transform: uppercase;
  margin-left: 26% !important;
}
.continue-holder{
  margin-top: 20%;
}
.font-control{
  font-size: 14px !important;
}
.tel-input-control{
  border: none !important;
  font-size: 14px !important;
  border-radius: 0 !important;
  border-bottom: 1px solid #dcdfe6 !important;
}
.font-control-title{
  font-size: 21px !important;
}
ul{
  z-index: 3;
  width: 300px !important;
}
input{
  font-size: 14px !important;
}
.currency--raadio{
  display: inline-block;
  text-align: left !important;
}
.currency-radio-desc{
  margin-left: 20%;
  margin-top: -1%;
}
.radio-box-positioning{
  /*margin-left: -38% !important;*/
  font-size: 14px !important;
  color: #606266 !important;
}
</style>
