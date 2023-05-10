<template lang="html">
  <div class="screen-one">
    <div class="onboarding-user-header">
      {{ $t('onboardingComponent.join', {getBizName: getBizName}) }}
    </div>

    <p class="onboard-error">
      {{ message }}
    </p>

    <div class="form-inputs">
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>{{ $t('onboardingComponent.name') }}</span>
          </label>
          <input
            v-model="name"
            class="form-control"
            placeholder="John Doe"
            type="text"
            name="name"
            @focus="setCurrentStep(1)"
          >
        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>{{ $t('onboardingComponent.email_address') }}</span>
          </label>
          <input
            v-model="email"
            v-validate="'required|email'"
            class="form-control"
            placeholder="you@email.com"
            data-vv-validate-on="blur"
            name="email"
            type="email"
            @focus="setCurrentStep(2)"
          >
          <br>
          <span class="onboarding-email-error">
            {{ errors.first('email') }}
          </span>
        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>{{ $t('onboardingComponent.phone_no') }}</span>
          </label>
          <vue-tel-input
            v-model="phone"
            v-validate="'required|check_phone'"
            class="form-control phone-input-display"
            name="phone"
            value=""
            data-vv-validate-on="blur"
            v-bind="sendyPhoneProps"
            :input-options="vueTelInputProps"
            @onBlur="validate_phone"
            @focus="setCurrentStep(3)"
          />
          <span
            v-show="errors.has('phone')"
            class="sign-up-phone-error"
          >
            {{ errors.first('phone') }}
          </span>
        </div>
      </div>
    </div>
    <div class="divide" />
    <div class="form-submits">
      <a class="waves-effect">
        {{ $t('onboardingComponent.back') }}
      </a>
      <button
        id="nextBtn"
        class="btn-submit"
        style="width:30% !important;"
        name="next"
        :disabled="!is_valid"
        @click="next_view"
      >
        {{ $t('onboardingComponent.next') }}
      </button>
    </div>

    <el-dialog
      :visible.sync="phoneVerification"
      class="onboarding-phone-validation"
    >
      <span slot="title">
        <img
          src="https://images.sendyit.com/web_platform/logo/rebrand_logo.png"
          style="width:85px;"
        >
      </span>
      <div>
        <div class="onboarding-validation-description">
          {{ $t('onboardingComponent.verification_sms') }}
        </div>

        <div class="onboarding-verification-input">
          <input
            id="onboarding-verif_input"
            v-model="code"
            type="text"
            :placeholder="$t('onboardingComponent.enter_verification_code')"
          >
        </div>
      </div>
      <div class="onboarding-verif-button">
        <button
          type="button"
          class="onboarding-cancel "
          @click="onboardingVerificationCancel"
        >
          {{ $t('onboardingComponent.cancel') }}
        </button>
        <button
          type="button"
          class="onboarding-verify"
          @click="onboardingVerificationVerify"
        >
          {{ $t('onboardingComponent.verify') }}
        </button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export default {
  name: 'OnboardingInfoComponent',
  mixins: [NotificationMxn],
  data() {
    return {
      name: '',
      phone: '',
      email: '',
      message: '',
      phoneVerification: false,
      code: '',
      requestId: '',
      sendyPhoneProps: {
        mode: 'international',
        defaultCountry: 'ke',
        preferredCountries: ['ke', 'ug', 'tz'],
      },
      vueTelInputProps: {
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('onboardingComponent.enter_phone'),
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
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
      getType: '$_external/getType',
      getBizEmail: '$_external/getBizEmail',
      getBizName: '$_external/getBizName',
      getPerEmail: '$_external/getPerEmail',
      getName: '$_external/getName',
    }),
    is_valid() {
      return this.f_name !== '' && this.phone !== '' && this.email !== '';
    },
    is_type() {
      if (this.getType === 0) {
        return true;
      }
      return false;
    },
  },
  mounted() {
    this.name = this.getName;
    this.email = this.getPerEmail;
  },
  methods: {
    validate_phone() {
      this.$validator.validate();
    },
    ...mapMutations({
      setViewState: '$_external/setViewState',
      updateViewStep: '$_external/updateViewStep',
      updateName: '$_external/updateName',
      updatePhone: '$_external/updatePhone',
      updateBizEmail: '$_external/updateBizEmail',
    }),
    ...mapActions({
      requestOnboardingVerificationVerify: '$_external/requestOnboardingVerificationVerify',
      requestOnboardingPhoneVerification: '$_external/requestOnboardingPhoneVerification',
    }),
    next_view() {
      const phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));
      let emailValid = true;
      for (let i = 0; i < this.errors.items.length; i += 1) {
        if (this.errors.items[i].field === 'email') {
          emailValid = false;
          break;
        }
      }

      if (phoneValid && emailValid) {
        this.phoneVerification = true;
        this.sendVerificationCode();
      } else {
        this.message = $t('onboardingComponent.prov_email');
      }
    },
    setCurrentStep(step) {
      this.updateViewStep(step);
    },
    onboardingVerificationCancel() {
      this.phoneVerification = false;
      this.doNotification(
        2,
        this.$t('onboardingComponent.phone_verification'),
        this.$t('onboardingComponent.phone_verification_failed'),
      );
    },

    sendVerificationCode() {
      const phone = this.phone.replace(/[\(\)\-\s]+/g, '');
      const values = {};
      values.number = phone;
      const fullPayload = {
        values,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'request_verification',
      };
      this.requestOnboardingPhoneVerification(fullPayload).then(
        (response) => {
          if (response.status) {
            this.requestId = response.request_id;
          } else {
            this.doNotification(2, this.$t('onboardingComponent.phone_verification'), response.message);
          }
        },
        (error) => {},
      );
    },

    onboardingVerificationVerify() {
      const values = {};
      values.code = this.code;
      values.request_id = this.requestId;
      const fullPayload = {
        values,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'check_verification',
      };
      this.requestOnboardingVerificationVerify(fullPayload).then(
        (response) => {
          if (response.status) {
            this.doNotification(2, this.$t('onboardingComponent.phone_verification'), this.$t('onboardingComponent.phone_verification_successful'));

            const phone = this.phone.replace(/[\(\)\-\s]+/g, '');

            this.setViewState(2);
            this.updateName(this.name);
            this.updatePhone(phone);
            this.updateBizEmail(this.email);
            this.updateViewStep(0);
          } else {
            this.doNotification(2, this.$t('onboardingComponent.phone_verification'), response.message);
          }
        },
        (error) => {},
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

.form-inputs > div:nth-child(3) > div > div > div > ul {
    z-index: 9;
    width: 354px;
    margin-top: 9px;
    margin-left: -15px;
}

.onboarding-user-header{
  word-wrap: break-word;
  line-height: 38px !important;
  letter-spacing: 0;
  font-size: 28px !important;
  font-weight: 300 !important;
  margin-bottom: 2rem;
  font-family: 'Nunito', sans-serif;
  margin: 0 0 1rem;
  display: block;
  -webkit-margin-after: 0.67em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
  max-width: 600px;
}
.input-field{
  width: 50%;
  left: auto;
  right: auto;
  padding: 0 .75rem;
  min-height: 1px;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;

}
.input-field2{
  width: 50% !important;
  left: auto;
  right: auto;
  padding: 0 .75rem;
  min-height: 1px;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;

}
.input-classy{
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0;
  outline: none;
  height: 3rem;
  width: 100%;
  font-size: 16px;
  margin: 0 0 8px 0;
  padding: 0;
}
.input-classy2{
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0;
  outline: none;
  height: 3rem;
  width: 100%;
  font-size: 16px;
  margin: 0 0 8px 0;
  padding: 0;
}
.waves-effect{
  position: relative;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  vertical-align: middle;
  z-index: 1;
  transition: .3s ease-out;
  box-shadow: none;
  background-color: transparent;
  color: #343434;
  height: 36px;
  line-height: 36px;
  padding: 0 16px;
  text-transform: uppercase;
}
.row-defined{
  flex-direction: row;
  display: flex;
  width: 120%;
}
.row{
  width: 100%
}
.input-descript{
  margin: 0 0 .25rem;
 display: block;
 font-size: 1rem;
 line-height: 1.5rem;
 font-weight: 400!important;
 margin-bottom: .5rem!important;
}
.onboarding-email-error{
  margin-right: 45%;
  font-size: 13px;
  font-family: 'Nunito', sans-serif;
  color: #e08445;
}
.onboard-error{
  color: #e08445;
  font-family: 'Nunito', sans-serif;
}
#app > div > div.user-invite-body > div > div > div.panel-card > div > div > div.el-dialog__wrapper.onboarding-phone-validation > div > div.el-dialog__header{
  background-color: #1782C5;
  text-align: center;
}
.onboarding-phone-validation > div
{
  margin-top: 18em !important;
  width: 35% !important;
}
.onboarding-validation-description{
  text-align: left;
  line-height: 1.5;
  padding: 10px 0px;
  font-family: 'Nunito', sans-serif;
}
.onboarding-verification-input{
  display: flex;
  margin-top: 10px;
}
#onboarding-verif_input{
  border: none;
  padding: 2px;
  border-bottom: 1px solid #ccc;
  width: 50%;
  font-family: 'Nunito', sans-serif;
  font-size: 16px;
}
.onboarding-verif-button{
  padding: 19px 20px 20px;
  margin-top: 16px;
  text-align: right;
  border-top: 1px solid #e5e5e5;
}
.onboarding-verify{
    color: #ecf0f1;
    background-color: #1782C5;
    border-color: #1b7fc3;
    cursor: pointer;
    border-radius: 4px;
    height: 40px;
    transition: background-color 0.3s;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 13px;
}
.onboarding-cancel{
    cursor: pointer;
    border-radius: 4px;
    height: 40px;
    transition: background-color 0.3s;
    padding-left: 20px;
    padding-right: 20px;
    font-size: 13px;
    border:none;
    font-family: 'Nunito', sans-serif;
}
</style>
