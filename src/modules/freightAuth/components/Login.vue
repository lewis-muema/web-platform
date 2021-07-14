<template lang="html">
  <div class="freight-login-container">
    <div class="freight-login-inner">
      <div class="freight-login-contents">
        <div class="freight-classic-display">
          <div class="">
            <div>
              <img
                src="https://images.sendyit.com/partner_portal/images/login-page-banner.svg"
                class="freight-login-banner"
              >
            </div>
          </div>
        </div>
        <div class="freight-login-card freight-login-details">
          <p class="freight-sign-up-header">
            Welcome Back!
          </p>
          <p class="freight-sign-up-description freight-login-sub">
            Please login to continue
          </p>
          <div class="">
            <div class="freight-auth-padding">
              <label class="freight-input-label">Email or phone number</label>
              <div class="freight-auth-padding">
                <div
                  v-if="type === 'phone'"
                  class=""
                >
                  <vue-tel-input
                    ref="phoneInput"
                    v-model.trim="phone"
                    v-validate="'required|check_phone'"
                    class="input-control sign-up-form"
                    type="number"
                    name="phone"
                    value=""
                    data-vv-validate-on="blur"
                    v-bind="phoneInputProps"
                    @onBlur="validate_phone"
                    @country-changed="checkCountryCode"
                  />
                </div>
                <input
                  v-if="type === '' || type === 'email'"
                  ref="mainInput"
                  v-model="input"
                  v-validate="'required|email'"
                  class="input-control freight-auth-input"
                  placeholder="Enter your email or phone number"
                  autocomplete="on"
                  type="email"
                  name="email"
                >
                <p
                  v-if="type !== ''"
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
                  id="password"
                  v-model="password"
                  class="input-control freight-auth-input"
                  type="password"
                  placeholder="Enter your password"
                  autocomplete="on"
                >
              </div>
            </div>

            <p class="freight-login-reset">
              Forgot Password?
            </p>

            <div class="reset-freight-pass-outer">
              <input
                class="button-primary freight-auth-button"
                type="submit"
                value="Login"
                @click="login"
              >
            </div>

            <p class="freight-login-redirect login-redirect-margin">
              Don’t have a Sendy Freight account? Get Started
            </p>
          </div>
        </div>
      </div>
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
  name: 'Login',
  mixins: [SessionMxn, NotificationMxn, MixpanelMixin, ValidationMixin],
  data() {
    return {
      input: '',
      phone: '',
      password: '',
      type: '',
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
      preferredCountries: [],
      submit_step: false,
    };
  },
  computed: {
    ...mapGetters({
      get_session: 'getSession',
    }),
  },
  watch: {
    input(val) {
      if (val !== '' && val.length > 1) {
        this.validateInput(val);
      } else {
        this.type = '';
      }
    },
    phone(val) {
      if (val === '') {
        this.input = val;
        this.type = '';
        this.$nextTick(() => {
          this.$refs.mainInput.focus();
        });
      }
    },
  },

  created() {},
  mounted() {
    this.fetchSupportedCountries();
  },
  methods: {
    ...mapActions({
      getSupportedCountries: '$_freightAuth/getSupportedCountries',
    }),

    ...mapMutations({}),
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
          this.submit_step = true;
          break;
        default:
          this.submit_step = false;
          break;
      }
    },
    phoneRegexValidation(val) {
      return /^[0-9]{0,}$/.test(val) || /^[[+]0-9]{0,}$/.test(val);
    },
    validateInput(val) {
      if (this.phoneRegexValidation(val)) {
        this.type = 'phone';
        this.phone = val;
        this.$nextTick(() => {
          this.$refs.phoneInput.focus();
        });
      } else {
        this.type = 'email';
      }
    },
    login() {
      if ((this.phone !== '' || this.input !== '') && this.password !== '') {
        if (this.phone !== '') {
          this.verifyPhone(this.phone);
        } else {
          this.verifyEmail();
        }
      } else {
        this.doNotification(2, 'Login Error', 'Kindly provide all values');
      }
    },
    verifyPhone(val) {
      const phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(val));
      if (phoneValid) {
        const payload = {
          phone: this.phone.replace(/[()\-\s]+/g, ''),
          password: this.password,
        };
        this.processLoginRequest(payload);
      } else {
        this.doNotification(2, 'Login Error', 'Kindly provide a valid phone number');
      }
    },
    verifyEmail() {
      let emailValid = true;
      for (let i = 0; i < this.errors.items.length; i++) {
        if (this.errors.items[i].field === 'email') {
          emailValid = false;
          break;
        }
      }
      if (emailValid) {
        const payload = {
          email: this.input,
          password: this.password,
        };
        this.processLoginRequest(payload);
      } else {
        this.doNotification(2, 'Login Error', 'Kindly provide a valid email');
      }
    },
    processLoginRequest(payload) {
      console.log('payload', payload);
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
.freight-data-error {
  font-size: 13px;
  font-family: 'Nunito', sans-serif;
  color: #e08445;
  text-align: left;
  margin-top: 0;
}
</style>
