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
              <el-row>
                <el-select
                  v-model="locale"
                  :placeholder="$t('freightAuth.select')"
                  class="set_freight_locale"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-row>

              <p class="freight-sign-up-header">
               {{ $t('freightAuth.welcome') }}
              </p>
              <p class="freight-sign-up-description">
                {{ $t('freightAuth.final_details') }}
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">{{ $t('freightAuth.name') }}</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="user_name"
                      class="input-control freight-auth-input"
                      type="text"
                      :placeholder="$t('freightAuth.name_placeholder')"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div class="freight-auth-padding">
                  <label class="freight-input-label">{{ $t('freightAuth.business_name') }}</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="business_name"
                      class="input-control freight-auth-input"
                      type="text"
                      :placeholder="$t('freightAuth.business_name_placeholder')"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div class="freight-auth-padding">
                  <label class="freight-input-label">{{ $t('freightAuth.email') }}</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="email"
                      v-validate="'required|email'"
                      class="input-control freight-auth-input"
                      :placeholder="$t('freightAuth.email_placeholder')"
                      autocomplete="on"
                      type="email"
                      name="email"
                    >
                    <p
                      v-if="email !== ''"
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
                      v-model="password"
                      class="input-control freight-auth-input"
                      type="password"
                      :placeholder="$t('freightAuth.password_placeholder')"
                      autocomplete="on"
                      :class="!pass_validation && password !== '' ? 'freight-input-error' : ''"
                      @keyup="validate_pass"
                    >
                    <p
                      v-if="!pass_validation && password !== ''"
                      class="freight-error-msg"
                    >
                      {{ pass_msg }}
                    </p>
                  </div>
                </div>

                <div
                  v-if="password !== '' && pass_validation"
                  class="freight-auth-padding"
                >
                  <label class="freight-input-label">{{ $t('freightAuth.confirm_password') }}</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="confirm_password"
                      class="input-control freight-auth-input"
                      type="password"
                      :placeholder="$t('freightAuth.confirm_password_placeholder')"
                      autocomplete="on"
                      :class="!pass_confirm_validation && confirm_password !== '' ? 'freight-input-error' : ''"
                      @keyup="validate_confirm_pass"
                    >
                    <p
                      v-if="!pass_confirm_validation && confirm_password !== ''"
                      class="freight-error-msg"
                    >
                      {{ confirm_pass_msg }}
                    </p>
                  </div>
                </div>

                <p class="freight-terms-and-conditions">
                  {{ $t('freightAuth.terms_highlight') }}
                  <span
                    class="freight-terms-higlight"
                    @click="termsAndConditions"
                  >{{ $t('freightAuth.terms_span') }}</span>
                </p>

                <div class="">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    :value="$t('freightAuth.sign_up')"
                    @click="submit"
                  >
                </div>

                <p
                  class="freight-login-redirect"
                  @click="redirectToLogin"
                >
                  {{ $t('freightAuth.login_redirect') }}
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

// const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
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
      options: [
        {
          value: 'en',
          label: 'English (EN)',
        },
        {
          value: 'fr',
          label: 'Francais (FR)',
        },
      ],
      locale: 'en',
    };
  },
  computed: {
    ...mapGetters({
      get_session: 'getSession',
    }),
  },
  watch: {
    locale(val) {
      this.$i18n.locale = val;
      const countryCode = localStorage.getItem('countryCode');
      const acceptLanguage = `${val}-${countryCode}`;
      this.setLanguage(val);
      localStorage.setItem('timeLocale', val);
      localStorage.setItem('language', acceptLanguage);
    },
  },

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
      setLanguage: 'setLanguage',
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
        this.confirm_pass_msg = this.$t('freightAuth.confirm_password_message');
        this.pass_confirm_validation = false;
      }
    },
    submit() {
      localStorage.removeItem('verificationEmail');
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
          preferred_language: this.locale,
        };
        this.processSignUpRequest(payload);
      } else {
        this.doNotification(2, this.$t('freightAuth.sign_up_failure'), this.$t('freightAuth.provide_valid_details'));
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
            localStorage.setItem('verificationEmail', payload.email);
            this.doNotification(1, this.$t('freightAuth.sign_up_success'), this.$t('freightAuth.details_saved'));
            setTimeout(() => {
              this.$router.push('/freight/verify_email');
            }, 800);
          } else {
            this.doNotification(2, this.$t('freightAuth.sign_up_error'), response.message);
          }
        })
        .catch((error) => {
          this.doNotification(2, 'Freight Sign up error', error.response.data[0].message);
        });
    },
    redirectToLogin() {
      this.$router.push('/freight/login');
    },
    termsAndConditions() {
      window.open(
        'https://sendyit.com/terms', '_blank',
      );
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
.set_freight_locale {
  float: right;
  height: 32px;
  width: 38%;
}
</style>
