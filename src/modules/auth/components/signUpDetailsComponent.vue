<template lang="html">
  <div
    class=""
  >
    <div v-if="setUpState === 1">
      <el-row>
        <el-select v-model="locale" placeholder="Select" class="float-right">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-row>
      <p class="sign-up--extra">
        {{$t('signUpDetails.signup_sendy')}}
      </p>
      <div class="account-type--selector">
        <el-radio
          v-model="account"
          label="biz"
          border
          @change="sendGA4Events('select_account_type', {account_type: account})"
        >
          {{$t('signUpDetails.business')}}
        </el-radio>
        <!-- <el-radio
          v-model="account"
          label="peer"
          border
          @change="sendGA4Events('select_account_type', {account_type: account})"
        >
          {{$t('signUpDetails.personal')}}
        </el-radio> -->
      </div>
      <div class="account-details--wrapper">
        <div class="">
          <p class="input--label">
            {{$t('signUpDetails.your_name')}}
          </p>
          <input
            v-model="name"
            class="input-control sign-up-form"
            type="text"
            name="name"
            value=""
            @blur="sendGA4Events('add_name')"
          >
        </div>
        <div
          v-show="account === 'biz'"
          class=""
        >
          <p class="input--label">
            {{$t('signUpDetails.business_name')}}
          </p>
          <input
            v-model="cop_name"
            class="input-control sign-up-form"
            type="text"
            name="name"
            value=""
            @blur="sendGA4Events('add_business_name')"
          >
        </div>
        <div class=" ">
          <p class="input--label">
            {{$t('signUpDetails.email')}}
          </p>
          <input
            v-model="email"
            v-validate="'required|email'"
            class="input-control sign-up-form"
            type="email"
            name="email"
            value=""
            @blur="sendGA4Events('add_email')"
          >
          <p class="sign-up-data-error">
            {{ errors.first('email') }}
          </p>
        </div>
        <div class=" ">
          <p class="input--label">
            {{$t('signUpDetails.phone_number')}}
          </p>
          <vue-tel-input
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
          <p class="sign-up-data-error">
              {{ countryNotSupported }}
          </p>
        </div>
        <div class=" ">
          <p class="input--label">
            {{$t('signUpDetails.order_type')}}
          </p>
          <div class="sign-up-order-type">
            <label class="input--label radio--label"><input
              v-model="selectedCountry"
              type="radio"
              class="radio--label"
              :value="localCountry"
            >{{ localCountry }}</label>
            <label class="input--label radio--label"><input
              v-model="selectedCountry"
              type="radio"
              class="radio--label"
              value="USD"
            >{{$t('signUpDetails.usd')}}</label>
          </div>
        </div>
        <div class=" ">
          <p class="input--label">
            {{$t('signUpDetails.password')}}
          </p>
          <input
            v-model="password"
            class="input-control sign-up-form"
            type="password"
            name="password"
            :placeholder="$t('signUpDetails.password')"
            @keyup="validate_pass"
          >
          <p class="sign-up-data-error">
            {{ pass_msg }}
          </p>
        </div>
        <div
          class=" sign-up-terms"
        >
          <input
            v-model="u_terms"
            type="checkbox"
            name="u_terms"
            class="hiddeny"
          >
          <span class="sign-holder__smaller">
            {{$t('signUpDetails.by_creating')}}
            <a
              class="signup-holder__link"
              href="https://sendyit.com/terms"
            >
             {{$t('signUpDetails.terms')}}
            </a>
          </span>
        </div>
      </div>
      <div
        class=" next-btn-holder"
      >
        <input
          v-model="sign_up_text"
          :class="
            next_step
              ? 'button-primary sign-btn-color next-btn'
              : 'button--signup-inactive sign-btn-color next-btn'
          "
          type="submit"
          name="login_text"
          @click="next"
        >
      </div>
      <div class="sign-up--info">
        <div class="sign-up-text-inner">
          {{$t('signUpDetails.have_account')}}
          <router-link
            class="signup-holder__link"
            to="/auth/sign_in"
          >
            {{$t('signUpDetails.login')}}
          </router-link>
        </div>
        <div class="sign-up-text-inner">
          {{$t('signUpDetails.drive_for_sendy')}}
          <a
            class="signup-holder__link"
            href="https://partner.sendyit.com/onboarding_portal/"
          >
            {{$t('signUpDetails.click_here')}}
          </a>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="sign-up-outer-back-btn">
        <i
          class="el-icon-back sign-up-back"
          @click="go_back_state(1)"
        />
      </div>
      <p class="sign-up--extra">
        {{$t('signUpDetails.verification')}}
      </p>

      <div class="account-details--wrapper">
        <div class=" ">
          <p class="verification-code-info">
            {{$t('signUpDetails.sendy_sms')}}
            <a class="verification-code-recepient">{{ phone }}</a>
          </p>
        </div>
        <div class="">
          <p class="input--label verify-code-header">
            {{$t('signUpDetails.verification_code')}}
          </p>
          <input
            v-model="code"
            class="input-control sign-up-form"
            type="number"
            name="password"
            :placeholder="$t('signUpDetails.code')"
          >
        </div>
        <div
          class=" verify-code-holder"
        >
          <input
            :value="$t('signUpDetails.verify_code')"
            class="button-primary sign-btn-color verify-code-btn"
            type="submit"
            name="login_text"
            @click="verify_code"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import SessionMxn from '../../../mixins/session_mixin';
