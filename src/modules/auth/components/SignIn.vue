<template lang="html">
  <div
    id="log_in"
    class="log-item"
  >
    <div class="sign-inner">
      <div class="sign-top">
        {{$t('signIn.login_sendy') }}
      </div>

      <p class="sign-in-error">
        {{ message }}
      </p>

      <div @keyup.enter="sign_in">
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
            :placeholder="$t('signIn.enter_email')"
          >
        </div>

        <div class="sign-holder dimen">
          <input
            v-model="password"
            class="input-control sign-form"
            type="password"
            name="password"
            :placeholder="$t('signIn.password')"
          >
        </div>

        <div class="sign-holder">
          <input
            v-model="login_text"
            class="button-primary sign-btn-color"
            type="submit"
            name="login_text"
            @click="sign_in"
          >
        </div>
        <div class=" sign-holder sign-forgot-pass sign-smaller">
          <router-link
            class="sign-holder__link"
            to="/auth/forgot_password"
          >
            {{ $t('signIn.forgot_password') }}
          </router-link>
        </div>
        <div class="sign-holder sign-sign-up sign-smaller">
          {{$t('signIn.have_account')}}
          <router-link
            class="sign-holder__link"
            to="/auth/sign_up"
          >
            {{$t('signIn.sign_up')}}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  name: 'SignIn',
  mixins: [SessionMxn, NotificationMxn],

  data() {
    return {
      email: '',
      password: '',
      message: '',
      login_text: this.$t('signIn.login'),
    };
  },
  mounted() {
    this.landOnSignInPage();
    this.clearSession();
  },
  methods: {
    ...mapActions({
      authSignIn: '$_auth/requestSignIn',
    }),
    landOnSignInPage() {
      window.ga('send', {
        hitType: 'pageview',
        page: location.pathname,
        title: this.$t('signIn.view'),
      });
    },
    clearSession() {
      this.$store.commit('deleteSession');
      localStorage.removeItem('_sessionSnack');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('refreshToken');
    },
    sign_in() {
      if (this.email !== '' && this.password !== '') {
        this.login_text = this.$t('signIn.login_status');
        // erase any existing session
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
                this.login_text = this.$t('signIn.login');
                this.doNotification(2, this.$t('signIn.login_failed'), this.$t('signIn.wrong_password'));
              } else {
                this.login_text =  this.$t('signIn.login');
                this.doNotification(2, this.$t('signIn.login_failed'), this.$t('signIn.account_deactivated') );
              }
            } else {
              try {
                if (response) {
                  let partsOfToken = '';
                  if (Array.isArray(response)) {
                    const res = response[1];
                    localStorage.setItem('jwtToken', res);
                    localStorage.setItem('jwtToken', res.access_token);
                    localStorage.setItem('refreshToken', res.refresh_token);
                    partsOfToken = res.access_token.toString().split('.');
                  } else {
                    localStorage.setItem('jwtToken', response);
                    localStorage.setItem('jwtToken', response.access_token);
                    localStorage.setItem('refreshToken', response.refresh_token);
                    partsOfToken = response.access_token.split('.');
                  }
                  // eslint-disable-next-line max-len
                  // TODO change from using local storage as session trust store. malicious js will read the data
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
                  if ('default' in sessionData) {
                    const acc = sessionData[sessionData.default];
                    this.$apm.setUserContext({
                      id: acc.user_id,
                      username: acc.user_name,
                      email: acc.user_email,
                    });
                    if (analyticsEnv === 'production') {
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
                  }
                  // check for redirect status before push
                  const redirectStatus = this.$store.getters.getRedirectStatus;
                  const redirectOrder = this.$store.getters.getRedirectOrder;
                  if (redirectStatus) {
                    // reset redirect status
                    this.$store.commit('setRedirectStatus', false);
                    this.$store.commit('setRedirectOrder', '');
                    this.$router.push(`/orders/tracking/${redirectOrder}`);
                  } else {
                    this.$router.push('/orders');
                  }
                }
              } catch (error) {
                // @todo Log the error (central logging)
                this.login_text = this.$t('signIn.login');
              }
            }
          },
          (error) => {
            this.login_text = this.$t('signIn.login');
            this.doNotification(2, this.$t('signIn.login_failed'), this.$t('signIn.login_failed_status'));
          },
        );
      } else {
        this.message = this.$t('signIn.provide_all');
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
  },
};
</script>

<style lang="css" scoped>
.log-item {
  text-align: center;
  border: 0px solid #ccc;
  margin: 5px;
}

.sign-inner {
  max-width: 22rem;
  border: 1px solid #d8dfe6;
  border-radius: 4px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
}

.sign-top {
  font-size: 1.3rem;
  line-height: 1.7em;
  font-weight: 500;
  text-align: center;
  color: #666;
}

.sign-in-button {
  width: 90%;
  margin: 1em;
  background-color: #30487b;
  color: #fff;
  padding-top: 10px;
  padding-bottom: 10px;
  font-size: initial;
  letter-spacing: 1.1px;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
}

.sign-text {
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: large;
  margin-bottom: 10px;
  text-align: center;
  color: #666;
}

.sign-holder {
  margin: 1em;
  display: block;
}

.sign-holder input:not([type='checkbox']) {
  width: 100%;
}

.sign-holder .sign-holder__input {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  height: 30px;
}

.sign-smaller {
  font-size: 14px;
  color: #999999;
}

.sign-forgot-pass,
.sign-in-sign-up {
  text-align: center;
}

.sign-buttom__img {
  vertical-align: middle;
  width: 14px;
  padding-bottom: 3px;
  margin-right: 10px;
}

.sign-holder__link {
  color: #007FFF;
  text-decoration: none;
}

.dimen {
  width: 83%;
}

.sign-holder__pointer {
  cursor: pointer;
}

.sign-form {
  height: 42px !important;
  width: 110% !important;
}

.sign-in-error {
  color: #e08445;
  font-family: 'Nunito', sans-serif;
}

.sign-btn-color {
  border-width: 0px !important;
}
</style>
