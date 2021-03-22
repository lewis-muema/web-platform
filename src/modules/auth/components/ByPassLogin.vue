<template lang="html">
  <div
    id="log_in"
    class="log-item"
  >
    <div class="sign-inner">
      <div
        v-if="!loading"
        class="sign-top"
      >
        Super User Login
      </div>

      <p class="sign-in-error">
        {{ message }}
      </p>

      <div
        v-if="!by_pass_verify"
        @keyup.enter="sign_in"
      >
        <div class="sign-holder dimen">
          <span
            id="log_in_warn"
            class="sign-holder__error"
          />
        </div>
        <div class="sign-holder dimen">
          <input
            v-model="email"
            class="input-control sign-form"
            type="text"
            name="email"
            placeholder="Enter Super User Email"
            autocomplete="on"
          >
        </div>

        <div class="sign-holder dimen">
          <input
            v-model="password"
            class="input-control sign-form"
            type="password"
            name="password"
            placeholder="Enter Super User Password"
          >
        </div>
        <div class="sign-holder dimen">
          <el-select
            v-model="account_type"
            class="sign-form"
            placeholder="Select Account Type"
            @change="dispatchAccountType"
          >
            <el-option
              v-for="acc in account_options"
              :key="acc.value"
              :label="acc.label"
              :value="acc.value"
            />
          </el-select>
        </div>
        <div
          v-if="account_selected"
          class="sign-holder dimen"
        >
          <input
            v-model="client_email"
            class="input-control sign-form"
            type="text"
            name="email"
            placeholder="Enter Client Email"
            autocomplete="on"
          >
        </div>

        <div class="sign-holder">
          <input
            v-model="login_text"
            class="button-primary sign-btn-color"
            type="submit"
            name="login_text"
            @click="by_pass_sign_in"
          >
        </div>
      </div>
      <div v-else>
        <div v-if="loading === false">
          <div class="signup-validation-description">
            For your security, Sendy wants to make sure it's really you. We will send a message with
            your verification code.
          </div>
          <div class="sign-holder dimen">
            <input
              v-model="code"
              class="input-control sign-form"
              type="text"
              placeholder="Enter Verification Code"
            >
          </div>
          <div class="bypass-verify-button">
            <button
              type="button"
              class="bypass-cancel"
              @click="byPassVerificationCancel"
            >
              Cancel
            </button>
            <button
              type="button"
              class="bypass-verify"
              @click="byPassVerificationVerify"
            >
              Verify
            </button>
          </div>
        </div>
        <div v-else-if="loading === true">
          <LoadingComponent />
        </div>
        <div v-else>
          <SuccessComponent />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import LoadingComponent from './LoadingComponent.vue';