import InputValidationMixin from '../../../mixins/fields_validations_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';
import EventsMixin from '../../../mixins/events_mixin';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const currencyConversion = require('country-tz-currency');

export default {
  name: 'BizDetailsComponent',
  mixins: [SessionMxn, NotificationMxn, EventsMixin, InputValidationMixin],
  data() {
    return {
      account: 'biz',
      name: '',
      cop_name: '',
      email: '',
      phone: '',
      password: '',
      setUpState: 1,
      pass_msg: '',
      u_terms: true,
      pass_validation: false,
      countryCode: 'KE',
      currency: 'KES',
      code: '',
      localCountry: '',
      localCountryCode: '',
      selectedCountry: '',
      countryNotSupported: '',
      preferredCountries: [],
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
      next_step: true,
      sign_up_text: this.$t('signUpDetails.sign_up'),
      options: [
        {
          value: 'en',
          label: 'English (EN)'
        },
        {
          value: 'fr',
          label: 'Francais (FR)'
        },
      ],
      locale: 'en',
    };
  },
  watch: {
    selectedCountry(val) {
      this.countryCode = this.localCountryCode;
      this.currency = val;
    },
    localCountry(val) {
      this.selectedCountry = val;
    },
    preferredCountries(val) {
      switch (true) {
        case (val.includes(this.localCountryCode.toLowerCase())):
          this.countryNotSupported = '';
          this.next_step = true;
          break;
        default:
          this.countryNotSupported = this.$t('signUpDetails.country_not_supported');
          this.next_step = false;
          break;
      }
    },
    locale(val) {
      this.$i18n.locale = val;
      const countryCode = localStorage.getItem('countryCode');
      const acceptLanguage = `${val}-${countryCode}`;
      this.setLanguage(val);
      localStorage.setItem('timeLocale', val);
      localStorage.setItem('language', acceptLanguage);
    }
  },
  mounted() {
    this.locale = localStorage.getItem('timeLocale');
    this.sendGA4Events('signup_email');
  },
  methods: {
    ...mapActions({
      requestSignUpPhoneVerification: '$_auth/requestSignUpPhoneVerification',
      requestSignUpVerificationVerify: '$_auth/requestSignUpVerificationVerify',
      requestSignUpCheck: '$_auth/requestSignUpCheck',
      requestSignUpSegmentation: '$_auth/requestSignUpSegmentation',
      authSignIn: '$_auth/requestSignIn',
      performGetActions: '$_auth/performGetActions',
    }),
    ...mapMutations({setLanguage: 'setLanguage'}),
    validate_phone() {
      this.$validator.validate();
      this.sendGA4Events('add_phone_number');
    },
    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },
    checkCountryCode(country) {
      this.localCountryCode = country.iso2;
      this.localCountry = currencyConversion.getCountryByCode(country.iso2).currencyCode;

      switch (true) {
        case (this.sendyPhoneProps.preferredCountries.includes(this.localCountryCode.toLowerCase())):
          this.countryNotSupported = '';
          this.next_step = true;
          break;
        default:
          this.countryNotSupported = this.$t('signUpDetails.country_not_supported');
          this.next_step = false;
          break;
      }
      this.sendGA4Events('signup_select_country', {location: country.name});
    },
    validateDetails() {
      let valid = false;
      if (
        this.account === 'biz'
        && (this.name !== ''
          && this.cop_name
          && this.email !== ''
          && this.phone !== ''
          && this.password !== ''
          && this.fieldValidations('user_name', this.name)
          && this.fieldValidations('biz_name', this.cop_name))
      ) {
        valid = true;
      } else if (
        this.account === 'peer'
        && (this.name !== ''
          && this.email !== ''
          && this.phone !== ''
          && this.password !== ''
          && this.fieldValidations('user_name', this.name))
      ) {
        valid = true;
      } else {
        valid = false;
      }

      return valid;
    },
    ValidatePhoneCi() {
      const phoneValid1 = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));
      if (phoneValid1) {
        return phoneValid1;
      }
      const phoneTrim = this.phone.replace(/[()\-\s]+/g, '');
      const trimcode = phoneTrim.includes('+225', 0) ? phoneTrim.split('+225')[1] : phoneTrim;
      const othernumbers = trimcode.length === 10 ? trimcode.slice(2) : trimcode;
      const phone = `+225${othernumbers}`;
      const phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(phone));
      return phoneValid;
    },
    next() {
      if (this.validateDetails()) {
        const phoneValid = this.countryCode === 'CI' ? this.ValidatePhoneCi() : phoneUtil.isValidNumber(phoneUtil.parse(this.phone));

        let emailValid = true;
        for (let i = 0; i < this.errors.items.length; i++) {
          if (this.errors.items[i].field === 'email') {
            emailValid = false;
            break;
          }
        }

        if (phoneValid && emailValid && this.pass_validation) {
          if (this.u_terms) {
            localStorage.removeItem('request_id');
            this.next_step = false;
            this.sign_up_text = this.$t('signUpDetails.sign_up_status');
            const phone = this.phone.replace(/[()\-\s]+/g, '');
            this.phone = phone;
            this.sendGA4Events('select_sign_up');
            this.sendGA4Events('signup_page',
              {
                name: this.name,
                email: this.email,
                phone_number: this.phone,
                cop_name: this.cop_name,
              });
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
                  this.setUpState = 2;
                  this.sendVerificationCode();
                  this.trackMixpanelEvent(this.$t('signUpDetails.user_verification'), {
                    'Client Email ': this.email,
                    'Client Type': 'Web Platform',
                    'Client Phone': phone,
                  });
                } else {
                  this.sign_up_text = this.$t('signUpDetails.sign_up');
                  this.next_step = true;
                  this.doNotification(2, this.$t('signUpDetails.account_verification'), response.data.reason);
                }
              },
              (error) => {
                this.sign_up_text = this.$t('signUpDetails.sign_up');
                this.next_step = true;
                this.doNotification(2, this.$t('signUpDetails.sign_up_error'), this.$t('signUpDetails.unable_connect_server'));
              },
            );
          } else {
            this.doNotification(2, this.$t('signUpDetails.signup_failed'), this.$t('signUpDetails.agree_terms'))
          }
        } else {
          this.doNotification(2, this.$t('signUpDetails.signup_failed'), this.$t('signUpDetails.invalid_details'));
        }
      } else {
        this.checkSignUpFailureResponse();
      }
    },
    checkSignUpFailureResponse() {
      let errorDescription = this.$t('signUpDetails.provide_all');

      if (!this.fieldValidations('user_name', this.name)) {
        errorDescription = this.fieldValidationsError('user_name');
      } else if (!this.fieldValidations('biz_name', this.cop_name) && this.account === 'biz') {
        errorDescription = this.fieldValidationsError('biz_name');
      }

      this.doNotification(2, this.$t('signUpDetails.signup_failed'), errorDescription);
    },
    sendVerificationCode() {
      const phone = this.phone.replace(/[()\-\s]+/g, '');
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
            this.doNotification(1, this.$t('signUpDetails.phone_verification'), this.$t('signUpDetails.code_send'));
            this.trackMixpanelEvent('Verification Code Received', {
              'Client Email ': this.email,
              'Client Type': 'Web Platform',
              'Client Phone': phone,
              'Request ID': response.request_id,
            });
          } else {
            this.next_step = true;
            this.doNotification(2, 'Phone Verification', response.message);
            this.trackMixpanelEvent('Verification Code Failure', {
              'Client Email ': this.email,
              'Client Type': 'Web Platform',
              'Client Phone': phone,
              Reason: response.message,
            });
          }
        },
        (error) => {
          this.next_step = true;
          this.sign_up_text = this.$t('signUpDetails.sign_up');
          this.doNotification(
            2,
            this.$t('signUpDetails.phone_verification_error'),
            this.$t('signUpDetails.unable_connect_server_text'),
          );
          this.trackMixpanelEvent('Verification Code Failure', {
            'Client Email ': this.email,
            'Client Type': 'Web Platform',
            'Client Phone': phone,
            Reason: this.$t('signUpDetails.internal_systems_error'),
          });
        },
      );
    },
    verify_code() {
      if (this.code !== '') {
        this.sendGA4Events('signup_verification_page');
        const requestId = localStorage.getItem('request_id');
        if (requestId === '' || requestId === null) {
          this.doNotification(2, this.$t('signUpDetails.phone_verification_error'), this.$t('signUpDetails.internal_systems_error'));
          setTimeout(() => {
            this.setUpState = 1;
            this.next_step = true;
            this.sign_up_text = this.$t('signUpDetails.sign_up');
            localStorage.removeItem('request_id');
          }, 2000);
        } else {
          const values = {};
          values.code = this.code;
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
                this.doNotification(1, this.$t('signUpDetails.phone_verification'), this.$t('signUpDetails.phone_verification_successful'));
                this.create_account();
              } else {
                this.doNotification(2, this.$t('signUpDetails.phone_verification'), response.message);
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
    create_account() {
      const values = {};
      values.name = this.name;
      values.phone = this.phone;
      values.email = this.email;
      values.password = this.password;
      values.country_code = this.countryCode;
      values.default_currency = this.currency;
      values.preferred_language = this.locale;

      if (this.account === 'biz') {
        values.type = 'biz';
        values.cop_name = this.cop_name;
      } else {
        values.type = 'peer';
        values.platform = 'web';
      }

      const fullPayload = {
        values,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'sign_up_submit',
      };
      this.requestSignUpSegmentation(fullPayload).then(
        (response) => {
          if (response.length > 0) {
            response = response[0];
          }
          if (response.status) {
            const sessionData = response.data;
            const jsonSession = JSON.stringify(sessionData);
            this.setSession(jsonSession);
            let analyticsEnv = '';
            try {
              analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
            } catch (er) {
              // ...
            }
            if ('default' in sessionData && analyticsEnv === 'production') {
              const acc = sessionData[sessionData.default];

              this.$mixpanel.alias(acc.user_email);

              this.$mixpanel.people.set_once({
                $email: acc.user_email,
                $phone: acc.user_phone,
                'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
                $name: acc.user_name,
                $created: new Date(),
                'Client Type': 'Web Platform',
                'Business Name': acc.default === 'biz' ? acc.cop_name : '',
              });

              // login identify
              this.$mixpanel.identify(acc.user_email);
              analytics.identify(`${sessionData.default}_${acc.user_id}`, {
                name: `${acc.user_name}`,
                email: `${acc.user_email}`,
              });

              // track New Account
              this.$mixpanel.track('New Account Created', {
                'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
                'Last Login': new Date(),
                'Client Type': 'Web Platform',
                'Business Name': acc.default === 'biz' ? acc.cop_name : '',
                $email: acc.user_email,
                $phone: acc.user_phone,
                $name: acc.user_name,
              });
            }
            this.directSignInViaAuth();
          } else {
            // failed to login
            // show some sort of error
            this.doNotification(2, this.$t('signUpDetails.signup_error') , response.message);
          }
        },
        (error) => {
          this.doNotification(2, this.$t('signUpDetails.signup_error'), error.response.message);
        },
      );
    },
    go_back_state(code) {
      this.setUpState = code;
      this.code = '';
      localStorage.removeItem('request_id');
    },
    validate_pass() {
      const patt = new RegExp('^.*(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])[a-zA-Z0-9@#$%^&+=]*$');
      const res = patt.test(this.password);
      if (!res) {
        this.pass_msg = this.$t('signUpDetails.password_error')
      } else {
        this.pass_msg = '';
        this.pass_validation = true;
      }
    },
    doNotification(level, title, message) {
      const notification = {
        title,
        level,
        message,
      };
      this.displayNotification(notification);
    },
    directSignInViaAuth() {
      this.deleteSession();
      localStorage.removeItem('request_id');
      const params = {
        email: this.email,
        password: this.password,
      };
      const fullPayload = {
        values: params,
        app: 'NODE_PRIVATE_API',
        endpoint: 'sign_in',
      };
      this.authSignIn(fullPayload).then(
        (response) => {
          if (Object.prototype.hasOwnProperty.call(response, 'status')) {
            const errorResponse = response.data;
            if (errorResponse.code === 1) {
              this.login_text = this.$t('signUpDetails.login');
              this.doNotification(2, this.$t('signUpDetails.login_failed'), this.$t('signUpDetails.wrong_password'));
            } else {
              this.login_text = this.$t('signUpDetails.login');
              this.doNotification(2, this.$t('signUpDetails.login_failed'), this.$t('signUpDetails.account_deactivated'));
            }
          } else {
            try {
              if (response) {
                const refreshToken = response.refresh_token;
                const accessToken = response.access_token;
                // eslint-disable-next-line max-len
                // TODO change from using local storage as session trust store. malicious js will read the data
                localStorage.setItem('jwtToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                const partsOfToken = accessToken.split('.');
                const middleString = partsOfToken[1];
                const data = atob(middleString);
                const { payload } = JSON.parse(data);

                // set session
                // commit everything to the store
                // redirect to orders
                const sessionData = payload;
                const jsonSession = JSON.stringify(sessionData);
                this.setSession(jsonSession);
                this.$store.commit('setSession', sessionData);
                let analyticsEnv = '';
                try {
                  analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
                } catch (er) {
                  // ...
                }

                /* global mixpanel */

                if ('default' in sessionData && analyticsEnv === 'production') {
                  const acc = sessionData[sessionData.default];

                  this.$mixpanel.people.set_once({
                    $email: acc.user_email,
                    $phone: acc.user_phone,
                    'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
                    $name: acc.user_name,
                    'Client Type': 'Web Platform',
                  });

                  // login identify
                  this.$mixpanel.identify(acc.user_email);
                  analytics.identify(`${sessionData.default}_${acc.user_id}`, {
                    name: `${acc.user_name}`,
                    email: `${acc.user_email}`,
                  });

                  // track login
                  this.$mixpanel.track('User Login', {
                    'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
                    'Last Login': new Date(),
                    'Client Type': 'Web Platform',
                  });
                }
                this.$router.push('/orders');
              }
            } catch (error) {
              // @todo Log the error (central logging)
            }
          }
        },
        (error) => {
          this.doNotification(2, this.$t('signUpDetails.login_failed'), this.$t('signUpDetails.login_failed_text'));
          this.$router.push('/auth/sign_in');
        },
      );
    },
    /* global mixpanel */
    trackMixpanelEvent(name, event) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      try {
        if (analyticsEnv === 'production') {
          this.$mixpanel.track(name, event);
        }
      } catch (er) {
        // ...
      }
    },
    fetchSupportedCountries() {
      const fullPayload = {
        app: 'AUTH',
        endpoint: 'currency/get_supported_countries',
      }

      this.sendyPhoneProps.preferredCountries = [];

      this.performGetActions(fullPayload)
        .then((response) => {
          if (response.request_status) {
            const preferredCountries = [];
            response.countries.forEach((country) => {
              preferredCountries.push(country.country_code.toLowerCase());
            });
            this.sendyPhoneProps.preferredCountries = preferredCountries ;
            this.vueTelInputProps.preferredCountries = preferredCountries ;
            this.preferredCountries = preferredCountries;
          } else {
            this.sendyPhoneProps.preferredCountries = ['ke', 'tz', 'ug'];
          }
        })
        .catch((error) => {
          this.sendyPhoneProps.preferredCountries = ['ke', 'tz', 'ug'];
        });
    },
  },
  created() {
    this.fetchSupportedCountries();
  },
};
</script>

<style lang="css" scoped>
@import "../../../../src/assets/styles/sign_up.css";
.cards--align > div > div > div:nth-child(3) > div:nth-child(1) > div > div{
  width: 182%;
}
body > div.el-select-dropdown.el-popper{
  width: 25%;
}
.button--signup-inactive {
  cursor: not-allowed !important;
  background: rgba(0,0,0,0.50) !important;
  transition: background-color 0.3s !important;
  color: #fff !important;
  color: #ecf0f1;
  cursor: pointer;
  position: relative;
  display: block;
  border-radius: 4px;
  height: 40px;
  padding-left: 20px;
  padding-right: 20px;
  font-size: 13px;
  pointer-events: none;
}
.sign-btn-color {
  border-width: 0px !important;
}
.float-right {
  float: right;
  height: 32px;
  width: 150px;
}

</style>
