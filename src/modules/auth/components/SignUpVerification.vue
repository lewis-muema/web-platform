<template lang="html">
  <div
    id="log_in"
    class="sign-up-verification"
  >
    <div class="sign-up-verification-inner">
      <div class="sign-up-verification-top">
        {{$t('signUpVerification.work_for_business') }}
      </div>

      <div class="sign-up-verification-text">
        {{$t('signUpVerification.offer_best_experience')}} <br>
        {{$t('signUpVerification.dedicated_account')}}
      </div>

      <p class="sign-up-error">
        {{ message }}
      </p>

      <div>
        <div class="sign-up-verification-holder dimen-sign-up2">
          <span
            id="log_in_warn"
            class="sign-up-verification-holder__error"
          />
        </div>
        <div class="sign-up-verification-holder dimen-sign-up2">
          <input
            v-model="cop_name"
            class="input-control sign-form"
            type="text"
            name="cop_name"
            :placeholder="$t('signUpVerification.business_name')"
            autocomplete="on"
          >
        </div>

        <div
          class="sign-up-verification-holder"
          style="display:flex;justify-content: space-between;"
        >
          <input
            class="button-primary btn-sign-up-check style-sign-btn"
            type="submit"
            :value="$t('signUpVerification.no')"
            @click="peer_set"
          >

          <input
            class="button-primary btn-sign-up-check"
            type="submit"
            :value="$t('signUpVerification.done')"
            @click="cop_set"
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';

const currencyConversion = require('country-tz-currency');

export default {
  mixins: [SessionMxn, NotificationMxn],
  data() {
    return {
      cop_name: '',
      phone: '',
      message: '',
      currency: '',
    };
  },
  mounted() {
    this.checkUserLocation();
  },
  methods: {
    ...mapActions({
      requestSignUpSegmentation: '$_auth/requestSignUpSegmentation',
      authSignIn: '$_auth/requestSignIn',
    }),
    ...mapGetters({
      Password: '$_auth/requestPassword',
      Email: '$_auth/requestEmail',
      Phone: '$_auth/requestPhone',
      Name: '$_auth/requestName',
      getUserCountryCode: '$_auth/getUserCountryCode',
    }),
    peer_set() {
      this.checkUserLocation();
      const values = {};
      values.name = this.Name();
      values.phone = this.Phone();
      values.email = this.Email();
      values.password = this.Password();
      values.type = 'peer';
      values.platform = 'web';
      values.country_code = this.getUserCountryCode();
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

              // track new Account
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
            this.doNotification(2, this.$t('signUpVerification.signup_error'), response.message);
          }
        },
        (error) => {
          this.doNotification(2, this.$t('signUpVerification.signup_error'), this.$t('signUpVerification.check_internet'));
        },
      );
    },
    cop_set() {
      this.checkUserLocation();
      if (this.cop_name !== '') {
        const values = {};
        values.cop_name = this.cop_name;
        values.name = this.Name();
        values.phone = this.Phone();
        values.email = this.Email();
        values.password = this.Password();
        values.type = 'biz';
        values.country_code = this.getUserCountryCode();
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
              this.doNotification(2, this.$t('signUpVerification.signup_error'), response.message);
            }
          },
          (error) => {
            this.doNotification(2, this.$t('signUpVerification.signup_error'), this.$t('signUpVerification.check_internet'));
          },
        );
      } else {
        this.message = this.$t('signUpVerification.provide_biz_name');
      }
    },
    checkUserLocation() {
      const countryCodeData = currencyConversion.getCountryByCode(this.getUserCountryCode());
      this.currency = countryCodeData.currencyCode;
    },
    directSignInViaAuth() {
      this.deleteSession();
      const params = {
        email: this.Email(),
        password: this.Password(),
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
              this.login_text = this.$t('signUpVerification.login');
              this.doNotification(2, this.$t('signUpVerification.login_failed'), this.$t('signUpVerification.wrong_password'));
            } else {
              this.login_text = this.$t('signUpVerification.login');
              this.doNotification(2, this.$t('signUpVerification.login_failed'), this.$t('signUpVerification.account_deactivated'));
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
          this.doNotification(2, this.$t('signUpVerification.login_failed'), this.$t('signUpVerification.login_failed_text'));
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
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css">
.sign-up-verification {
  text-align: center;
  border: 0px solid #ccc;
  margin: 5px;
}
.sign-up-verification-inner {
  max-width: 27rem;
  border: 1px solid #d8dfe6;
  border-radius: 4px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  margin-top: 7%;
}
.sign-up-verification-top {
  font-size: 1.3rem;
  line-height: 2.7em;
  font-weight: 400;
  text-align: center;
  color: #666;
}

.sign-up-verification-text {
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: medium;
  margin-bottom: 10px;
  text-align: center;
  color: #666;
}
.sign-up-verification-holder {
  margin: 1em;
  display: block;
}

.sign-up-verification-holder .sign-up-verification-holder__input {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  height: 30px;
}

.dimen-sign-up2 {
  width: 83%;
}

.btn-sign-up-check {
  width: 28%;
  border-width: 0px !important;
}
.style-sign-btn {
  color: black !important;
  background-color: #ffffff !important;
  border: 1px solid #ffffff !important;
}
</style>
