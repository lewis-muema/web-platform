<template lang="html">
  <div
    id="log_in"
    class="upgrade-verification"
  >
    <div
      v-if="loadContent()"
    >
      <div
        v-if="upgrade_details === false"
        class="upgrade-account-inner"
      >
        <div class="upgrade-account-top">
          {{$t('general.manage_business_account')}}
        </div>

        <div class="upgrade-account-text">
         {{$t('general.account_is_free')}}
        </div>

        <div class="">
          <el-radio
            v-model="radio"
            label="1"
            class="radio-options"
          >
            {{$t('general.use_current_login_details')}}
            <div class="upgrade-account-text--inner">
              <!-- Use your email {{ userData() }} and password to login -->
              {{$t('general.use_email_password_login', { userData : userData() })}}
            </div>
          </el-radio>
          <el-radio
            v-model="radio"
            label="2"
            class="radio-options"
          >
            {{$t('general.use_different_login_details')}}
            <div class="upgrade-account-text--inner">
             {{$t('general.use_different_email_password_login')}}
            </div>
          </el-radio>
        </div>

        <div
          v-if="deactivateOption"
          class=""
        >
          <input
            v-model="deactivate_acc"
            type="checkbox"
            class="hiddeny"
          >
          <span class="upgrade-account-text--inner deactivate-details">
             {{$t('general.deativate_personal_account')}}
          </span>
        </div>

        <div
          class="upgrade-account-holder upgrade-submit-wrapper"
        >
          <input
            class="button-primary btn-upgrade-acc-check "
            type="submit"
            :value="$t('general.continue')"
            @click="next"
          >
        </div>
      </div>
      <div
        v-else-if="upgrade_details === true"
        class="upgrade-account-inner"
      >
        <div class="tracking-back-button">
          <i
            class="el-icon-back edit-back"
            @click="go_back(1)"
          />
        </div>
        <div
          class="upgrade-account-top upgrade-margin"
        >
          {{$t('general.create_business_account')}}
        </div>

        <div class="upgrade-input">
          <div class="sign-up-verification-holder dimen-sign-up2">
            <label>{{$t('general.your_business_name')}}</label>
            <input
              v-model="cop_name"
              class="input-control upgrade-form"
              type="text"
              name="cop_name"
              :placeholder="$t('general.business_name')"
              autocomplete="on"
            >
          </div>

          <div v-if="radio === '2'">
            <div class="sign-up-verification-holder dimen-sign-up2">
              <label>{{$t('general.your_business_email_address')}}</label>
              <input
                v-model="cop_email"
                class="input-control upgrade-form"
                type="text"
                name="cop_email"
                :placeholder="$t('general.business_email')"
                autocomplete="on"
              >
            </div>

            <div class="sign-up-verification-holder dimen-sign-up2">
              <label>{{$t('general.biz_account_password')}}</label>
              <input
                v-model="cop_password"
                class="input-control upgrade-form"
                type="text"
                name="cop_password"
                :placeholder="$t('general.business_password')"
                autocomplete="on"
              >
            </div>
          </div>

          <div class="sign-up-verification-holder dimen-sign-up2">
            <label>{{$t('general.biz_vat_compliant')}}</label>
            <el-select
              v-model="tax_compliance"
              :placeholder="$t('general.select')"
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
            <label>{{$t('general.enter_biz_kra_pin')}}</label>
            <input
              v-model="kra_pin"
              class="input-control upgrade-form"
              type="text"
              name="kra_pin"
              :placeholder="$t('general.kra_pin')"
              autocomplete="on"
            >
            <span
              v-show="!valid_kra_pin"
              class="invalid-pin"
            >
              {{$t('general.enter_valid_kra')}}
            </span>
          </div>
          <div class="primary-vehicle-outline">
            <label> {{$t('general.select_primary_type_vehicle_use')}}</label>
            <p class="extra-info">
              {{$t('general.not_restrict_you')}}
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
            class="upgrade-account-holder upgrade-submit"
          >
            <input
              class="button-primary btn-upgrade-acc-submit "
              type="submit"
              :value="$t('general.continue')"
              @click="verify"
            >
          </div>
        </div>
      </div>
      <div
        v-else
        class="upgrade-account-inner highlight-frame"
      >
        <div class="tracking-back-button">
          <i
            class="el-icon-back edit-back"
            @click="go_back(2)"
          />
        </div>
        <div
          class="upgrade-account-top upgrade-margin upgrade-details-header"
        >
          {{$t('general.confirm_biz_account')}}
        </div>

        <div class="upgrade-input">
          <div class="sign-up-verification-holder dimen-summary">
            <label class="summary-ouline">{{$t('general.email_address')}}</label>
            <p class="user_details">
              {{ businessEmail() }}
            </p>
          </div>
          <div class="sign-up-verification-holder dimen-summary">
            <label class="summary-ouline">{{$t('general.business_name')}}</label>
            <p class="user_details">
              {{ cop_name }}
            </p>
          </div>
          <div class="sign-up-verification-holder dimen-summary">
            <label class="summary-ouline">{{$t('general.does_biz_file_vat')}}</label>
            <p class="user_details">
              {{ businessTaxCompliance() }}
            </p>
          </div>
          <div
            v-if="tax_compliance"
            class="sign-up-verification-holder dimen-summary"
          >
            <label class="summary-ouline">{{$t('general.biz_kra_pin')}}</label>
            <p class="user_details">
              {{ kra_pin }}
            </p>
          </div>
          <div class="sign-up-verification-holder dimen-summary">
            <label class="summary-ouline">{{$t('general.primary_vehicle')}}</label>
            <div
              class="primary-vehicle-wrapper"
            >
              <div class="vehicle-selected-wrapper">
                <img
                  class="vendor-types primary-vehicle-selected"
                  :src="getVendorIcon(code)"
                  alt=""
                >
                <span class="user_details primary-vehicle-name">{{ vendorName() }}</span>
              </div>
            </div>
          </div>
          <input
            class="button-primary btn-upgrade-acc-submit final-upgrade-submit"
            type="submit"
            :value="$t('general.submit')"
            @click="submit"
          >
        </div>
      </div>
    </div>
    <div v-else />
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';


