<template lang="html">
  <div
    id="log_in"
    class="log-item"
  >
    <div class="sign-inner">
      <div class="sign-top">
        Log in to Sendy
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
            name="email"
            placeholder="Enter Email"
            autocomplete="on"
          >
        </div>

        <div class="sign-holder dimen">
          <input
            v-model="password"
            class="input-control sign-form"
            type="password"
            name="password"
            placeholder="Password"
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
            Forgot password?
          </router-link>
        </div>
        <div class="sign-holder sign-sign-up sign-smaller">
          Don't have an Account?
          <router-link
            class="sign-holder__link"
            to="/auth/sign_up"
          >
            Sign Up
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';

export default {
  name: 'SignIn',
  mixins: [SessionMxn],

  data() {
    return {
      email: '',
      password: '',
      message: '',
      login_text: 'Login',
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
        title: 'View Page - Sign In - Web Platform',
      });
    },
    clearSession() {
      this.$store.commit('deleteSession');
      localStorage.removeItem('_sessionSnack');
      localStorage.removeItem('jwtToken');
    },
    sign_in() {
      if (this.email !== '' && this.password !== '') {
        this.login_text = 'Logging in ...';
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
                this.login_text = 'Login';
                this.doNotification(2, 'Login failed', 'Wrong password or email.');
              } else {
                this.login_text = 'Login';
                this.doNotification(2, 'Login failed', 'Account deactivated');
              }
            } else {
              try {
                if (response) {
                  let partsOfToken = '';
                  if (Array.isArray(response)) {
                    const res = response[1];
                    localStorage.setItem('jwtToken', res);
                    partsOfToken = res.toString().split('.');
                  } else {
                    localStorage.setItem('jwtToken', response);
                    partsOfToken = response.split('.');
                  }
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
                this.login_text = 'Login';
              }
            }
          },
          (error) => {
            this.doNotification(2, 'Login failed', 'Login failed. Please try again');
          },
        );
      } else {
        this.message = 'Provide all values';
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
  },
};
</script>

<style lang="css">
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
    font-family: "Helvetica Nueu", "Helvetica", "Arial", "sans-serif";
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

.sign-holder input:not([type="checkbox"]) {
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
    color: #1782c5;
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
    font-family: "Rubik", sans-serif;
}

.sign-btn-color {
    border-width: 0px !important;
}
</style>
