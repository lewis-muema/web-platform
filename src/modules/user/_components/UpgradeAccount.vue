<template lang="html">
  <div
    id="log_in"
    class="sign-up-verification"
  >
    <div
      v-if="!upgrade_details"
      class="upgrade-account-inner"
    >
      <div class="upgrade-account-top">
        How do you want to manage your business account?
      </div>

      <div class="upgrade-account-text">
        No matter what you decide, the account is free.
      </div>

      <div class="">
        <el-radio
          v-model="radio"
          label="1"
          class="radio-options"
        >
          Create a new business account using your existing account information
          <div class="upgrade-account-text--inner">
            Use the same email address to login to both your personal and business account.
          </div>
        </el-radio>
        <el-radio
          v-model="radio"
          label="2"
          class="radio-options"
        >
          Create a new business account using new information
          <div class="upgrade-account-text--inner">
            Use a different email address to login to your business account
          </div>
        </el-radio>
      </div>

      <div
        class="upgrade-account-holder"
        style="display:flex;justify-content: space-between;"
      >
        <input
          class="button-primary btn-upgrade-acc-check "
          type="submit"
          value="Continue"
          @click="next"
        >
      </div>
    </div>
    <div
      v-else
      class="upgrade-account-inner"
    >
      <div class="tracking-back-button">
        <i
          class="el-icon-back edit-back"
          @click="go_back()"
        />
      </div>
      <div
        class="upgrade-account-top upgrade-margin"
      >
        Create a business account
      </div>

      <div class="upgrade-input">
        <div class="sign-up-verification-holder dimen-sign-up2">
          <label>Your business name</label>
          <input
            v-model="cop_name"
            class="input-control upgrade-form"
            type="text"
            name="cop_name"
            placeholder="Business name"
            autocomplete="on"
          >
        </div>

        <div v-if="radio === '2'">
          <div class="sign-up-verification-holder dimen-sign-up2">
            <label>Your business email address</label>
            <input
              v-model="cop_email"
              class="input-control upgrade-form"
              type="text"
              name="cop_email"
              placeholder="Business email"
              autocomplete="on"
            >
          </div>

          <div class="sign-up-verification-holder dimen-sign-up2">
            <label>Your business account password</label>
            <input
              v-model="cop_password"
              class="input-control upgrade-form"
              type="text"
              name="cop_password"
              placeholder="Business Password"
              autocomplete="on"
            >
          </div>
        </div>

        <div class="sign-up-verification-holder dimen-sign-up2">
          <label>Is your business VAT compliant?</label>
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
          class="sign-up-verification-holder dimen-sign-up2"
        >
          <label>Enter your business KRA pin</label>
          <input
            v-model="kra_pin"
            class="input-control upgrade-form"
            type="text"
            name="kra_pin"
            placeholder="KRA PIN"
            autocomplete="on"
          >
          <span
            v-show="!valid_kra_pin"
            class="invalid-pin"
          >
            Please enter a valid KRA PIN
          </span>
        </div>
      </div>

      <div
        class="upgrade-account-holder upgrade-submit"
      >
        <input
          class="button-primary btn-upgrade-acc-submit "
          type="submit"
          value="Submit"
          @click="submit"
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions} from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';


