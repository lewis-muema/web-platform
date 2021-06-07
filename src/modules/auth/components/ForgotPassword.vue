<template lang="html">
  <div
    id="forgot_pass"
    class="log-item hiddenyy"
  >
    <div class="sign-inner">
      <div class="sign-top">
        {{ $t('forgotPassword.forgot_password') }}
      </div>
      <div
        v-if="option"
        class="reset-link-details"
      >
        {{ $t('forgotPassword.pending_password') }}
        <a
          class="reset-pass-link"
          @click="resend_link"
        >
          {{ $t('forgotPassword.resend') }}
        </a>
      </div>

      <p class="reset-link-details">
        {{ message }}
      </p>

      <div>
        <div class="sign-holder">
          <span id="pass_change_info" />
        </div>

        <div
          class=""
        >
          <span class="forgot-paswword-moreinfo">
            {{ $t('forgotPassword.two_accounts') }}
          </span>

          <div style="margin-top: 3%;">
            <el-radio
              v-model="radio"
              label="1"
            >
              {{ $t('forgotPassword.business') }}
            </el-radio>
            <el-radio
              v-model="radio"
              label="2"
            >
              {{ $t('forgotPassword.peer') }}
            </el-radio>
          </div>
        </div>

        <div
          v-if="radio !==''"
          class="sign-holder dimen"
        >
          <input
            v-model="email"
            v-validate="'required|email'"
            class="input-control forgot-form"
            type="text"
            data-vv-validate-on="blur"
            name="email"
            :placeholder="$t('forgotPassword.enter_email')"
          >
          <br>
          <span class="forget-pass-error">
            {{ errors.first('email') }}
          </span>
        </div>

        <div class="sign-holder">
          <input
            class="button-primary forgot-btn-color"
            type="submit"
            :value="$t('forgotPassword.reset_password')"
            :disabled="!is_valid"
            @click="request_pass"
          >
        </div>
        <div class=" sign-holder ">
          <router-link
            class="sign-holder__link"
            to="/auth/sign_in"
          >
            {{ $t('forgotPassword.sign_in') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  mixins: [NotificationMxn],
  data() {
    return {
      email: '',
      radio: '',
      two_accnts: false,
      option: false,
      message: '',
    };
  },
  computed: {
    is_valid() {
      return this.email !== '' && this.radio !== '';
    },
  },
  methods: {
    ...mapActions({
      requestForgotPassword: '$_auth/requestForgotPassword',
    }),
    resend_link() {
      this.request_pass();
    },
    request_pass() {
      this.message = '';

      let emailValid = true;
      for (let i = 0; i < this.errors.items.length; i++) {
        if (this.errors.items[i].field === 'email') {
          emailValid = false;
          break;
        }
      }
      if (emailValid && this.radio !== '') {
        const { email } = this;

        const payload = {
          email,
          account_type: this.radio === '1' ? 'cop' : 'peer',
        };

        const fullPayload = {
          values: payload,
          vm: this,
          app: 'ADONIS_PRIVATE_API',
          endpoint: 'auth/forgot-password',
        };

        this.requestForgotPassword(fullPayload).then(
          (response) => {
            if (response.status) {
              this.message = this.$t('forgotPassword.password_change');
            } else {
              this.message = this.$t('forgotPassword.invalid_request');
            }
          },
          (error) => {
            this.message = `${this.$t('forgotPassword.reset_failed')}`;
            const level = 3;
            const notification = { title: '', level, message: error.response.data.message };
            this.displayNotification(notification);
          },
        );
      } else {
        const level = 3;
        const notification = { title: '', level, message: this.$t('forgotPassword.invalid_email') }; // notification object
        this.displayNotification(notification);
      }
    },
  },
};
</script>

<style lang="css" scoped>
.log-item{
text-align: center;
border: 0px solid #ccc;
margin: 5px;
}
.sign-inner{
max-width: 22rem;
border: 1px solid #D8DFE6;
border-radius: 4px;
margin: 2rem auto;
padding: 2rem;
font-family: 'Nunito', sans-serif;
}
.sign-top{
font-size: 1.3rem;
line-height: 1.7em;
font-weight: 500;
text-align: center;
color: #666;
}
.sign-holder{
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
.sign-holder input[type="submit"] {
 background-color: #1782C5;
 color: #fff;
 letter-spacing: 1.1px;
 font-weight: inherit;
 padding: 6px;
 height: 42px;
 border: 1px solid #1782C5;
 text-transform: uppercase;
 font-size: medium;
}
.dimen{
width: 83%;
}
.sign-holder__link{
color: #1782C5;
text-decoration:none;
}
.forgot-form{
  height:42px!important;
  width: 110%!important;
}
.forgot-paswword-moreinfo{
    font-family: 'Nunito', sans-serif;
    font-size: 14px;
}
.reset-pass-link{
  cursor: pointer;
  color: #1782C5;
  text-decoration: none;
}
.reset-link-details{
  margin: 1em;
  display: block;
  text-align: center;
  font-size: 13px;
  color: #e08445;
  font-family: 'Nunito', sans-serif;
}
.forgot-btn-color{
  border-width: 0px !important;
}
.forget-pass-error {
  font-size: 13px;
  font-family: 'Nunito', sans-serif;
  color: #e08445;
}
</style>
