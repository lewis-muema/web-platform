<template lang="html">
  <div class="new-card2">
    <div
      class="help-card"
      style="width:400px;margin-left:30%;margin-top:30px;"
    >
      <p class="personal-info-padding">
        <label class="input-descript">
          <span>Name</span>
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
          <span>Email</span>
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
          <span>Phone Number</span>
        </label>
        <vue-tel-input
          v-model.trim="phone"
          v-validate="'required|check_phone'"
          class="form-control profile1-dimen"
          name="phone"
          value=""
          data-vv-validate-on="blur"
          :preferred-countries="['ke', 'ug', 'tz']"
          @onBlur="validate_phone"
        />
      </p>
      <p>
        <br>

        <input
          id="save_personal"
          type="submit"
          class="button-primary btn-content"
          value="Save"
          @click="save_personal"
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin.js';

export default {
  name: 'PersonalInfo',
  mixins: [SessionMxn],
  data() {
    return {
      // user_id: '',
      user_name: '',
      user_email: '',
      phone: '',
    };
  },
  mounted() {
    this.set_data();
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
  methods: {
    set_data() {
      const session = this.$store.getters.getSession;
      this.user_name = session[session.default].user_name;
      this.user_email = session[session.default].user_email;
      this.phone = session[session.default].user_phone;
    },
    validate_phone() {
      this.$validator.validate();
    },
    ...mapActions({
      requestPersonalInfo: '$_user/requestPersonalInfo',
    }),
    save_personal() {
      if (this.user_name !== '' && this.user_email !== '' && this.phone !== '') {
        const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
        const phone_valid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));

        if (phone_valid) {
          const phone = this.phone.replace(/[\(\)\-\s]+/g, '');

          const session = this.$store.getters.getSession;

          if (session.default === 'biz') {
            const values = {
              cop_user_id: session[session.default].user_id,
              user_name: this.user_name,
              user_email: this.user_email,
              user_phone: phone,
            };

            const full_payload = {
              values,
              app: 'NODE_PRIVATE_API',
              endpoint: 'update_user',
            };

            this.requestPersonalInfo(full_payload).then(
              (response) => {
                if (response.status) {
                  const updated_session = session;
                  updated_session[session.default].user_name = this.user_name;
                  updated_session[session.default].user_phone = phone;
                  updated_session[session.default].user_email = this.user_email;

                  const new_session = JSON.stringify(updated_session);
                  this.setSession(new_session);
                  const level = 1; // success
                  this.message = 'Details Saved!';
                  const notification = { title: '', level, message: this.message }; // notification object
                  this.$store.commit('setNotification', notification);
                  this.$store.commit('setNotificationStatus', true); // activate notification
                } else {
                  const level = 3;
                  this.message = 'Something went wrong.';
                  const notification = { title: '', level, message: this.message }; // notification object
                  this.$store.commit('setNotification', notification);
                  this.$store.commit('setNotificationStatus', true); // activate notification
                }
              },
              (error) => {
                const level = 3;
                this.message = 'Something went wrong.';
                const notification = { title: '', level, message: this.message }; // notification object
                this.$store.commit('setNotification', notification);
                this.$store.commit('setNotificationStatus', true);
              },
            );
          } else if (session.default === 'peer') {
            const values = {
              user_id: session[session.default].user_id,
              user_name: this.user_name,
              user_email: this.user_email,
              user_phone: phone,
            };

            const full_payload = {
              values,
              app: 'NODE_PRIVATE_API',
              endpoint: 'update_user',
            };

            this.requestPersonalInfo(full_payload).then(
              (response) => {
                if (response.status) {
                  const updated_session = session;
                  updated_session[session.default].user_name = this.user_name;
                  updated_session[session.default].user_phone = phone;
                  updated_session[session.default].user_email = this.user_email;

                  const new_session = JSON.stringify(updated_session);
                  this.setSession(new_session);
                  this.$store.commit('setSession', updated_session);

                  const level = 1; // success
                  this.message = 'Details Saved!';
                  const notification = { title: '', level, message: this.message }; // notification object
                  this.$store.commit('setNotification', notification);
                  this.$store.commit('setNotificationStatus', true); // activate notification
                } else {
                  const level = 3;
                  this.message = 'Something went wrong.';
                  const notification = { title: '', level, message: this.message }; // notification object
                  this.$store.commit('setNotification', notification);
                  this.$store.commit('setNotificationStatus', true); // activate notification
                }
              },
              (error) => {
                const level = 3;
                this.message = 'Something went wrong.';
                const notification = { title: '', level, message: this.message }; // notification object
                this.$store.commit('setNotification', notification);
                this.$store.commit('setNotificationStatus', true); // activate notification
              },
            );
          } else {
            this.$router.push('/auth');
          }
        } else {
          const level = 3;
          this.message = 'Invalid Phone Number';
          const notification = { title: '', level, message: this.message }; // notification object
          this.$store.commit('setNotification', notification);
          this.$store.commit('setNotificationStatus', true);
        }
      } else {
        const level = 3;
        this.message = 'Provide all details';
        const notification = { title: '', level, message: this.message }; // notification object
        this.$store.commit('setNotification', notification);
        this.$store.commit('setNotificationStatus', true);
      }
    },
  },
};
</script>

<style lang="css">
@import "../../../../node_modules/vue-tel-input/dist/vue-tel-input.css";

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
        border-bottom: 1px solid #1782c5;
        padding-bottom: 2px;
    }

    .my-profile__inner__menu__link {
        color: #1782c5;
        text-transform: uppercase;
        text-align: center;
        padding: 2px 25px;
        font-size: 17px;
    }

    .my-profile__inner__menu__selected {
        font-weight: 400;
        border-bottom: 3px solid #1782c5;
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
        font-family: inherit;
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
</style>
