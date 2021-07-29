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
                      :enabled-country-code="true"
                      @country-changed="checkBizCountryCode"
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
                      class="freight-error-msg"
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
                      class="freight-error-msg"
                    >
                      {{ kraFailResponse }}
                    </span>
                  </div>
                </div>

                <p class="freight-terms-and-conditions">
                  By continuing you are agreeing to Sendy Freight
                  <span
                    class="freight-terms-higlight"
                    @click="shipperTerms"
                  >shipper terms and conditions</span>
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
              <p class="freight-sign-up-header">
                {{ businessName }}
              </p>
              <p class="freight-sign-up-description">
                Director(s)
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label
                    class="freight-input-label"
                  >Are you a director at {{ businessName }}?</label>
                  <div class="freight-auth-padding">
                    <el-radio
                      v-model="director_option"
                      label="1"
                    >
                      Yes
                    </el-radio>
                    <el-radio
                      v-model="director_option"
                      label="2"
                    >
                      No
                    </el-radio>
                  </div>
                </div>
                <div
                  v-if="director_option === '2'"
                  class=""
                >
                  <div class="freight-auth-padding">
                    <label class="freight-input-label">Name</label>
                    <div class="freight-auth-padding">
                      <input
                        v-model="director_name"
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
                        v-model.trim="director_phone"
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
                  v-if="director_option !== ''"
                  class="freight-auth-padding"
                >
                  <label class="freight-input-label">ID</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="director_id"
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
                    @click="verifyDirectorDetails"
                  >
                </div>
              </div>
            </div>

            <!-- Email Recipient -->

            <div
              v-if="biz_setup_stage === 3"
              class="freight-signup-outer"
            >
              <p class="freight-sign-up-header">
                One Last Thing
              </p>
              <p class="freight-sign-up-description">
                We need your phone number for transporters to notify you of sent invoices
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">Phone Number </label>
                  <div class="freight-auth-padding">
                    <vue-tel-input
                      v-model.trim="invoice_phone"
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

                <div class="reset-freight-pass-outer">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Verify Phone Number"
                    @click="verifyInvoicePhone"
                  >
                </div>
              </div>
            </div>

            <!-- Phone Verification -->

            <div
              v-if="biz_setup_stage === 4"
              class="freight-signup-outer"
            >
              <p class="freight-sign-up-header">
                Verify Phone Number
              </p>
              <p class="freight-sign-up-description">
                Please enter the verification code we have sent to
                <span class="validate-freight-phone">{{ invoice_phone }}</span>
              </p>
              <div class="">
                <div class="freight-auth-padding">
                  <label class="freight-input-label">Verfication code</label>
                  <div class="freight-auth-padding">
                    <input
                      v-model="verification_code"
                      class="input-control freight-auth-input"
                      type="text"
                      placeholder="Enter Code"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <!-- <div class="verification-retry-options">
                  <p class="verification-retry-options-label">
                    Change Phone Number
                  </p>
                  <p class="verification-retry-options-label">
                    Receive a call instead
                  </p>
                </div> -->

                <div class="">
                  <input
                    class="button-primary freight-auth-button"
                    type="submit"
                    value="Verify Phone Number"
                    @click="verifyPhone"
                  >
                </div>
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

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
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
      director_option: '',
      director_name: '',
      director_phone: '',
      director_id: '',
      phone: '',
      invoice_phone: '',
      verification_code: '',
      phoneInputProps: {
        mode: 'international',
        defaultCountry: 'ke',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('signUpDetails.enter_phone_number'),
        required: false,
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
      country_code: '',
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
    country_code(val) {
      this.setBusinessCountry(val);
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
      freightBusinessUpdate: '$_freightAuth/freightBusinessUpdate',
      requestSignUpPhoneVerification: '$_auth/requestSignUpPhoneVerification',
      requestSignUpVerificationVerify: '$_auth/requestSignUpVerificationVerify',
      requestPersonalInfo: '$_user/requestPersonalInfo',
    }),

    ...mapMutations({
      setVerificationStep: '$_freight/setVerificationStep',
      setVerificationStage: '$_freight/setVerificationStage',
      setBusinessCountry: '$_freight/setBusinessCountry',
    }),
    validate_phone() {
      this.$validator.validate();
    },
    checkSessionData() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        this.businessName = session[session.default].cop_name;
        this.kra_pin = session[session.default].tax_authority_pin;
        this.biz_registration = session[session.default].company_reg_no;
        if (session[session.default].country_code !== '') {
          this.phoneInputProps.defaultCountry = session[session.default].country_code.toLowerCase();
        }
      } else {
        this.$router.push('/freight');
      }
    },
    checkBizCountryCode(country) {
      document.getElementsByClassName('vti__country-code')[0].innerHTML = country.name;
      this.country_code = country.iso2;
      this.localCountry = currencyConversion.getCountryByCode(country.iso2).currencyCode;
      switch (true) {
        case this.phoneInputProps.preferredCountries.includes(this.country_code.toLowerCase()):
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

      if (this.country_code === '' && !this.valid_biz_country) {
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
          country_code: this.country_code,
          cop_id: session[session.default].cop_id,
        };
        this.initiateBusinessInfoUpdate(payload);
      }
    },
    initiateBusinessInfoUpdate(val) {
      const session = this.$store.getters.getSession;

      const fullPayload = {
        values: val,
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'freight/business-details',
      };
      this.freightBusinessUpdate(fullPayload)
        .then((response) => {
          if (response.status) {
            const updatedSession = session;
            updatedSession[session.default].tax_authority_pin = this.kra_pin;
            updatedSession[session.default].company_reg_no = this.biz_registration;

            const newSession = JSON.stringify(updatedSession);
            this.setSession(newSession);
            this.doNotification(
              1,
              'Business setup success',
              'Account details have been updated successfully',
            );
            this.checkBusinessSteps();
          } else {
            this.doNotification(2, 'Business setup error', response.message);
          }
        })
        .catch(() => {
          this.doNotification(
            2,
            'Business setup failure',
            'Something went wrong , kindly retry again',
          );
        });
    },
    checkBusinessSteps() {
      const session = this.$store.getters.getSession;

      if (Object.keys(session[session.default].director_details).length === 0) {
        this.setVerificationStep(2);
      } else if (session[session.default].user_phone === '') {
        this.setVerificationStep(3);
      } else {
        this.setVerificationStep(0);
        this.updateCrmData = false;
      }
    },
    verifyDirectorDetails() {
      let phoneValid = false;
      if (this.director_phone !== '') {
        phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.director_phone));
      }
      if (this.director_option === '') {
        this.doNotification(2, 'Directors update error', 'Kindly select radio button to proceed');
      } else if (this.director_option === '1' && this.director_id === '') {
        this.doNotification(
          2,
          'Directors update error',
          'Kindly provide director identification number',
        );
      } else if (
        this.director_option === '2'
        && (this.director_id === '' || !phoneValid || this.director_name === '')
      ) {
        this.doNotification(
          2,
          'Directors update error',
          'Kindly provide all valid director details',
        );
      } else {
        this.structureDirectorsPayload();
      }
    },
    structureDirectorsPayload() {
      const directorsArray = [];
      let singleDirector = {};
      const session = this.$store.getters.getSession;
      if (this.director_option === '1') {
        singleDirector = {
          name: session[session.default].user_name,
          cop_id: session[session.default].cop_id,
          national_id: this.director_id,
        };
        if (session[session.default].user_phone !== '') {
          singleDirector.phone = session[session.default].user_phone;
        }
      } else {
        singleDirector = {
          phone: this.director_phone.replace(/[()\-\s]+/g, ''),
          name: this.director_name,
          cop_id: session[session.default].cop_id,
          national_id: this.director_id,
        };
      }
      directorsArray.push(singleDirector);
      if (directorsArray.length > 0) {
        this.directorsUpdateRequest(directorsArray);
      }
    },
    directorsUpdateRequest(val) {
      const session = this.$store.getters.getSession;
      const payload = {
        business_directors: val,
      };
      const fullPayload = {
        values: payload,
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'freight/business-directors',
      };
      this.freightBusinessUpdate(fullPayload)
        .then((response) => {
          if (response.status) {
            const updatedSession = session;
            updatedSession[session.default].director_details = response.businessDirectors;

            const newSession = JSON.stringify(updatedSession);
            this.setSession(newSession);
            this.doNotification(
              1,
              'Director setup success',
              'Director details have been updated successfully',
            );
            this.checkBusinessSteps();
          } else {
            this.doNotification(2, 'Directors setup error', response.message);
          }
        })
        .catch(() => {
          this.doNotification(
            2,
            'Directors setup failure',
            'Something went wrong , kindly retry again',
          );
        });
    },
    verifyInvoicePhone() {
      let phoneValid = false;

      if (this.invoice_phone !== '' && this.invoice_phone.length > 5) {
        phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.invoice_phone));
      }

      if (phoneValid) {
        this.initiateVerificationRequest(this.invoice_phone);
      } else {
        this.doNotification(
          2,
          'Invoice number setup failure',
          'Kindly provide a valid phone number',
        );
      }
    },
    initiateVerificationRequest() {
      const phone = this.invoice_phone.replace(/[()\-\s]+/g, '');
      const values = {};
      values.number = phone;
      const fullPayload = {
        values,
        vm: this,
        app: 'CUSTOMERS_APP',
        endpoint: 'request_verification',
      };
      this.requestSignUpPhoneVerification(fullPayload).then(
        (response) => {
          if (response.status) {
            localStorage.setItem('request_id', response.request_id);
            this.doNotification(
              1,
              this.$t('signUpDetails.phone_verification'),
              this.$t('signUpDetails.code_send'),
            );
            this.setVerificationStep(4);
          } else {
            this.doNotification(2, 'Phone Verification', response.message);
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('signUpDetails.phone_verification_error'),
            this.$t('signUpDetails.unable_connect_server_text'),
          );
        },
      );
    },
    verifyPhone() {
      const session = this.$store.getters.getSession;
      if (this.verification_code !== '') {
        const requestId = localStorage.getItem('request_id');
        if (requestId === '' || requestId === null) {
          this.doNotification(
            2,
            this.$t('signUpDetails.phone_verification_error'),
            this.$t('signUpDetails.internal_systems_error'),
          );
          setTimeout(() => {
            this.clearAuthToken();
          }, 2000);
        } else {
          const values = {};
          values.code = this.verification_code;
          values.request_id = requestId;
          const fullPayload = {
            values,
            vm: this,
            app: 'CUSTOMERS_APP',
            endpoint: 'check_verification',
          };
          this.requestSignUpVerificationVerify(fullPayload).then(
            (response) => {
              if (response.status) {
                this.doNotification(
                  1,
                  this.$t('signUpDetails.phone_verification'),
                  this.$t('signUpDetails.phone_verification_successful'),
                );
                const phone = this.invoice_phone.replace(/[()\-\s]+/g, '');
                const updatedSession = session;
                updatedSession[session.default].user_phone = phone;
                const newSession = JSON.stringify(updatedSession);
                this.setSession(newSession);

                this.updatePhoneInfo(phone);

                this.updateCrmData = false;
                this.setVerificationStage('success');
                this.setVerificationStep(0);
              } else {
                this.doNotification(
                  2,
                  this.$t('signUpDetails.phone_verification'),
                  response.message,
                );
              }
            },
            (error) => {
              this.doNotification(
                2,
                this.$t('signUpDetails.phone_verification_error'),
                error.response.data.message,
              );
            },
          );
        }
      } else {
        this.doNotification(
          2,
          this.$t('signUpDetails.missing_verification_code'),
          this.$t('signUpDetails.enter_verification_code'),
        );
      }
    },
    updatePhoneInfo(phone) {
      const session = this.$store.getters.getSession;
      const values = {
        cop_user_id: session[session.default].user_id,
        user_name: session[session.default].user_name,
        user_email: session[session.default].user_email,
        user_phone: phone,
      };
      const fullPayload = {
        values,
        app: 'NODE_PRIVATE_API',
        endpoint: 'update_user',
      };
      this.requestPersonalInfo(fullPayload).then(() => {}, () => {});
    },
    clearAuthToken() {
      try {
        localStorage.removeItem('request_id');
        localStorage.removeItem('_sessionSnack');
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        this.$store.commit('deleteSession');

        this.$store.unregisterModule('$_freight');
        this.$store.unregisterModule('$_freightAuth');
      } catch (er) {
        // freight was not registered
      } finally {
        this.$router.push('/freight/login');
      }
    },
    shipperTerms() {
      const route = this.$router.resolve({ path: '/freight/terms_and_conditions' });
      window.open(route.href, '_blank');
    },
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