export default {
  mixins: [SessionMxn, NotificationMxn],
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
      vendors: '',
      deactivate_acc: false,
      activeTab: '',
      code: '',
      primary_business_unit: '',
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
    deactivateOption() {
      let isValid = false;

      if (this.radio !== '' && this.running_balance >= 0) {
        isValid = true;
      }
      return isValid;
    },
    running_balance() {
      const value = this.$store.getters.getRunningBalance;
      if (value !== null && value !== '' && typeof value !== 'undefined') {
        let val = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        val = val.split('.');
        return val[0];
      }
      return value;
    },
  },
  mounted() {
    this.verifyAccount();
  },
  methods: {
    ...mapActions({
      requestUpgradeAccount: '$_user/requestUpgradeAccount',
    }),
    next() {
      if (this.radio !== '') {
        this.upgrade_details = true;
      } else {
        this.doNotification(2, this.$t('general.upgrade_account'), this.$t('general.kindly_select_upgrade_proceed'));
      }
    },
    selectCard(tab, code) {
      this.activeTab = tab;
      this.vendors = tab;
      this.code = code;
      this.primary_business_unit = code;
    },
    businessEmail() {
      const session = this.$store.getters.getSession;
      let email = session.peer.user_email;

      if (this.radio === '2') {
        email = this.cop_email;
      }
      return email;
    },
    businessTaxCompliance() {
      let text = 'No';
      if (this.tax_compliance) {
        text = 'Yes';
      }
      return text;
    },
    vendorName() {
      let name = '';
      if (this.code === 1) {
        name = this.$t('general.bikes');
      } else if (this.code === 2) {
        name = this.$t('general.trucks_and_vans');
      } else {
        name = this.$t('general.freight');
      }
      return name;
    },
    userData() {
      const session = this.$store.getters.getSession;
      return `(${session.peer.user_email})`;
    },
    verifyAccount() {
      const session = this.$store.getters.getSession;
      if (session.peer.user_email === undefined) {
        this.$router.push('/orders');
      }
    },
    loadContent() {
      let load = false;
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        load = true;
      }
      return load;
    },
    verify() {
      if (this.radio === '1' && (this.cop_name === '' || this.tax_compliance === '')) {
        this.doNotification(2, this.$t('general.upgrade_account'), this.$t('general.please_provide_all_values'));
      } else if (this.radio === '2' && (this.cop_name === '' || this.cop_email === '' || this.cop_password === '' || this.tax_compliance === '')) {
        this.doNotification(2, this.$t('general.upgrade_account'), this.$t('general.please_provide_all_values'));
      } else if (this.tax_compliance && this.kra_pin === '') {
        this.doNotification(2, this.$t('general.upgrade_account'), this.$t('general.enter_kra_pin'));
      } else if (this.tax_compliance && !this.valid_kra_pin) {
        this.doNotification(2, this.$t('general.upgrade_account'),  this.$t('general.enter_valid_kra'));
      } else if (this.primary_business_unit === '') {
        this.doNotification(2, this.$t('general.upgrade_account'), this.$t('general.select_primary_type_vehicle'));
      } else {
        this.upgrade_details = this.$t('general.verify');
      }
    },
    submit() {
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
      values.deactivate_peer = this.deactivate_acc;
      values.primary_business_unit = this.primary_business_unit;

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
              const identityEmail = this.radio === '2' ? this.cop_email : session.peer.user_email;

              this.$mixpanel.alias(identityEmail);

              this.$mixpanel.people.set_once({
                $email: identityEmail,
                $phone: session.peer.user_phone,
                'Account Type': 'Business',
                $name: session.peer.user_name,
                $created: new Date(),
                'Client Type': 'Web Platform',
                'Business Name': this.cop_name,
              });

              // login identify
              this.$mixpanel.identify(identityEmail);

              // track New Account
              this.$mixpanel.track('New Account Created - Upgrade', {
                'Account Type': 'Business',
                'Last Login': new Date(),
                'Client Type': 'Web Platform',
                'Business Name': this.cop_name,
                'User Email': this.radio === '2' ? this.cop_email : session.peer.user_email,
                'User Phone': session.peer.user_phone,
                'User ID': session.peer.user_id,
                'VAT Compliant': this.tax_compliance,
              });
            }
            this.doNotification(1, this.$t('general.account_upgraded_successful'), this.$t('general.redirected_to_login'),);
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
            this.doNotification(2, this.$t('general.upgrade_account_error'), response.message);
          }
        },
        (error) => {
          const msg = error.response.data.message;
          this.doNotification(2, this.$t('general.upgrade_account_error'), msg);
        },
      );
    },
    getVendorIcon(id) {
      return `https://images.sendyit.com/web_platform/vendor_type/side/v2/${id}.svg`;
    },
    go_back(code) {
      if (code === 2) {
        this.upgrade_details = true;
      } else {
        this.upgrade_details = false;
        this.clearStoredData();
      }
    },
    clearStoredData() {
      this.tax_compliance = '';
      this.cop_name = '';
      this.cop_email = '';
      this.cop_password = '';
      this.kra_pin = '';
      this.vendors = '';
      this.activeTab = '';
      this.primary_business_unit = '';
      this.code = '';
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
.upgrade-account {
  border: 0px solid #ccc;
  margin: 5px;
}
.upgrade-account-inner {
  max-width: 33rem;
  border-radius: 4px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
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
  width: 73%;
}

.btn-upgrade-acc-check {
  width: 28%;
  border-width: 0px !important;
}
.btn-upgrade-acc-submit {
  border-width: 0px !important;
  width: 100% !important;
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
 color: rgba(0, 0, 0, 0.71) !important;
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
  justify-content: space-between;
  width: 73%;
  margin-left: 3% !important;
}
.upgrade-verification{
  border: 0px solid #ccc;
  margin: 5px;
}
.deactivate-details{
 color: #007ECB !important;
 font-weight: 400;
 padding-left: 1%;
}
.vendor-types {
  height: 43px;
  min-width: 63px;
  padding: 20%;
  cursor: pointer;
}
.vendors-outerline{
  display: flex;
  justify-content: space-between;
  width: 67% ;
  margin-left: 2%;
  margin-top: 2%;
}
.summary-ouline{
  font-size: 16px;
  line-height: 30px;
  color: #000000;
  font-weight: 300;
}
.user_details{
  margin: 0;
  font-size: 15px;
  line-height: 30px;
  color: #888888;
}
.vendor-cards{
  border: 1.0945px solid #D8D8D8;
  box-sizing: border-box;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);
  border-radius: 3px;
  width: 31% ;
  margin-right: 7%;
}
.extra-info{
 margin-top: 0;
 font-size: 13px;
 line-height: 30px;
 color: #8F8F8F;
 padding-left: 1%;
}
.vendor_active{
  background: #EDF8FF;
  border: 2px solid #1B7FC3;
  box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.25);
  animation: flip-scale-down-diag-2 0.5s linear ;
}
@keyframes flip-scale-down-diag-2 {
  0% {
    transform: scale(1) rotate3d(-1, 1, 0, 0deg);
  }
  50% {
    transform: scale(0.4) rotate3d(-1, 1, 0, -90deg);
  }
  100% {
    transform: scale(1) rotate3d(-1, 1, 0, -180deg);
  }
}
.highlight-frame{
  border: 1.0945px solid #D8D8D8;
  box-sizing: border-box
}
.final-upgrade-submit{
  width: 46% !important;
  margin-top: 5%;
}
.primary-vehicle-selected{
  padding: 0 !important;
}
.vehicle-selected-wrapper{
  display: flex;
  align-items:center;
}
.primary-vehicle-wrapper{
  width: 50%;
  margin: 0;
}
.upgrade-details-header{
  font-size: 20px;
}
.upgrade-submit-wrapper{
  display:flex;
  justify-content: space-between;
}
.primary-vehicle-name{
  margin-top: 8%;
}
.primary-vehicle-outline{
  margin-left: 3%;
}
</style>
