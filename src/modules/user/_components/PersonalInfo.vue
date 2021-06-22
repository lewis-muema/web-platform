<template lang="html">
  <div class="new-card2">
    <div
      class="help-card"
      style="width:400px;margin-left:30%;margin-top:30px;"
    >
      <p class="personal-info-padding">
        <label class="input-descript">
          <span> {{ $t('general.name') }}</span>
        </label>
        <input
          v-model="user_name"
          type="text"
          name="user_name"
          class="form-control profile1-dimen"
        >
      </p>
      <p class="personal-info-padding">
        <label class="input-descript">
          <span> {{ $t('general.email') }}</span>
        </label>
        <input
          v-model="user_email"
          type="text"
          name="user_email"
          class="form-control profile1-dimen"
        >
      </p>
      <p class="personal-info-padding">
        <label class="input-descript">
          <span> {{ $t('general.phone_number') }}</span>
        </label>
        <vue-tel-input
          v-model.trim="phone"
          v-validate="'required|check_phone'"
          class="form-control profile1-dimen"
          name="phone"
          value=""
          data-vv-validate-on="blur"
          v-bind="phoneInputProps"
          @onBlur="validate_phone"
        />
      </p>
      <p>
        <br>

        <input
          id="save_personal"
          type="submit"
          class="button-primary btn-content"
          :value="$t('general.save')"
          @click="save_personal"
        >
      </p>
      <el-dialog
        :visible.sync="validate"
        class="personal-info-phone-validation"
      >
        <span slot="title">
          <img
            src="https://images.sendyit.com/web_platform/logo/rebrand_logo.png"
            class="signup-sendy-logo"
          >
        </span>
        <div>
          <div class="phone-validation-description">
            {{ $t('general.sendy_security_sms') }}
          </div>

          <div class="phone-verification-input">
            <input
              id="phone-validation-verify--input"
              v-model="code"
              type="text"
              :placeholder="$t('general.enter_verification_code')"
            >
          </div>
        </div>
        <div class="phone-validation-verify--button">
          <button
            type="button"
            class="phone-validation-cancel"
            @click="phoneVerificationCancel"
          >
            {{ $t('general.cancel') }}
          </button>
          <button
            type="button"
            class="phone-validation-verify"
            @click="phoneVerificationVerify"
          >
            {{ $t('general.verify') }}
          </button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';
