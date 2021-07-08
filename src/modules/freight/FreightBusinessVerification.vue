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
            <!-- Business Details -->

            <div
              v-if="biz_setup_stage === 1"
              class="freight-signup-outer"
            >
              <p class="freight-sign-up-header">
                Amini Movers Limited
              </p>
              <p class="freight-sign-up-description">
                Business Details
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">Country</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="input"
                      class="input-control freight-auth-input"
                      type="text"
                      placeholder=""
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div class="freight-auth-padding">
                  <label class="freight-input-label">Business Registration Number</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="input"
                      class="input-control freight-auth-input"
                      type="text"
                      placeholder="Enter your business registration number"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div class="freight-auth-padding">
                  <label class="freight-input-label">Business KRA pin</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="input"
                      class="input-control freight-auth-input"
                      type="text"
                      placeholder="Enter your business KRA pin"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <p class="freight-terms-and-conditions">
                  By continuing you are agreeing to Sendy Freight
                  <span class="freight-terms-higlight">shipper terms and conditions</span>
                </p>

                <div class="reset-freight-pass-outer">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Next"
                    @click="verifyPhone"
                  >
                </div>
              </div>
            </div>

            <!-- Director(s)-->

            <div
              v-if="biz_setup_stage === 2"
              class="freight-signup-outer"
            >
              <div class="">
                <i class="el-icon-back" />
              </div>

              <p class="freight-sign-up-header">
                Amini Movers Limited
              </p>
              <p class="freight-sign-up-description">
                Director(s)
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label
                    class="freight-input-label"
                  >Are you a director at Amini Movers Limited?</label>
                  <div class="freight-auth-padding">
                    <el-radio
                      v-model="radio"
                      label="1"
                    >
                      Yes
                    </el-radio>
                    <el-radio
                      v-model="radio"
                      label="2"
                    >
                      No
                    </el-radio>
                  </div>
                </div>
                <div
                  v-if="radio === '2'"
                  class=""
                >
                  <div class="freight-auth-padding">
                    <label class="freight-input-label">Name</label>
                    <div class="freight-auth-padding">
                      <input
                        v-model="input"
                        class="input-control freight-auth-input"
                        type="text"
                        placeholder="Enter the name of the director"
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
                </div>

                <div
                  v-if="radio !== ''"
                  class="freight-auth-padding"
                >
                  <label class="freight-input-label">ID</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="input"
                      class="input-control freight-auth-input"
                      type="text"
                      placeholder="Enter the identification number of the director"
                      autocomplete="on"
                    >
                  </div>
                </div>
                <div class="reset-freight-pass-outer">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Next"
                    @click="verifyPhone"
                  >
                </div>
              </div>
            </div>

            <!-- Email Recipient -->

            <div
              v-if="biz_setup_stage === 3"
              class="freight-signup-outer"
            >
              <div class="">
                <i class="el-icon-back" />
              </div>
              <p class="freight-sign-up-header">
                One Last Thing
              </p>
              <p class="freight-sign-up-description">
                We need your email for transporters to send you invoices
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">Email Address</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="input"
                      class="input-control freight-auth-input"
                      type="email"
                      placeholder="Enter your email"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div class="reset-freight-pass-outer">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Verify Email"
                    @click="verifyPhone"
                  >
                </div>
              </div>
            </div>

            <!-- Email Verification -->

            <div
              v-if="biz_setup_stage === 4"
              class="freight-signup-outer"
            >
              <div class="congratulations_img">
                <img
                  src="https://images.sendyit.com/web_platform/freight/verification-email-sent.png"
                  class="freight-img-logo"
                >
              </div>
              <p class="freight-sign-up-header">
                Check Your Email
              </p>
              <p class="freight-sign-up-description">
                We’ve sent a link to fatmamoha@gmail.com Please click the link to proceed
              </p>
              <div class="verification-retry-options">
                <p class="verification-retry-options-label">
                  Change email address
                </p>
                <p class="verification-retry-options-label">
                  Resend the link
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
import SessionMxn from '../../mixins/session_mixin';
import NotificationMxn from '../../mixins/notification_mixin';
import MixpanelMixin from '../../mixins/mixpanel_events_mixin';
import ValidationMixin from '../../mixins/validation_mixin';

// const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const currencyConversion = require('country-tz-currency');

export default {
  name: 'PhoneVerification',
  mixins: [SessionMxn, NotificationMxn, MixpanelMixin, ValidationMixin],
  data() {
    return {
      updateCrmData: true,
      input: '',
      biz_setup_stage: 4,
      radio: '',
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
    verifyPhone() {},
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../src/assets/styles/freight_auth.css";
</style>