import SuccessComponent from './SuccessComponent.vue';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  name: 'ByPassLogin',
  components: {
    LoadingComponent,
    SuccessComponent,
  },
  mixins: [SessionMxn, NotificationMxn],

  data() {
    return {
      email: '',
      password: '',
      account_type: '',
      client_email: '',
      message: '',
      code: '',
      login_text: 'Log In',
      account_options: [
        {
          value: 'peer',
          label: 'Peer',
        },
        {
          value: 'biz',
          label: 'Business',
        },
      ],
      account_selected: false,
      by_pass_verify: false,
      loading: false,
      request_id: '',
      sessionDataObject: {},
    };
  },
  mounted() {
    this.loading = false;
    this.clearSession();
    this.trackMixpanelEvent('By Pass Login Page');
  },
  methods: {
    ...mapActions({
      authByPassSignIn: '$_auth/requestByPassSignIn',
      requestByPassPhoneVerification: '$_auth/requestSignUpPhoneVerification',
      requestByPassVerificationVerify: '$_auth/requestSignUpVerificationVerify',
    }),
    dispatchAccountType() {
      this.account_selected = true;
    },
    clearSession() {
      this.$store.commit('deleteSession');
      localStorage.removeItem('_sessionSnack');
      localStorage.removeItem('jwtToken');
    },
    by_pass_sign_in() {
      if (
        this.email !== ''
        && this.password !== ''
        && this.account_type !== ''
        && this.client_email !== ''
      ) {
        this.login_text = 'Logging In ...';
        // erase any existing session
        this.deleteSession();
        const params = {
          email: this.email,
          password: this.password,
          account_type: this.account_type,
          client_email: this.client_email,
        };
        const fullPayload = {
          values: params,
          app: 'NODE_PRIVATE_API',
          endpoint: 'admin_bypass',
        };

        this.authByPassSignIn(fullPayload).then(
          (response) => {
            if (Object.prototype.hasOwnProperty.call(response, 'status')) {
              if (!response.status) {
                this.login_text = 'Log In';
                this.doNotification(2, 'Login failed', response.message);
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

                  const sessionData = payload;

                  this.sessionDataObject = sessionData;
                  this.validateSuperUser(sessionData.admin_details);
                } else {
                }
              } catch (error) {
                // @todo Log the error (central logging)
                this.login_text = 'Log In';
              }
            }
          },
          (error) => {
            this.login_text = 'Log In';
          },
        );
      } else {
        this.doNotification(2, 'Login failed', 'Provide all values');
      }
    },
    validateSuperUser(superUser) {
      this.by_pass_verify = true;
      this.sendVerificationCode(superUser);
    },
    sendVerificationCode(superUser) {
      let { phone } = superUser;

      if (phone !== '' || phone !== null) {
        if (phone.substr(0, 2) === '07') {
          phone = phone.replace(phone.substr(0, 2), '+2547');
        }
        if (phone.substr(0, 1) === '7') {
          phone = phone.replace(phone.substr(0, 1), '+2547');
        }
        if (phone.substr(0, 3) === '254' || phone.substr(0, 3) === '256') {
          phone = `+${phone}`;
        }

        const values = {};
        values.number = phone.replace(/[()\-\s]+/g, '');
        const fullPayload = {
          values,
          vm: this,
          app: 'NODE_PRIVATE_API',
          endpoint: 'request_verification',
        };
        this.requestByPassPhoneVerification(fullPayload).then(
          (response) => {
            if (response.status) {
              this.request_id = response.request_id;
            } else {
              this.doNotification(2, 'Phone Verification', response.message);
            }
          },
          () => {
            this.doNotification(
              2,
              'Phone Verification Error ',
              'Check Internet connection and retry',
            );
          },
        );
      } else {
        this.doNotification(
          2,
          'Missing Phone Number',
          'Kindly add phone number on the Staff Portal / Contact HR ',
        );
      }
    },
    byPassVerificationCancel() {
      this.by_pass_verify = false;
      this.doNotification(
        2,
        'Phone Verification',
        'Phone Verification Failed . Retry to again after 15 minutes',
      );
    },
    byPassVerificationVerify() {
      const values = {};
      values.code = this.code;
      values.request_id = this.request_id;
      const fullPayload = {
        values,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'check_verification',
      };
      this.requestByPassVerificationVerify(fullPayload).then(
        (response) => {
          if (response.status) {
            this.doNotification(1, 'Phone Verification', 'Phone verification successful !');
            this.loading = true;
            setTimeout(() => {
              this.directToOrdersPage();
            }, 3000);
          } else {
            this.doNotification(2, 'Phone Verification', response.message);
          }
        },
        () => {
          this.doNotification(
            2,
            'Phone Verification Error ',
            'Check Internet connection and retry',
          );
        },
      );
    },
    directToOrdersPage() {
      // set session
      // commit everything to the store
      // redirect to orders
      const sessionData = this.sessionDataObject;
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

      if ('admin_details' in sessionData && analyticsEnv === 'production') {
        const superUser = sessionData.admin_details;
        const acc = sessionData[sessionData.default];

        mixpanel.people.set_once({
          $email: superUser.email,
          $phone: superUser.phone,
          'Account Type': 'Super User',
          $name: superUser.name,
          'Client Type': 'Web Platform',
          'Client Account': acc.user_email,
          'Client Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
        });

        // login identify
        mixpanel.identify(superUser.email);

        // track login
        mixpanel.track('Super User Login', {
          'Account Type': 'Super User',
          'Last Login': new Date(),
          'Client Type': 'Web Platform',
          'Super User Id': superUser.admin_id,
          'Client Account': acc.user_email,
          'Client Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
        });
      }
      this.loading = 'success';
      setTimeout(() => {
        this.$router.push('/orders');
      }, 5000);
    },
    doNotification(level, title, message) {
      const notification = {
        title,
        level,
        message,
      };
      this.displayNotification(notification);
    },
    trackMixpanelEvent(name) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }

      try {
        if (analyticsEnv === 'production') {
          mixpanel.track(name);
        }
      } catch (er) {
        // ...
      }
    },
  },
};
</script>

<style lang="css">
@import "../../../../src/assets/styles/by_pass.css";
</style>
