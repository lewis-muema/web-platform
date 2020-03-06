<template lang="html">
  <div
    class=""
  >
    <div v-if="peerState === 1">
      <div class="sign-up-outer-back-btn">
        <i
          class="el-icon-back sign-up-back"
          @click="go_back(1)"
        />
      </div>

      <p class="sign-up--extra">
        Sign up for a Sendy personal account
      </p>

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
        <div class="">
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
        <div class="">
          <p class="input--label">
            Phone Number
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
          />
          <p
            v-show="errors.has('phone')"
            class="sign-up-data-error"
          >
            {{ errors.first('phone') }}
          </p>
        </div>
        <div class="">
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
          class="sign-up-terms"
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
              class=" sign-holder__grey"
              href="https://sendyit.com/terms"
            >
              terms and conditions
            </a>
          </span>
        </div>
      </div>
      <div
        class="verify-acc-holder"
      >
        <input
          value="Verify Account"
          class="button-primary sign-btn-color verify-acc-btn"
          type="submit"
          name="login_text"
          @click="verify_acc"
        >
      </div>
    </div>
    <div v-else>
      <div class="sign-up-outer-back-btn">
        <i
          class="el-icon-back sign-up-back"
          @click="one_step()"
        />
      </div>

      <p class="sign-up--extra">
        Sign up for a Sendy personal account
      </p>

      <div class="account-details--wrapper">
        <div class="">
          <p class="verification-code-info">
            For your security, Sendy wants to make sure it's really you. We will send a message with
            your verification code.
          </p>
        </div>
        <div class="">
          <p class="input--label">
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
          class="verify-code-holder"
        >
          <input
            value="Sign Up"
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
import { mapGetters, mapMutations, mapActions } from 'vuex';
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import SessionMxn from '../../../mixins/session_mixin';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
const currencyConversion = require('country-tz-currency');

export default {
  name: 'PeerDetailsComponent',
  mixins: [SessionMxn],
  data() {
    return {
      phone: '',
      email: '',
      password: '',
      u_terms: '',
      name: '',
      pass_msg: '',
      countryCode: 'KE',
      pass_validation: false,
      peerState: 1,
      code: '',
      request_id: '',
      currency: 'KES',
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
    };
  },
  computed: {
    ...mapGetters({
      getViewState: '$_auth/getViewState',
    }),
  },
  methods: {
    ...mapMutations({
      setViewState: '$_auth/setViewState',
      setActiveTab: '$_auth/setActiveTab',
    }),
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
    go_back(code) {
      this.setViewState(code);
      this.setActiveTab('Peer');
      this.phone = '';
      this.email = '';
      this.password = '';
      this.u_terms = '';
      this.name = '';
    },
    one_step() {
      this.peerState = 1;
      this.code = '';
      this.request_id = '';
    },
    verify_acc() {
      if (this.name !== '' && this.email !== '' && this.phone !== '' && this.password !== '') {
        const phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));
        const phoneNumber = parsePhoneNumberFromString(this.phone);
        this.countryCode = phoneNumber.country;

        const countryCodeData = currencyConversion.getCountryByCode(phoneNumber.country);
        this.currency = countryCodeData.currencyCode;

        let emailValid = true;
        for (let i = 0; i < this.errors.items.length; i++) {
          if (this.errors.items[i].field === 'email') {
            emailValid = false;
            break;
          }
        }

        if (phoneValid && emailValid && this.pass_validation) {
          if (this.u_terms) {
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
                  this.sendVerificationCode();
                } else {
                  this.doNotification(2, 'Account Verification failed', response.data.reason);
                }
              },
              (error) => {
                this.doNotification(2, 'Sign Up Error ', 'Check Internet connection and retry');
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
      values.phone_no = phone;
      const fullPayload = {
        values,
        vm: this,
        app: 'PRIVATE_API',
        endpoint: 'verify_phone',
      };
      this.requestSignUpPhoneVerification(fullPayload).then(
        (response) => {
          if (response.status) {
            this.peerState = 2;
            this.request_id = response.request_id;
            this.doNotification(1, 'Phone Verification', 'Phone verification code has been sent');
          } else {
            this.doNotification(2, 'Phone Verification', response.message);
          }
        },
        (error) => {
          this.doNotification(
            2,
            'Phone Verification Error ',
            'Check Internet connection and retry',
          );
        },
      );
    },
    verify_code() {
      const values = {};
      values.code = this.code;
      values.request_id = this.request_id;
      const fullPayload = {
        values,
        vm: this,
        app: 'PRIVATE_API',
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
            'Check Internet connection and retry',
          );
        },
      );
    },
    create_account() {
      const values = {};
      values.name = this.name;
      values.phone = this.phone;
      values.email = this.email;
      values.password = this.password;
      values.type = 'peer';
      values.platform = 'web';
      values.country_code = this.countryCode;
      values.default_currency = this.currency;
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

              // track new Account
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
    directSignInViaAuth() {
      this.deleteSession();
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
    doNotification(level, title, message) {
      const notification = {
        title,
        level,
        message,
      };
      this.$store.commit('setNotification', notification);
      this.$store.commit('setNotificationStatus', true);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../src/assets/styles/sign_up.css";

div.sign-up-card.cards--align > div > div:nth-child(3) > div:nth-child(3) > div > div > ul{
  margin-top: 12%;
  margin-left: -25%;
  width: 664%;
}
</style>
