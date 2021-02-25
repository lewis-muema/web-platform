<template lang="html">
  <div class="new-card2">
    <div
      class="help-card"
      style="width:400px;margin-left:30%;margin-top:30px;"
    >
      <p style="margin-bottom: 20px;">
        <label class="input-descript">
          <span>Old Password</span>
        </label>
        <input
          v-model="old_password"
          name="old_password"
          type="password"
          class="form-control profile-dimen"
        >
      </p>
      <p style="margin-bottom: 20px;">
        <label class="input-descript">
          <span>New Password</span>
        </label>
        <input
          v-model="new_password"
          type="password"
          name="new_password"
          class="form-control profile-dimen"
        >
      </p>
      <p style="margin-bottom: 20px;">
        <label class="input-descript">
          <span>Confirm Password</span>
        </label>
        <input
          v-model="confirm_password"
          type="password"
          name="confirm_password"
          class="form-control profile-dimen"
        >
      </p>
      <p>
        <br>
        <input
          type="submit"
          class="button-primary btn-content"
          value="Update"
          @click="update_password"
        >
      </p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SessionMxn from '../../../mixins/session_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  name: 'ChangePassword',
  mixins: [SessionMxn, NotificationMxn],
  data() {
    return {
      old_password: '',
      new_password: '',
      confirm_password: '',
      message: '',
    };
  },
  methods: {
    ...mapActions({
      requestChangePassword: '$_user/requestChangePassword',
    }),

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
    update_password() {
      if (this.old_password !== '' && this.new_password !== '' && this.confirm_password !== '') {
        if (this.new_password !== this.confirm_password) {
          const level = 3;
          this.message = 'Password does not match. Please try again';
          const notification = { title: '', level, message: this.message }; // notification object
          this.displayNotification(notification);
        } else {
          let acc = {};
          const session = this.$store.getters.getSession;
          if ('default' in session) {
            acc = session[session.default];
          }

          const payload = {
            old_password: this.old_password,
            new_password: this.new_password,
            password: this.confirm_password,
          };

          if (session.default === 'biz') {
            payload.cop_user_id = acc.user_id;
          } else {
            payload.user_id = acc.user_id;
          }

          const fullPayload = {
            values: payload,
            vm: this,
            app: 'NODE_PRIVATE_API',
            endpoint: 'update_user',
          };

          this.requestChangePassword(fullPayload).then(
            (response) => {
              if (response.status) {
                this.trackMixpanelEvent('Change Password');

                const level = 1; // success
                this.message = 'Password Changed. You will be redirected to the login page within 5 seconds';
                const notification = { title: 'Password Change', level, message: this.message }; // notification object
                this.displayNotification(notification);
                setTimeout(() => {
                  this.deleteSession();
                  this.$router.push('/auth/sign_in');
                }, 5000);
              } else {
                const level = 3;
                this.message = 'Something went wrong.';
                const notification = { title: '', level, message: this.message }; // notification object
                this.displayNotification(notification);
              }
            },
            (error) => {
              const level = 3;
              this.message = 'Something went wrong.';
              const notification = { title: '', level, message: this.message }; // notification object
              this.displayNotification(notification);
            },
          );
        }
      } else {
        const level = 3;
        this.message = 'Provide all values.';
        const notification = { title: '', level, message: this.message };
        this.displayNotification(notification);
      }
    },
  },
};
</script>

<style lang="css">
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

.profile-dimen {
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
    border-width: 0px !important;
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

.change-password-error {
    height: 0px;
}
</style>
