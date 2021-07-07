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
                  <label class="freight-input-label">Phone Number</label>
                  <div class="freight-auth-padding">
                    <vue-tel-input
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
                    >
                  </div>
                </div>

                <div class="freight-auth-padding">
                  <label class="freight-input-label">Confirm Password</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="confirm_password"
                      class="input-control freight-auth-input"
                      type="password"
                      placeholder="Re-enter your password"
                      autocomplete="on"
                    >
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
      phone: '',
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
          this.valid_country = true;
          break;
        default:
          this.valid_country = false;
          break;
      }
    },
    submit() {},
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
