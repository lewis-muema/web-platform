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
            {{ $t('freightAuth.hello') }}
          </p>
          <p class="freight-sign-up-description freight-login-sub">
            {{ $t('freightAuth.login_label') }}
          </p>
          <div class="">
            <div class="freight-auth-padding">
              <label class="freight-input-label">{{ $t('freightAuth.email_or_phone') }}</label>
              <div class="freight-auth-padding">
                <div
                  v-if="type === 'phone'"
                  class=""
                >
                  <vue-tel-input
                    ref="phoneInput"
                    v-model.trim="phone"
                    v-validate="'required|check_phone'"
                    class="input-control sign-up-form phone-input-display"
                    type="number"
                    name="phone"
                    value=""
                    data-vv-validate-on="blur"
                    v-bind="sendyPhoneProps"
                    :input-options="vueTelInputProps"
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
                  :placeholder="$t('freightAuth.email_or_phone_placeholder')"
                  autocomplete="on"
                  type="email"
                  name="email"
                >
                <p
                  v-if="type !== ''"
                  class="freight-error-msg"
                >
                  {{ errors.first('email') }}
                </p>
              </div>
            </div>

            <div class="freight-auth-padding">
              <label class="freight-input-label">{{ $t('freightAuth.password') }}</label>
              <div class="freight-auth-padding">
                <input
                  id="password"
                  v-model="password"
                  class="input-control freight-auth-input"
                  type="password"
                  :placeholder="$t('freightAuth.password_placeholder')"
                  autocomplete="on"
                >
              </div>
            </div>

            <p
              class="freight-login-reset"
              @click="forgetPassword"
            >
              {{ $t('freightAuth.forgot_password') }}
            </p>

            <div class="reset-freight-pass-outer">
              <input
                class="button-primary freight-auth-button"
                type="submit"
                :value="$t('freightAuth.login')"
                @click="login"
              >
            </div>

            <p
              class="freight-login-redirect login-redirect-margin"
              @click="createAccount"
            >
              {{ $t('freightAuth.get_started') }}
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
      sendyPhoneProps: {
              mode: 'international',
              preferredCountries: [],
                      defaultCountry: 'ke',
            },
      vueTelInputProps: {
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('signUpDetails.enter_phone_number'),
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
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
      freightLogin: '$_freightAuth/freightLogin',
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

      this.sendyPhoneProps.preferredCountries = [];

      this.getSupportedCountries(fullPayload)
        .then((response) => {
          if (response.request_status) {
            response.countries.forEach((country) => {
              this.sendyPhoneProps.preferredCountries.push(country.country_code.toLowerCase());
              this.preferredCountries.push(country.country_code.toLowerCase());
            });
          } else {
            this.sendyPhoneProps.preferredCountries = ['ke', 'tz', 'ug'];
          }
        })
        .catch(() => {
          this.sendyPhoneProps.preferredCountries = ['ke', 'tz', 'ug'];
        });
    },
    checkCountryCode(country) {
      this.localCountryCode = country.iso2;
      this.localCountry = currencyConversion.getCountryByCode(country.iso2).currencyCode;
      switch (true) {
        case this.sendyPhoneProps.preferredCountries.includes(this.localCountryCode.toLowerCase()):
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
        this.doNotification(
          2,
          this.$t('freightAuth.login_error'),
          this.$t('freightAuth.provide_all_values'),
        );
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
        this.doNotification(
          2,
          this.$t('freightAuth.login_error'),
          this.$t('freightAuth.valid_phone'),
        );
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
        this.doNotification(
          2,
          this.$t('freightAuth.login_error'),
          this.$t('freightAuth.valid_email'),
        );
      }
    },
    processLoginRequest(val) {
      const fullPayload = {
        values: val,
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'freight/login',
      };

      this.freightLogin(fullPayload)
        .then((response) => {
          if (Object.prototype.hasOwnProperty.call(response, 'status')) {
            this.doNotification(2, this.$t('freightAuth.login_failure'), response.message);
          } else {
            let partsOfToken = '';
            if (Array.isArray(response)) {
              const res = response[1];
              localStorage.setItem('jwtToken', res);
              localStorage.setItem('jwtToken', res.access_token);
              localStorage.setItem('refreshToken', res.refresh_token);
              partsOfToken = res.access_token.toString().split('.');
            } else {
              localStorage.setItem('jwtToken', response);
              localStorage.setItem('jwtToken', response.access_token);
              localStorage.setItem('refreshToken', response.refresh_token);
              partsOfToken = response.access_token.split('.');
            }
            const middleString = partsOfToken[1];
            const data = atob(middleString);
            const { payload } = JSON.parse(data);

            const sessionData = payload;
            const locale = sessionData[sessionData.default].preferred_language === null
              ? 'en'
              : sessionData[sessionData.default].preferred_language;
            const countryCode = sessionData[sessionData.default].country_code === null
              ? 'KE'
              : sessionData[sessionData.default].country_code;
            localStorage.setItem('countryCode', countryCode);
            this.$i18n.locale = locale;
            const acceptLanguageHeader = `${locale}-${countryCode}`;
            localStorage.setItem('language', acceptLanguageHeader);
            const jsonSession = JSON.stringify(sessionData);
            this.setSession(jsonSession);
            this.$store.commit('setSession', sessionData);

            this.$router.push('/freight/transporters');
          }
        })
        .catch(() => {
          this.doNotification(
            2,
            this.$t('freightAuth.login_failure'),
            this.$t('freightAuth.something_went_wrong'),
          );
        });
    },
    forgetPassword() {
      this.$router.push('/freight/forgot_password');
    },
    createAccount() {
      this.$router.push('/freight/sign_up');
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