import InputValidationMixin from '../../../mixins/fields_validations_mixin';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export default {
  name: 'PersonalInfo',
  mixins: [SessionMxn, NotificationMxn, InputValidationMixin],
  data() {
    return {
      user_name: '',
      user_email: '',
      phone: '',
      validate: false,
      code: '',
      proceed_update: true,
      request_id: '',
      phoneInputProps: {
        mode: 'international',
        defaultCountry: 'ke',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('general.enter_phone_number'),
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
      getSess: 'getSession',
    }),
  },
  watch: {
    getSess: {
      handler(val, oldVal) {
        this.set_data();
      },
      deep: true,
    },
  },
  mounted() {
    this.set_data();
  },

  methods: {
    set_data() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        this.user_name = session[session.default].user_name;
        this.user_email = session[session.default].user_email;
        this.phone = session[session.default].user_phone;
      }
    },
    validate_phone() {
      this.$validator.validate();
    },
    ...mapActions({
      requestPersonalInfo: '$_user/requestPersonalInfo',
      requestPhoneVerification: '$_user/requestPhoneVerification',
      requestPhoneVerificationVerify: '$_user/requestPhoneVerificationVerify',
    }),
    save_personal() {
      if (
        this.user_name !== ''
        && this.user_email !== ''
        && this.phone !== ''
        && this.fieldValidations('user_name', this.name)
      ) {
        const phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));

        if (phoneValid) {
          const phone = this.phone.replace(/[()\-\s]+/g, '');

          const session = this.$store.getters.getSession;

          const oldPhone = session[session.default].user_phone;

          if (oldPhone !== phone) {
            this.validate = true;
            this.proceed_update = false;
            this.doNotification(
              1,
              this.$t('general.phone_verification'),
              this.$t('general.phone_verification_sent'),
            );
            this.sendVerificationCode(phone);
          }
          if (this.proceed_update) {
            this.updateSessionData();
          }
        } else {
          const level = 3;
          this.message = this.$t('general.invalid_phone_number');
          const notification = {
            title: '',
            level,
            message: this.message,
          }; // notification object
          this.$store.commit('setNotification', notification);
          this.$store.commit('setNotificationStatus', true);
        }
      } else {
        const level = 3;
        this.message = this.$t('general.provide_all_details');
        if (!this.fieldValidations('user_name', this.name)) {
          this.message = this.fieldValidationsError('user_name');
        }
        const notification = {
          title: '',
          level,
          message: this.message,
        }; // notification object
        this.$store.commit('setNotification', notification);
        this.$store.commit('setNotificationStatus', true);
      }
    },
    phoneVerificationCancel() {
      this.proceed_update = false;
      this.validate = false;
      this.doNotification(
        2,
        this.$t('general.phone_verification'),
        this.$t('general.phone_verification_failed'),
      );
    },
    phoneVerificationVerify() {
      const values = {};
      values.code = this.code;
      values.request_id = this.request_id;
      const fullPayload = {
        values,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'check_verification',
      };
      this.requestPhoneVerificationVerify(fullPayload).then(
        (response) => {
          if (response.status) {
            this.doNotification(
              1,
              this.$t('general.phone_verification'),
              this.$t('general.phone_verification_successful'),
            );
            this.proceed_update = true;
            this.validate = false;
            this.updateSessionData();
          } else {
            this.doNotification(3, this.$t('general.phone_verification'), response.message);
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('general.phone_verification_error'),
            this.$t('general.check_internet_connection'),
          );
        },
      );
    },
    sendVerificationCode(phone) {
      const values = {};
      values.number = phone;
      const fullPayload = {
        values,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'request_verification',
      };
      this.requestPhoneVerification(fullPayload).then(
        (response) => {
          if (response.status) {
            this.request_id = response.request_id;
          } else {
            this.doNotification(3, this.$t('general.phone_verification'), response.message);
          }
        },
        (error) => {
          this.doNotification(
            2,
            this.$t('general.phone_verification_error'),
            this.$t('general.check_internet_connection'),
          );
        },
      );
    },
    updateSessionData() {
      const phone = this.phone.replace(/[()\-\s]+/g, '');

      const session = this.$store.getters.getSession;
      if (session.default === 'biz') {
        const values = {
          cop_user_id: session[session.default].user_id,
          user_name: this.user_name,
          user_email: this.user_email,
          user_phone: phone,
        };

        this.trackMixpanelEvent('Edit Profile', {
          'Account Type': 'Business',
          'Client Type': 'Web Platform',
          'User Email': values.user_email,
          'User Phone': values.user_phone,
        });

        const fullPayload = {
          values,
          app: 'NODE_PRIVATE_API',
          endpoint: 'update_user',
        };

        this.requestPersonalInfo(fullPayload).then(
          (response) => {
            if (response.status) {
              const updatedSession = session;
              updatedSession[session.default].user_name = this.user_name;
              updatedSession[session.default].user_phone = phone;
              updatedSession[session.default].user_email = this.user_email;

              const newSession = JSON.stringify(updatedSession);
              this.setSession(newSession);
              const level = 1; // success
              this.message = this.$t('general.details_saved');
              const notification = {
                title: '',
                level,
                message: this.message,
              }; // notification object
              this.displayNotification(notification);
            } else {
              const level = 3;
              this.message = this.$t('general.something_went_wrong');
              const notification = {
                title: '',
                level,
                message: this.message,
              }; // notification object
              this.displayNotification(notification);
            }
          },
          (error) => {
            const level = 3;
            this.message = this.$t('general.something_went_wrong');
            const notification = {
              title: '',
              level,
              message: this.message,
            }; // notification object
            this.displayNotification(notification);
          },
        );
      } else if (session.default === 'peer') {
        const values = {
          user_id: session[session.default].user_id,
          user_name: this.user_name,
          user_email: this.user_email,
          user_phone: phone,
        };

        this.trackMixpanelEvent('Edit Profile', {
          'Account Type': 'Peer',
          'Client Type': 'Web Platform',
          'User Email': values.user_email,
          'User Phone': values.user_phone,
        });

        const fullPayload = {
          values,
          app: 'NODE_PRIVATE_API',
          endpoint: 'update_user',
        };

        this.requestPersonalInfo(fullPayload).then(
          (response) => {
            if (response.status) {
              const updatedSession = session;
              updatedSession[session.default].user_name = this.user_name;
              updatedSession[session.default].user_phone = phone;
              updatedSession[session.default].user_email = this.user_email;

              const newSession = JSON.stringify(updatedSession);
              this.setSession(newSession);
              this.$store.commit('setSession', updatedSession);

              const level = 1;
              this.message = this.$t('general.details_saved');
              const notification = {
                title: '',
                level,
                message: this.message,
              };
              this.displayNotification(notification);
            } else {
              const level = 3;
              this.message = this.$t('general.something_went_wrong');
              const notification = {
                title: '',
                level,
                message: this.message,
              };
              this.displayNotification(notification);
            }
          },
          (error) => {
            const level = 3;
            this.message = this.$t('general.something_went_wrong');
            const notification = {
              title: '',
              level,
              message: this.message,
            };
            this.displayNotification(notification);
          },
        );
      } else {
        this.$router.push('/auth');
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
          // this.$ga.event({
          //   eventCategory: 'Orders',
          //   eventAction: 'Price Request',
          //   eventLabel: name,
          //   eventValue: 14,
          // });
        }
      } catch (er) {
        // ...
      }
    },
  },
};
</script>