export default {
  mixins: [SessionMxn],
  data() {
    return {
      radio: '',
      upgrade_details: false,
      tax_compliance: '',
      cop_name: '',
      cop_email: '',
      cop_password: '',
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
    };
  },
  computed: {
    valid_kra_pin() {
      const pin = this.kra_pin;

      if (pin !== '') {
        return /^[apAP]\d{9}[a-zA-Z]$/.test(pin);
      }
      return true;
    },
  },
  methods: {
    ...mapActions({
      requestUpgradeAccount: '$_user/requestUpgradeAccount',
    }),
    next() {
      if (this.radio !== '') {
        this.upgrade_details = true;
      } else {
        this.doNotification(2, 'Upgrade Account  Error !', 'Kindly select upgrade option to proceed');
      }
    },
    submit() {
      if (this.radio === '1' && (this.cop_name === '' || this.tax_compliance === '')) {
        this.doNotification(2, 'Upgrade Account  Error !', 'Please provide all values');
      } else if (this.radio === '2' && (this.cop_name === '' || this.cop_email === '' || this.cop_password === '' || this.tax_compliance === '')) {
        this.doNotification(2, 'Upgrade Account  Error !', 'Please provide all values');
      } else if (this.tax_compliance && this.kra_pin === '') {
        this.doNotification(2, 'Upgrade Account  Error !', 'Please enter KRA PIN');
      } else if (this.tax_compliance && !this.valid_kra_pin) {
        this.doNotification(2, 'Upgrade Account  Error !', 'Please enter valid KRA PIN');
      } else {
        const session = this.$store.getters.getSession;
        const values = {};
        values.cop_name = this.cop_name;
        values.name = session.peer.user_name;
        values.phone = session.peer.user_phone;
        values.type = 'biz';
        values.default_currency = session.peer.default_currency;
        values.country_code = session.peer.country_code;
        values.user_id = session.peer.user_id;
        values.account_switch = true;
        values.vat_compliant = this.tax_compliance;
        values.tax_authority_pin = this.kra_pin;

        if (this.radio === '2') {
          values.password = this.cop_password;
          values.email = this.cop_email;
        } else {
          values.email = session.peer.user_email;
        }

        const fullPayload = {
          values,
          vm: this,
          app: 'NODE_PRIVATE_API',
          endpoint: 'sign_up_submit',
        };

        this.requestUpgradeAccount(fullPayload).then(
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
              if (analyticsEnv === 'production') {
                mixpanel.track('Upgrade to Business', {
                  'Account Type': 'Business',
                  'Client Type': 'Web Platform',
                  'Business Name': this.cop_name,
                  'User Email': this.radio === '2' ? this.cop_email : session.peer.user_email,
                  'User Phone': session.peer.user_phone,
                  'User ID': session.peer.user_id,
                  'VAT Compliant': this.tax_compliance,
                });
              }
              this.doNotification(1, 'Account Upgraded Successfully !', 'You will be redirected to the login page within 5 seconds.');
              const baseUrl = window.location.origin;
              const loginUrl = `${baseUrl}/sign_in`;

              setTimeout(() => {
                if (process.browser) {
                  localStorage.removeItem('_sessionSnack');
                  localStorage.removeItem('jwtToken');
                  window.location.href = loginUrl;
                }
              }, 5000);
            } else {
              this.doNotification(2, 'Upgrade Account Error ', response.message);
            }
          },
          (error) => {
            this.doNotification(2, 'Upgrade Account Error', error.message);
          },
        );
      }
    },
    go_back() {
      this.upgrade_details = false;
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
.upgrade-account {
  border: 0px solid #ccc;
  margin: 5px;
}
.upgrade-account-inner {
  max-width: 33rem;
  border-radius: 4px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: "Rubik", sans-serif;
  margin-top: 5%;
}
.upgrade-account-top {
  line-height: 2.7em;
  font-weight: 400;
  width: 591px;
  height: 30px;
  top: 162px;
  font-style: normal;
  font-weight: 400;
  font-size: 22px;
  line-height: 30px;
  color: #000000;
}

.upgrade-account-text {
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 15px;
  margin-bottom: 10px;
  color: #000000;
  font-weight: 300;
}
.upgrade-account-holder {
  margin: 1em;
  display: block;
}

.upgrade-account-holder .upgrade-account-holder__input {
  -webkit-box-shadow: none;
  -moz-box-shadow: none;
  box-shadow: none;
  height: 30px;
}

.dimen-sign-up2 {
  width: 60%;
}

.btn-upgrade-acc-check {
  width: 28%;
  border-width: 0px !important;
}
.btn-upgrade-acc-submit {
  border-width: 0px !important;
  width: 62%;
}
.radio-options{
  width: 100%;
  margin-left: 0px !important;
  font-size: 40px;
  color: #000000;
  font-style: normal;
  margin-bottom: 5%;
}
.upgrade-account-text--inner{
 padding-left: 5%;
 width: 100%;
 font-style: normal;
 font-weight: normal;
 font-size: 14px;
 line-height: 20px;
 color: #000000 !important;
 white-space: initial;
 font-weight: 300;
}
.el-checkbox__label, .el-radio__label {
    font-size: 16px !important;
}
.el-radio__inner{
  border: 1px solid #000000 !important;
}
.upgrade-input{
  margin-top: 2%;
  padding-left: 6%;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 23px;
  color: #000000;
}
.upgrade-form{
  margin-top: 2%;
  margin-bottom: 5%;
}
.edit-back {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    transition: .3s;
    line-height: 50px !important;
    cursor: pointer;
    border: 1px solid #555;
    text-align: center;
    font-size: 23px;
}
.tracking-back-button{
  top: 25%;
  position: absolute;
  left: 20%;
  display: flex;
}
.compliance-select{
  width:100% !important ;
  margin-top: 2%;
  margin-bottom: 5%;
}
.invalid-pin {
  display: block;
  color: #f57f20;
  font-size: 14px;
}
.upgrade-margin{
  margin-left: 6%;
}
.upgrade-submit{
  display:flex;
  justify-content: space-between;
  padding-left: 3%;
}
</style>
