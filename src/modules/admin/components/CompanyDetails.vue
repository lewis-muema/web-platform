<template lang="html">
  <div
    id="cop_info_container"
    class="cop_info_container"
  >
    <div class="cop-edit-inner">
      <div class="company-edit2-details">
        {{ $t('companyDetails.edit') }}
      </div>
      <div class="edit-cop-info-position">
        <div class="cop-edit-holder">
          <label class="cop-input-descript">
            <span>{{ $t('companyDetails.company_name') }}</span>
          </label>
          <input
            v-model="cop_name"
            class="input-control cop-edit-form"
            type="text"
            autocomplete="off"
          >
        </div>

        <div class="cop-edit-holder">
          <label class="cop-input-descript">
            <span>{{ $t('companyDetails.contact_person') }}</span>
          </label>
          <input
            v-model="contact_name"
            class="input-control cop-edit-form"
            type="text"
          >
        </div>

        <div class="cop-edit-holder">
          <label class="cop-input-descript">
            <span>{{ $t('companyDetails.email_contact_person') }}</span>
          </label>
          <input
            v-model="contact_email"
            v-validate="'required|email'"
            class="input-control cop-edit-form"
            type="text"
            name="email"
          >
          <p class="edit-cop-data-error">
            {{ errors.first('email') }}
          </p>
        </div>

        <div class="cop-edit-holder">
          <label class="cop-input-descript">
            <span>{{ $t('companyDetails.phone_contact_person') }}</span>
          </label>
          <vue-tel-input
            v-model.trim="phone"
            v-validate="'required|check_phone'"
            class="form-control cop-edit-form phone-input-display"
            name="phone"
            value=""
            data-vv-validate-on="blur"
            v-bind="sendyPhoneProps"
            :input-options="vueTelInputProps"
            @onBlur="validate_phone"
          />
        </div>

        <div class="sign-holder">
          <button
            class="button-primary btn-edit-cop-info"
            type="submit"
            @click="save_cop"
          >
            {{ $t('companyDetails.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';
import InputValidationMixin from '../../../mixins/fields_validations_mixin';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

export default {
  name: 'CompanyDetails',
  mixins: [SessionMxn, NotificationMxn, InputValidationMixin],
  data() {
    return {
      cop_name: '',
      phone: '',
      contact_email: '',
      contact_name: '',
      message: '',
      sendyPhoneProps: {
        mode: 'international',
        defaultCountry: 'ke',
        preferredCountries: ['ke', 'ug', 'tz'],
      },
      vueTelInputProps: {
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('companyDetails.phone'),
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
  mounted() {
    this.set_data();
  },
  methods: {
    validate_phone() {
      this.$validator.validate();
    },
    ...mapActions({
      requestCopInfo: '$_admin/requestCopInfo',
    }),
    set_data() {
      const session = this.$store.getters.getSession;
      this.cop_name = session[session.default].cop_name;
      this.phone = session[session.default].cop_biz_phone;
      this.contact_email = session[session.default].cop_biz_email;
      this.contact_name = session[session.default].cop_contact_person;
    },

    save_cop() {
      if (
        this.cop_name !== ''
        && this.phone !== ''
        && this.contact_email !== ''
        && this.contact_name !== ''
        && this.fieldValidations('user_name', this.contact_name)
        && this.fieldValidations('biz_name', this.cop_name)
      ) {
        const phoneValid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));

        if (phoneValid) {
          const phone = this.phone.replace(/[()\-\s]+/g, '');

          const session = this.$store.getters.getSession;

          const values = {
            cop_id: session[session.default].cop_id,
            cop_name: this.cop_name,
            cop_contact_person: this.contact_name,
            cop_email: this.contact_email,
            cop_phone: phone,
          };

          const fullPayload = {
            values,
            app: 'NODE_PRIVATE_API',
            endpoint: 'update_cop',
          };

          this.requestCopInfo(fullPayload).then(
            (response) => {
              if (response.status) {
                const updatedSession = session;
                updatedSession[session.default].cop_name = this.cop_name;
                updatedSession[session.default].cop_contact_person = this.contact_name;
                updatedSession[session.default].cop_biz_email = this.contact_email;
                updatedSession[session.default].cop_biz_phone = phone;

                const newSession = JSON.stringify(updatedSession);
                this.setSession(newSession);

                const level = 1; // success
                this.message = this.$t('companyDetails.detail_saved');
                const notification = {
                  title: '',
                  level,
                  message: this.message,
                };

                this.displayNotification(notification);
              } else {
                const level = 3;
                this.message = this.$t('companyDetails.somthing_went_wrong'); // 'Something went wrong.';
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
              const notification = { title: '', level, message: this.$t('companyDetails.somthing_went_wrong') }; // notification object
              this.displayNotification(notification);
            },
          );
        } else {
          const level = 3;
          this.message = this.$t('companyDetails.invalid_phone');
          const notification = {
            title: '',
            level,
            message: this.message,
          };
          this.displayNotification(notification);
        }
      } else {
        const level = 3;
        let errorDescription = this.$t('companyDetails.all_details');

        if (!this.fieldValidations('user_name', this.contact_name)) {
          errorDescription = this.fieldValidationsError('user_name');
        } else if (!this.fieldValidations('biz_name', this.cop_name)) {
          errorDescription = this.fieldValidationsError('biz_name');
        }

        const notification = {
          title: '',
          level,
          message: errorDescription,
        };
        this.displayNotification(notification);
      }
    },
  },
};
</script>

<style lang="css">
 @import "../../../assets/styles/datatable.css";

 .company-edit2-details {
  font-size: 1.3rem;
  line-height: 1.7em;
  font-weight: 400;
  text-align: center;
  color: #666;
  margin-top: 18% !important;
  margin-left: 100px;
  margin-right: 60px;
 }

 .edit-cop-info-position {
  border-left: 2px solid rgb(23, 130, 197);
  padding-left: 80px;
 }
 .cop-edit-holder {
  margin: 1em;
  display: block;
  width: 83%;
 }
 .cop-input-descript{
  margin: 0 0 .25rem;
  display: block;
  font-size: 15px;
  line-height: 1.5rem;
  font-weight: 400!important;
  margin-bottom: .5rem!important;
  width:140%;
 }
 .cop-edit-form {
  height: 42px !important;
  width: 140% !important;
 }

 .btn-edit-cop-info{
  border-width:0px !important;
  margin-left: 15px !important;
 }
 .cop-edit-inner {
  max-width: 60rem;
  border-radius: 4px;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  display: flex;
 }
 .edit-cop-info-position > div:nth-child(4) > div > div > ul {
 z-index: 9;
 width: 326px;
 margin-top: 8px;
 margin-left: -15px;
}
.edit-cop-data-error{
  margin-right: 3%;
  font-size: 13px;
  font-family: 'Nunito', sans-serif;
  color: #e08445;
  text-align: left;
  width: 112% !important;
}
</style>