<style lang="css">

#auth_container > div > div:nth-child(2) > div > div > p:nth-child(3) > div > div > ul{
      z-index: 9;
      width: 357px;
      margin-top: 9px;
      margin-left: -15px;

   }

    .my-profile {
        padding-top: 45px;
        width: 90%;
        margin: 0px auto;
    }

    .my-profile__menu {
        font-size: 22px;
        padding-bottom: 0px;
        border-bottom: 1px solid #ccc;
        color: #999;
        padding-top: 15px;
        margin-bottom: 30px;
    }

    .my-profile__menu__balance {
        float: right;
        font-size: 14px;
        color: #1782C5;
    }

    .my-profile__inner__menu {
        margin-bottom: 50px;
        border-bottom: 1px solid #1782C5;
        padding-bottom: 2px;
    }

    .my-profile__inner__menu__link {
        color: #1782C5;
        text-transform: uppercase;
        text-align: center;
        padding: 2px 25px;
        font-size: 17px;
    }

    .my-profile__inner__menu__selected {
        font-weight: 400;
        border-bottom: 3px solid #1782C5;
        text-decoration: none;
    }

    .my-profile__main__header__2 {
        font-size: 16px;
        padding-bottom: 3px;
        border-bottom: 1px solid #ccc;
        text-transform: uppercase;
        color: #999;
    }

    .my-profile__input {
        background-color: transparent;
        border: 0px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 10px;
        width: 300px;
        margin-top: 9px;
        font-family: 'Nunito', sans-serif;
        font-size: inherit;
        line-height: inherit;
        color: #575757;
    }

    .my-profile__phone_input {
        height: 50px;
        display: flex;
        margin: 0 0 10px;
    }

    .my-profile__btn {
        font-size: 14px;
        width: 320px;
        -webkit-appearance: button;
        cursor: pointer;
        padding: 10px 16px;
        line-height: 1.33;
        border-radius: 3px;
        color: #fff;
        background-color: #1782C5;
        border-color: #357ebd;
        display: inline-block;
        margin-bottom: 0;
        font-weight: normal;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        text-transform: uppercase;
    }

    .input-descript {
        margin: 0 0 .25rem;
        display: block;
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 400 !important;
        margin-bottom: .5rem !important;
    }

    .profile1-dimen {
        width: 90% !important;
    }

    .input-descript {
        margin: 0 0 .25rem;
        display: block;
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 400 !important;
        margin-bottom: .5rem !important;
    }

    .btn-content {
        height: 40px;
        width: 35%;
        font-size: medium;
        letter-spacing: 1.1px;
        border-width:0px !important;
    }

    .panel-card {
        -webkit-box-flex: 2;
        flex: 2;
        padding-right: 40px;
        -webkit-box-orient: vertical;
        flex-direction: column;
        display: flex;
        -webkit-box-direction: normal;
    }

    .help-card {
        -webkit-box-flex: 1;
        flex: 1;
        -webkit-box-orient: vertical;
        flex-direction: column;
        display: flex;
        -webkit-box-direction: normal;
        padding-top: 30px;
        margin: -9% auto;
        max-width: 32rem;

    }

    .new-card2 {
        -webkit-box-flex: 1;
        flex: 1;
        -webkit-box-orient: vertical;
        flex-direction: column;
        display: flex;
        -webkit-box-direction: normal;
        padding-top: 3px ! important;

    }
    .personal-info-padding{
      margin-bottom: 20px;
    }
    .personal-info-phone-validation > div
    {
      margin-top: 12em !important;
      margin-right: 23em !important;
      width: 35% !important;
    }
    .phone-validation-description{
      text-align: left;
      line-height: 1.5;
      padding: 10px 0px;
      font-family: 'Nunito', sans-serif;
    }
    .phone-verification-input{
      display: flex;
      margin-top: 25px;
    }
    #phone-validation-verify--input{
      border: none;
      padding: 2px;
      border-bottom: 1px solid #ccc;
      width: 50%;
      font-family: 'Nunito', sans-serif;
      font-size: 16px;
    }
    .phone-validation-verify--button{
      padding: 19px 20px 20px;
      margin-top: 33px;
      text-align: right;
      border-top: 1px solid #e5e5e5;
    }
    .phone-validation-verify{
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
    .phone-validation-cancel{
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
    .signup-sendy-logo{
        width:85px;
    }
    #auth_container > div > div:nth-child(2) > div > div > div > div > div.el-dialog__header{
      background-color: #1782C5;
    }
</style>
