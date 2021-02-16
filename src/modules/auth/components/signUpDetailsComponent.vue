<template lang="html">
  <div
    class=""
  >
    <div v-if="setUpState === 1">
      <p class="sign-up--extra">
        Sign up for Sendy
      </p>
      <div class="account-type--selector">
        <el-radio
          v-model="account"
          label="biz"
          border
        >
          Business
        </el-radio>
        <el-radio
          v-model="account"
          label="peer"
          border
        >
          Personal
        </el-radio>
      </div>
      <div class="account-details--wrapper">
        <div class="">
          <p class="input--label">
            Your Name
          </p>
          <input
            v-model="name"
            class="input-control sign-up-form"
            type="text"
            name="name"
            value=""
          >
        </div>
        <div
          v-show="account === 'biz'"
          class=""
        >
          <p class="input--label">
            Business Name
          </p>
          <input
            v-model="cop_name"
            class="input-control sign-up-form"
            type="text"
            name="name"
            value=""
          >
        </div>
        <div class=" ">
          <p class="input--label">
            Email
          </p>
          <input
            v-model="email"
            v-validate="'required|email'"
            class="input-control sign-up-form"
            type="email"
            name="email"
            value=""
          >
          <p class="sign-up-data-error">
            {{ errors.first('email') }}
          </p>
        </div>
        <div class=" ">
          <p class="input--label">
            Phone number
          </p>
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
        <div class=" ">
          <p class="input--label">
            Order type
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
            >USD</label>
          </div>
        </div>
        <div class=" ">
          <p class="input--label">
            Password
          </p>
          <input
            v-model="password"
            class="input-control sign-up-form"
            type="password"
            name="password"
            placeholder="Password"
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
            By creating a Sendy account you’re agreeing to the
            <a
              class="signup-holder__link"
              href="https://sendyit.com/terms"
            >
              terms and conditions
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
          Do you already have an account?
          <router-link
            class="signup-holder__link"
            to="/auth/sign_in"
          >
            Login
          </router-link>
        </div>
        <div class="sign-up-text-inner">
          Want to drive for Sendy?
          <a
            class="signup-holder__link"
            href="https://partner.sendyit.com/onboarding_portal/"
          >
            Click here
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
        Verification
      </p>

      <div class="account-details--wrapper">
        <div class=" ">
          <p class="verification-code-info">
            For your security, Sendy wants to make sure it's really you.
            An SMS with your verification code was sent to
            <a class="verification-code-recepient">{{ phone }}</a>
          </p>
        </div>
        <div class="">
          <p class="input--label verify-code-header">
            Enter verification code
          </p>
          <input
            v-model="code"
            class="input-control sign-up-form"
            type="number"
            name="password"
            placeholder="Code"
          >
        </div>
        <div
          class=" verify-code-holder"
        >
          <input
            value="VERIFY CODE"
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
import { mapActions } from 'vuex';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const currencyConversion = require('country-tz-currency');

