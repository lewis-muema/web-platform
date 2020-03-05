<template lang="html">
  <div
    class=""
  >
    <div v-if="bizState === 1">
      <div class="tracking-back-button">
        <i
          class="el-icon-back edit-back"
          @click="go_back(1)"
        />
      </div>
      <p class="sign-up--extra">
        Sign up for a Sendy business account
      </p>
      <div class="account-details--wrapper">
        <div class="sign-holder">
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
        <div class="sign-holder">
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
        <div class="sign-holder ">
          <p class="input--label">
            Business Email
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
        <div class="sign-holder ">
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
          />
        </div>
        <div class="sign-holder ">
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
          class="sign-holder sign-up-terms"
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
        class="sign-holder next-btn-holder"
      >
        <input
          value="Continue"
          class="button-primary sign-btn-color next-btn"
          type="submit"
          name="login_text"
          @click="next"
        >
      </div>
    </div>
    <div v-else-if="bizState === 2">
      <div class="tracking-back-button">
        <i
          class="el-icon-back edit-back"
          @click="go_back_state(1)"
        />
      </div>
      <p class="sign-up--extra">
        Sign up for a Sendy business account
      </p>
      <div class="account-details--wrapper">
        <div
          class="sign-holder"
        >
          <p class="input--label">
            Does your business file VAT returns? (optional)
          </p>
          <el-select
            v-model="tax_compliance"
            placeholder="Select"
            class="compliance-select"
          >
            <el-option
              v-for="item in taxOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div
          v-if="tax_compliance"
          class="sign-holder "
        >
          <p class="input--label">
            Enter your business KRA pin
          </p>
          <input
            v-model="kra_pin"
            class="input-control sign-up-form"
            type="text"
            value=""
            name="kra_pin"
            placeholder="KRA PIN"
          >
          <span
            v-show="!valid_kra_pin"
            class="sign-up-data-error"
          >
            Please enter a valid KRA PIN
          </span>
        </div>
        <div
          class="sign-holder  primary-vehicle-details"
        >
          <label> Select the primary type of vehicle you will use on Sendy</label>
          <p class="info">
            (This will not restrict you from using other vehicles)
          </p>

          <div class="vendors-outerline">
            <div
              class="vendor-cards"
              :class="{ vendor_active: activeTab === 'mbu' }"
              @click="selectCard('mbu',1)"
            >
              <img
                class="vendor-types"
                :src="getVendorIcon(1)"
                alt=""
              >
            </div>
            <div
              class="vendor-cards"
              :class="{ vendor_active: activeTab === 'ebu' }"
              @click="selectCard('ebu',2)"
            >
              <img
                class="vendor-types"
                :src="getVendorIcon(6)"
                alt=""
              >
            </div>
            <div
              class="vendor-cards"
              :class="{ vendor_active: activeTab === 'fbu' }"
              @click="selectCard('fbu',3)"
            >
              <img
                class="vendor-types"
                :src="getVendorIcon(25)"
                alt=""
              >
            </div>
          </div>
        </div>
        <div
          class="sign-holder verify-acc-holder"
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
    </div>
    <div v-else>
      <div class="tracking-back-button">
        <i
          class="el-icon-back edit-back"
          @click="go_back_state(2)"
        />
      </div>
      <p class="sign-up--extra">
        Sign up for a Sendy business account
      </p>

      <div class="account-details--wrapper">
        <div class="sign-holder ">
          <p class="verification-code-info">
            For your security, Sendy wants to make sure it's really you.
            We will send a message with
            your verification code.
          </p>
        </div>
        <div class="sign-holder ">
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
          class="sign-holder verify-code-holder"
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
  name: 'BizDetailsComponent',
  mixins: [SessionMxn],
  data() {
    return {
      name: '',
      cop_name: '',
      email: '',
      phone: '',
      password: '',
      bizState: 1,
      vehicle_code: '',
      activeTab: '',
      pass_msg: '',
      tax_compliance: '',
      u_terms: '',
      pass_validation: false,
      countryCode: 'KE',
      currency: 'KES',
      code: '',
      kra_pin: '',
      taxOptions: [
        {
          value: true,
          label: 'Yes',
        },
        {
          value: false,
          label: 'No',
        },
      ],
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
    valid_kra_pin() {
      const pin = this.kra_pin;

      if (pin !== '') {
        return /^[apAP]\d{9}[a-zA-Z]$/.test(pin);
      }
      return true;
    },
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
      this.setActiveTab('Biz');
      this.name = '';
      this.cop_name = '';
      this.email = '';
      this.phone = '';
      this.password = '';
      this.u_terms = '';
    },
    next() {
      if (this.name !== '' && this.cop_name && this.email !== '' && this.phone !== '' && this.password !== '') {
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
                  this.bizState = 2;
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
    verify_acc() {
      if (this.tax_compliance && !this.valid_kra_pin) {
        this.doNotification(2, 'Sign Up Error !', 'Please enter valid KRA PIN');
      } else if (this.vehicle_code === '') {
        this.doNotification(2, 'Sign Up Error !', 'Please select primary type of vehicle');
      } else {
        this.sendVerificationCode();
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
            this.bizState = 3;
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
      if (this.tax_compliance === '') {
        this.tax_compliance = false;
      }
      values.cop_name = this.cop_name;
      values.name = this.name;
      values.phone = this.phone;
      values.email = this.email;
      values.password = this.password;
      values.type = 'biz';
      values.country_code = this.countryCode;
      values.default_currency = this.currency;
      values.vat_compliant = this.tax_compliance;
      values.tax_authority_pin = this.kra_pin;
      values.primary_business_unit = this.vehicle_code;
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
      this.bizState = code;
      if (code === 1) {
        this.vehicle_code = '';
        this.tax_compliance = '';
        this.kra_pin = '';
      } else {
        this.code = '';
        this.request_id = '';
      }
    },
    selectCard(tab, code) {
      this.activeTab = tab;
      this.vehicle_code = code;
    },
    getVendorIcon(id) {
      return `https://images.sendyit.com/web_platform/vendor_type/side/v2/${id}.svg`;
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
      this.$store.commit('setNotification', notification);
      this.$store.commit('setNotificationStatus', true);
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
  },
};
</script>

<style lang="css">
@import "../../../../src/assets/styles/sign_up.css";
.cards--align > div > div > div:nth-child(3) > div:nth-child(1) > div > div{
  width: 182%;
}
body > div.el-select-dropdown.el-popper{
  width: 25%;
}
</style>
