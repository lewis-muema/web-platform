<template lang="html">
  <div class="complete-outer">
    <div class="complete-header">
      {{$t('completeComponent.congrats')}}
    </div>
    <div class="complete-contents">
      <div class="complete-pair">
        <p>{{$t('completeComponent.enjoy_services')}}</p>
        <p v-if="getPerEmail !== ''">
          {{$t('completeComponent.double_convinience')}}
        </p>
      </div>
      <div
        v-if="getPerEmail !== ''"
        class="complete-pair"
      >
        <p>
          {{$t('completeComponent.account_connected')}}
        </p>
        <p>{{$t('completeComponent.login_account')}}</p>
      </div>
      <div
        v-else
        class="complete-pair"
      >
        <p>
          {{$t('completeComponent.account_created')}}
        </p>
        <p>{{$t('completeComponent.login_any_time')}}</p>
      </div>
      <div class="complete-pair">
        <p>{{ getBizName }}: {{ getBizEmail }}</p>
        <p v-if="getPerEmail !== ''">
          {{$t('completeComponent.personal')}}: {{ getPerEmail }}
        </p>
      </div>
    </div>
    <div class="complete-continue">
      <a
        class="btn-submit mid"
        @click="directSignInViaAuth"
      >
        {{ login_text }}
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';
import SessionMxn from '../../../mixins/session_mixin';

export default {
  name: 'CompleteComponent',
  mixins: [NotificationMxn, SessionMxn],
  data() {
    return {
      login_text: this.$t('completeComponent.continue'),
    };
  },
  computed: {
    ...mapGetters({
      getBizName: '$_external/getBizName',
      getBizEmail: '$_external/getBizEmail',
      getBaseUrl: '$_external/getBaseUrl',
      getPerEmail: '$_external/getPerEmail',
      getPass: '$_external/getPass',
    }),
  },
  methods: {
    ...mapActions({
      requestSignUpSegmentation: '$_auth/requestSignUpSegmentation',
      authSignIn: '$_external/requestSignIn',
    }),
    directSignInViaAuth() {
      this.deleteSession();
      this.login_text = this.$t('completeComponent.login_in');
      const params = {
        email: this.getBizEmail,
        password: this.getPass,
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
              this.login_text = this.$t('completeComponent.continue');
              this.doNotification(2, this.$t('completeComponent.login_failed'), this.$t('completeComponent.login_failed_text'));
            } else {
              this.login_text = this.$t('completeComponent.continue');
              this.doNotification(2, this.$t('completeComponent.login_failed'), this.$t('completeComponent.account_deactivated'));
            }
          } else {
            try {
              if (response) {
                const refreshToken = response.refresh_token;
                const accessToken = response.access_token;
                // eslint-disable-next-line max-len
                // TODO change from using local storage as session trust store. malicious js will read the data
                localStorage.setItem('jwtToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                const partsOfToken = accessToken.split('.');
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

                /* global mixpanel */

                if ('default' in sessionData && analyticsEnv === 'production') {
                  const acc = sessionData[sessionData.default];

                  this.$mixpanel.people.set_once({
                    $email: acc.user_email,
                    $phone: acc.user_phone,
                    'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
                    $name: acc.user_name,
                    'Client Type': 'Web Platform - Cop Invitation',
                  });

                  // login identify
                  this.$mixpanel.identify(acc.user_email);
                  analytics.identify(`${sessionData.default}_${acc.user_id}`, {
                    name: `${acc.user_name}`,
                    email: `${acc.user_email}`,
                  });

                  // track login
                  this.$mixpanel.track('User Login', {
                    'Account Type': acc.default === 'peer' ? 'Personal' : 'Business',
                    'Last Login': new Date(),
                    'Client Type': 'Web Platform - Cop Invitation',
                  });
                }
                this.$router.push('/orders');
              }
            } catch (error) {
              // @todo Log the error (central logging)
            }
          }
        },
        (error) => {
          this.login_text = this.$t('completeComponent.continue');
          this.doNotification(2, this.$t('completeComponent.login_failed'), this.$t('completeComponent.login_failed_text'));
          this.$router.push('/auth/sign_in');
        },
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
.complete-outer
{
  margin: 1% 10%;
}
.complete-header
{
  font-size: 28px;
  text-align: center;
  font-weight: 500;
  margin-bottom: 30px;
}
.complete-contents
{
  font-size: initial;
  text-align: center;
}
.complete-pair
{
  margin-bottom: 30px;
}
.complete-continue
{
  display: flex;
  margin-top: 5%;
  padding-top: 5%;
  border-top: 1px solid #c2c3c4;
  align-items: center;
  justify-content: center;
}
.mid
{
  text-align: center;
  height: 40px;
  padding-top: 1%;
}
</style>
