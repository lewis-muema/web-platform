<template lang="html">
  <div class="screen-three">
    <div class="onboarding-user-header">
      {{$t('passwordValidation.set_password')}}
    </div>
    <div class="form-inputs">
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>{{$t('passwordValidation.create_password')}}</span>
          </label>
          <input
            id="password"
            v-model="password"
            class="form-control"
            type="password"
            :placeholder="$t('passwordValidation.enter_password')"
            @focus="setCurrentStep(1)"
          >
        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>{{$t('passwordValidation.confirm_password')}}</span>
          </label>
          <input
            id="password"
            v-model="cpassword"
            class="form-control"
            type="password"
            :placeholder="$t('passwordValidation.confirm_your_password')"
            @focus="setCurrentStep(2)"
          >
        </div>
      </div>
    </div>
    <div class="divide" />
    <div class="form-submits">
      <a
        class="waves-effect waves-teal btn-flat"
        @click="last_view"
      >
        {{$t('passwordValidation.back')}}
      </a>
      <button
        class="btn-submit"
        style="width:30% !important;"
        name="next"
        :disabled="!is_valid"
        @click="next_view"
      >
        {{$t('passwordValidation.Next')}}
      </button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  name: 'PasswordValidationComponent',
  mixins: [NotificationMxn],
  data() {
    return {
      password: '',
      cpassword: '',
    };
  },
  methods: {
    ...mapMutations({
      setViewState: '$_external/setViewState',
      updatePassPlain: '$_external/updatePassPlain',
      updateViewStep: '$_external/updateViewStep',
    }),
    ...mapActions({
      requestInvitation: '$_external/requestInvitation',
    }),
    next_view() {
      if (this.password !== this.cpassword) {
        this.doNotification(2, this.$t('passwordValidationComponent.set_password'), $t('passwordValidationComponent.not_match'));
      } else {
        let payload = {};
        this.updatePassPlain(this.cpassword);
        if (this.getType === 0) {
          const cop_id = this.getCopId;
          // let user_id = this.getCopUserId ;
          const pass = this.cpassword;
          const name = this.getName;
          const biz_email = this.getBizEmail;
          const personal_email = this.getPerEmail === '' ? null : this.getPerEmail;
          const phone = this.getPhone;
          const type = this.getType;
          const department_id = this.getDeptId;
          const cop_user_id = this.getCopUserId;

          payload = {
            cop_id,
            password: pass,
            name,
            biz_email,
            personal_email,
            phone,
            type,
            department_id,
            cop_user_id,
          };
        } else if (this.getType === 1) {
          const cop_id = this.getCopId;
          const pass = this.cpassword;
          const name = this.getName;
          const biz_email = this.getBizEmail;
          const personal_email = this.getPerEmail === '' ? null : this.getPerEmail;
          const phone = this.getPhone;
          const type = this.getType;
          const department_id = this.getDeptId;

          payload = {
            cop_id,
            password: pass,
            name,
            biz_email,
            personal_email,
            phone,
            type,
            department_id,
          };
        }

        const fullPayload = {
          values: payload,
          vm: this,
          app: 'NODE_PRIVATE_API',
          endpoint: 'onboard_user',
        };

        this.requestInvitation(fullPayload).then(
          (response) => {
            if (response.length > 0) {
              response = response[0];
            }

            if (response.status) {
              this.setViewState(4);
              this.updateViewStep(0);
              this.trackMixpanelEvent('Account SetUp - Cop Invitation ', {
                'User Name': this.getName,
                'Cop User Email ': this.getBizEmail,
                'Personal Email ': this.getPerEmail,
                Platform: 'Web',
                'Cop Account': `SENDY ${this.getCopId}`,
                'Department Id': this.getDeptId,
              });
            } else {
              this.$router.push('/auth');
            }
          },
          (error) => {
            const resp = error.response.data;
            const notification = { level: 2, title: 'Onboarding Error !', message: resp.message }; // notification object
            this.$store.commit('setNotification', notification);
            this.$store.commit('setNotificationStatus', true);
          },
        );
      }
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
          this.$mixpanel.track(name);
        }
      } catch (er) {
        // ...
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

    last_view() {
      this.setViewState(2);
      this.updateViewStep(0);
    },
    setCurrentStep(step) {
      this.updateViewStep(step);
    },
  },
  computed: {
    is_valid() {
      return this.cpassword != '' && this.password != '';
    },
    ...mapGetters({
      getName: '$_external/getName',
      getBizEmail: '$_external/getBizEmail',
      getPerEmail: '$_external/getPerEmail',
      getPhone: '$_external/getPhone',
      getType: '$_external/getType',
      getDeptId: '$_external/getDeptId',
      getCopId: '$_external/getCopId',
      getCopUserId: '$_external/getCopUserId',
    }),
  },
};
</script>

<style lang="css">
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
.input-field2{
  width: 76%;
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
  width: 80%;
  font-size: 16px;
  margin: 0 0 8px 0;
  padding: 0;
}
.input-descript{
  margin: 0 0 .25rem;
 display: block;
 font-size: 1rem;
 line-height: 1.5rem;
 font-weight: 400!important;
 margin-bottom: .5rem!important;
}
</style>