export default {
  name: 'BizDetailsComponent',
  mixins: [SessionMxn, NotificationMxn],
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
      phoneInputProps: {
        mode: 'international',
        defaultCountry: 'ke',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: 'Enter a phone number',
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        preferredCountries: ['ke', 'ug', 'tz'],
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
      sign_up_text: 'SIGN UP',
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
  },
  methods: {
    ...mapActions({
      requestSignUpPhoneVerification: '$_auth/requestSignUpPhoneVerification',
      requestSignUpVerificationVerify: '$_auth/requestSignUpVerificationVerify',
      requestSignUpCheck: '$_auth/requestSignUpCheck',
      requestSignUpSegmentation: '$_auth/requestSignUpSegmentation',
      authSignIn: '$_auth/requestSignIn',
    }),
    validate_phone() {
      this.$validator.validate();
    },
    checkCountryCode(country) {
      this.localCountryCode = country.iso2;
      this.localCountry = currencyConversion.getCountryByCode(country.iso2).currencyCode;
    },
    validateDetails() {
      let valid = false;
      if (this.account === 'biz' && (this.name !== '' && this.cop_name && this.email !== '' && this.phone !== '' && this.password !== '')) {
        valid = true;
      } else if (this.account === 'peer' && (this.name !== '' && this.email !== '' && this.phone !== '' && this.password !== '')) {
        valid = true;
      } else {
        valid = false;
      }

      return valid;
    },
    next() {
      if (this.validateDetails()) {
        const phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));

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
            this.sign_up_text = 'SIGNING UP ...';
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
                  this.setUpState = 2;
                  this.sendVerificationCode();
                  this.trackMixpanelEvent('User verification initiated', {
                    'Client Email ': this.email,
                    'Client Type': 'Web Platform',
                    'Client Phone': phone,
                  });
                } else {
                  this.sign_up_text = 'SIGN UP';
                  this.next_step = true;
                  this.doNotification(2, 'Account Verification failed', response.data.reason);
                }
              },
              (error) => {
                this.sign_up_text = 'SIGN UP';
                this.next_step = true;
                this.doNotification(2, 'Sign Up Error ', 'Unable to connect to the server . Please try again');
              },
            );
          } else {
            this.doNotification(2, 'Sign Up failed', 'Agree to Terms and Conditions');
          }
        } else {
          this.doNotification(2, 'Sign Up failed', 'Invalid details');
        }
      } else {
        this.doNotification(2, 'Sign Up failed', 'Provide all details');
      }
    },
    sendVerificationCode() {
      const phone = this.phone.replace(/[()\-\s]+/g, '');
      const values = {};
      values.number = phone;
      const fullPayload = {
        values,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'request_verification',
      };
      this.requestSignUpPhoneVerification(fullPayload).then(
        (response) => {
          if (response.status) {
            localStorage.setItem('request_id', response.request_id);
            this.doNotification(1, 'Phone Verification', 'Phone verification code has been sent');
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
          this.sign_up_text = 'SIGN UP';
          this.doNotification(
            2,
            'Phone Verification Error ',
            'Unable to connect to the server . Please try again after 15 minutes .',
          );
          this.trackMixpanelEvent('Verification Code Failure', {
            'Client Email ': this.email,
            'Client Type': 'Web Platform',
            'Client Phone': phone,
            Reason: 'Unable to connect to the server . Please try again after 15 minutes .',
          });
        },
      );
    },
    verify_code() {
      if (this.code !== '') {
        const requestId = localStorage.getItem('request_id');
        if (requestId === '' || requestId === null) {
          this.doNotification(2, 'Phone Verification Error', 'Internal system error .Kindly try after 15 minutes');
          setTimeout(() => {
            this.setUpState = 1;
            this.next_step = true;
            this.sign_up_text = 'SIGN UP';
            localStorage.removeItem('request_id');
          }, 2000);
        } else {
          const values = {};
          values.code = this.code;
          values.request_id = requestId;
          const fullPayload = {
            values,
            vm: this,
            app: 'NODE_PRIVATE_API',
            endpoint: 'check_verification',
          };
          this.requestSignUpVerificationVerify(fullPayload).then(
            (response) => {
              if (response.status) {
                this.doNotification(1, 'Phone Verification', 'Phone verification successful! Your Account will be created shortly ...');
                this.create_account();
              } else {
                this.doNotification(2, 'Phone Verification', response.message);
              }
            },
            (error) => {
              this.doNotification(
                2,
                'Phone Verification Error ',
                error.response.data.message,
              );
            },
          );
        }
      } else {
        this.doNotification(
          2,
          'Missing Verification Code',
          'Please enter a verification code',
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

              mixpanel.alias(acc.user_email);

              mixpanel.people.set_once({
                $email: acc.user_email,
                $phone: acc.user_phone,
                'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
                $name: acc.user_name,
                $created: new Date(),
                'Client Type': 'Web Platform',
                'Business Name': acc.default === 'biz' ? acc.cop_name : '',
              });

              // login identify
              mixpanel.identify(acc.user_email);

              // track New Account
              mixpanel.track('New Account Created', {
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
            this.doNotification(2, 'Sign Up Error ', response.message);
          }
        },
        (error) => {
          this.doNotification(2, 'Sign Up Error ', error.response.message);
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
        this.pass_msg = 'Password must be at least 8 characters long, contain at least one number and have a mixture of uppercase and lowercase letters.';
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
              this.login_text = 'Login';
              this.doNotification(2, 'Login failed', 'Wrong password or email.');
            } else {
              this.login_text = 'Login';
              this.doNotification(2, 'Login failed', 'Account deactivated');
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

                  mixpanel.people.set_once({
                    $email: acc.user_email,
                    $phone: acc.user_phone,
                    'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
                    $name: acc.user_name,
                    'Client Type': 'Web Platform',
                  });

                  // login identify
                  mixpanel.identify(acc.user_email);

                  // track login
                  mixpanel.track('User Login', {
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
          this.doNotification(2, 'Login failed', 'Login failed. Please try again');
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
          mixpanel.track(name, event);
        }
      } catch (er) {
        // ...
      }
    },
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
</style>
