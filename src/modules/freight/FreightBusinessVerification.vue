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
                {{ businessName }}
              </p>
              <p class="freight-sign-up-description">
                Business Details
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">Country</label>
                  <div class="freight-auth-padding">
                    <vue-tel-input
                      class="input-control sign-up-form business-country-select"
                      type="number"
                      name="phone"
                      value=""
                      data-vv-validate-on="blur"
                      v-bind="phoneInputProps"
                      @country-changed="checkCountryCode"
                    />
                  </div>
                </div>

                <div
                  v-if="checkBizRegistration()"
                  class="freight-auth-padding"
                >
                  <label class="freight-input-label">{{ userBizRgLabel }}</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="biz_registration"
                      class="input-control freight-auth-input"
                      type="text"
                      :placeholder="userBizRgPlaceholder"
                      autocomplete="on"
                    >
                    <span
                      v-show="!bizRegValidation(biz_registration)"
                      class="invalid-kra"
                    >
                      {{ bizRegFailResponse }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="checkTaxAuthorityPin()"
                  class="freight-auth-padding"
                >
                  <label class="freight-input-label">{{ userKraNoLabel }}</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="kra_pin"
                      class="input-control freight-auth-input"
                      type="text"
                      :placeholder="userKraNoPlaceholder"
                      autocomplete="on"
                    >
                    <span
                      v-show="!kraPinValidation(kra_pin)"
                      class="invalid-kra"
                    >
                      {{ kraFailResponse }}
                    </span>
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
                    @click="verifyBusinessDetails"
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
      businessName: '',
      updateCrmData: false,
      input: '',
      kra_pin: '',
      biz_registration: '',
      biz_setup_stage: 0,
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
      valid_biz_country: true,
      country: '',
    };
  },
  computed: {
    ...mapGetters({
      get_session: 'getSession',
      getVerificationStep: '$_freight/getVerificationStep',
    }),
  },
  watch: {
    getVerificationStep(val) {
      if (val === 0) {
        this.updateCrmData = false;
      }
      this.biz_setup_stage = val;
    },
  },

  created() {},
  mounted() {
    this.updateCrmData = false;
    this.checkSessionData();
    if (this.getVerificationStep > 0) {
      this.biz_setup_stage = this.getVerificationStep;
      this.updateCrmData = true;
    }
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
    checkSessionData() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        this.businessName = session[session.default].user_name;
        this.kra_pin = session[session.default].tax_authority_pin;
        this.biz_registration = session[session.default].company_reg_no;
      } else {
        this.$router.push('/freight');
      }
    },
    checkCountryCode(country) {
      this.country = country.iso2;
      this.localCountry = currencyConversion.getCountryByCode(country.iso2).currencyCode;
      switch (true) {
        case this.phoneInputProps.preferredCountries.includes(this.country.toLowerCase()):
          this.valid_biz_country = true;
          break;
        default:
          this.valid_biz_country = false;
          break;
      }
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
    checkBizRegistration() {
      const session = this.$store.getters.getSession;
      let resp = false;
      if (
        session[session.default].company_reg_no === ''
        || !this.bizRegValidation(session[session.default].company_reg_no)
      ) {
        resp = true;
      }
      return resp;
    },
    checkTaxAuthorityPin() {
      const session = this.$store.getters.getSession;
      let resp = false;
      if (
        session[session.default].tax_authority_pin === ''
        || !this.kraPinValidation(session[session.default].tax_authority_pin)
      ) {
        resp = true;
      }
      return resp;
    },
    verifyBusinessDetails() {
      const session = this.$store.getters.getSession;

      if (this.country === '' && !this.valid_biz_country) {
        this.doNotification(
          2,
          this.$t('freight.final_setup_error'),
          'Kindly select supported country',
        );
      } else if (
        this.kra_pin === ''
        || (this.kra_pin !== '' && !this.kraPinValidation(this.kra_pin))
      ) {
        this.doNotification(2, this.$t('freight.final_setup_error'), this.kraFailResponse);
      } else if (
        this.biz_registration === ''
        || (this.biz_registration !== '' && !this.bizRegValidation(this.biz_registration))
      ) {
        this.doNotification(2, this.$t('freight.final_setup_error'), this.bizRegFailResponse);
      } else {
        const payload = {
          tax_authority_pin: this.kra_pin,
          company_reg_no: this.biz_registration,
          country_code: this.country,
          cop_id: session[session.default].cop_id,
        };
        this.initiateBusinessInfoUpdate(payload);
      }
    },
    initiateBusinessInfoUpdate(val) {
      console.log('val', val);
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
.invalid-kra {
  display: block;
  color: #f57f20;
  font-size: 14px;
}
</style>
