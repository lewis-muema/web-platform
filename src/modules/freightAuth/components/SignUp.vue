<template lang="html">
  <div class="">
    <div
      id="orders_container"
      class="box"
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <div class="freight-signup-dialog">
          <el-dialog
            :visible.sync="updateCrmData"
            width="30%"
            class="freightAuthDialog"
            :modal-append-to-body="false"
            :show-close="false"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
          >
            <div class="freight-signup-outer">
              <p class="freight-sign-up-header">
                Welcome !
              </p>
              <p class="freight-sign-up-description">
                Just a few details and your cargo will be on it’s way
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">Name</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="user_name"
                      class="input-control freight-auth-input"
                      type="text"
                      placeholder="Enter your name"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div class="freight-auth-padding">
                  <label class="freight-input-label">Business name</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="business_name"
                      class="input-control freight-auth-input"
                      type="text"
                      placeholder="Enter the name of your business"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div class="freight-auth-padding">
                  <label class="freight-input-label">Email Address</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="email"
                      v-validate="'required|email'"
                      class="input-control freight-auth-input"
                      placeholder="Enter your email "
                      autocomplete="on"
                      type="email"
                      name="email"
                    >
                    <p
                      v-if="email !== ''"
                      class="freight-data-error"
                    >
                      {{ errors.first('email') }}
                    </p>
                  </div>
                </div>

                <div class="freight-auth-padding">
                  <label class="freight-input-label">Password</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="password"
                      class="input-control freight-auth-input"
                      type="password"
                      placeholder="Enter your password"
                      autocomplete="on"
                      :class="!pass_validation && password !== '' ? 'freight-input-error' : ''"
                      @keyup="validate_pass"
                    >
                    <p
                      v-if="!pass_validation && password !== ''"
                      class="freight-data-error"
                    >
                      {{ pass_msg }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="password !== '' && pass_validation"
                  class="freight-auth-padding"
                >
                  <label class="freight-input-label">Confirm Password</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="confirm_password"
                      class="input-control freight-auth-input"
                      type="password"
                      placeholder="Re-enter your password"
                      autocomplete="on"
                      :class="!pass_confirm_validation && confirm_password !== '' ? 'freight-input-error' : ''"
                      @keyup="validate_confirm_pass"
                    >
                    <p
                      v-if="!pass_confirm_validation && confirm_password !== ''"
                      class="freight-data-error"
                    >
                      {{ confirm_pass_msg }}
                    </p>
                  </div>
                </div>

                <p class="freight-terms-and-conditions">
                  By creating a Sendy account you are agreeing to our
                  <span class="freight-terms-higlight">terms and conditions</span>
                </p>

                <div class="">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Sign up"
                    @click="submit"
                  >
                </div>

                <p class="freight-login-redirect">
                  Already have an account? Login
                </p>
              </div>
            </div>
          </el-dialog>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';
import MixpanelMixin from '../../../mixins/mixpanel_events_mixin';
import ValidationMixin from '../../../mixins/validation_mixin';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const currencyConversion = require('country-tz-currency');

export default {
  name: 'SignUp',
  mixins: [SessionMxn, NotificationMxn, MixpanelMixin, ValidationMixin],
  data() {
    return {
      updateCrmData: true,
      user_name: '',
      business_name: '',
      password: '',
      confirm_password: '',
      email: '',
      phoneInputProps: {
        mode: 'international',
        defaultCountry: 'ke',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('signUpDetails.enter_phone_number'),
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        preferredCountries: [],
        autocomplete: 'off',
        name: 'telephone',
        maxLen: 25,
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
      },
      valid_country: false,
      countryNotSupported: '',
      preferredCountries: [],
      pass_validation: false,
      pass_msg: '',
      pass_confirm_validation: false,
      confirm_pass_msg: '',
    };
  },
  computed: {
    ...mapGetters({
      get_session: 'getSession',
    }),
  },
  watch: {},

  created() {},
  mounted() {
  },
  methods: {
    ...mapActions({
      getSupportedCountries: '$_freightAuth/getSupportedCountries',
      freightSignUp: '$_freightAuth/freightSignUp',
    }),

    ...mapMutations({
      setVerificationEmail: '$_freightAuth/setVerificationEmail',
    }),
    validate_phone() {
      this.$validator.validate();
    },
    fetchSupportedCountries() {
      const fullPayload = {
        app: 'AUTH',
        endpoint: 'currency/get_supported_countries',
      };

      this.phoneInputProps.preferredCountries = [];

      this.getSupportedCountries(fullPayload)
        .then((response) => {
          if (response.request_status) {
            response.countries.forEach((country) => {
              this.phoneInputProps.preferredCountries.push(country.country_code.toLowerCase());
              this.preferredCountries.push(country.country_code.toLowerCase());
            });
          } else {
            this.phoneInputProps.preferredCountries = ['ke', 'tz', 'ug'];
          }
        })
        .catch(() => {
          this.phoneInputProps.preferredCountries = ['ke', 'tz', 'ug'];
        });
    },
    checkCountryCode(country) {
      this.localCountryCode = country.iso2;
      this.localCountry = currencyConversion.getCountryByCode(country.iso2).currencyCode;
      switch (true) {
        case this.phoneInputProps.preferredCountries.includes(this.localCountryCode.toLowerCase()):
          this.valid_country = true;
          break;
        default:
          this.valid_country = false;
          break;
      }
    },
    validate_pass() {
      const patt = new RegExp('^.*(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9@#$%^&+=]*$');
      const res = patt.test(this.password);
      if (!res) {
        this.pass_msg = this.$t('signUpDetails.password_error');
        this.pass_validation = false;
      } else {
        this.pass_msg = '';
        this.pass_validation = true;
      }
    },
    validate_confirm_pass() {
      if (this.password === this.confirm_password) {
        this.confirm_pass_msg = '';
        this.pass_confirm_validation = true;
      } else {
        this.confirm_pass_msg = 'Please ensure that this matches the password you entered earlier';
        this.pass_confirm_validation = false;
      }
    },
    submit() {
      let emailValid = true;
      for (let i = 0; i < this.errors.items.length; i++) {
        if (this.errors.items[i].field === 'email') {
          emailValid = false;
          break;
        }
      }
      if (this.user_name !== '' && this.business_name !== '' && emailValid && this.pass_validation && this.pass_confirm_validation) {
        const payload = {
          email: this.email,
          name: this.user_name,
          business_name: this.business_name,
          password: this.password,
          preferred_language: 'en',
        };
        this.processSignUpRequest(payload);
      } else {
        this.doNotification(2, 'Sign up failure', 'Kindly provide all valid details');
      }
    },
    processSignUpRequest(payload) {
      const fullPayload = {
        values: payload,
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'freight/sign-up',
      };

      this.freightSignUp(fullPayload)
        .then((response) => {
          if (response.status) {
            this.setVerificationEmail(payload.email);
            this.doNotification(1, 'Sucess freight sign up', 'Account details saved successfully');
            this.$router.push('/freight/verify_email');
          } else {
            this.doNotification(2, 'Freight Sign up error', response.message);
          }
        })
        .catch((error) => {
          this.doNotification(2, 'Freight Sign up error', error.response.data[0].message);
        });
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../src/assets/styles/freight_auth.css";
</style>
