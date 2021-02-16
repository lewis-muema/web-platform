<template lang="html">
  <div class="terms-main">
    <div v-if="checkFreightStatus() === 0">
      <div class="terms-header">
        Our terms of services
      </div>
      <div class="terms-inner">
        <iframe
          src="https://sendy-web-apps-assets.s3-eu-west-1.amazonaws.com/t%26cs/FreightTermsandConditions_transporter.html"
          frameBorder="0"
          width="100%"
          height="100%"
        />
      </div>
      <div class="freight-terms">
        <input
          v-model="u_terms"
          type="checkbox"
          name="u_terms"
          class="hiddeny"
        >
        <span class="sign-holder__smaller">
          I acknowledge that i have read and understood the terms of service
        </span>
      </div>
      <div class="next-terms-holder-btn">
        <input
          placeholder="Submit"
          class="button-primary terms-btn-color next-freight-submit"
          type="submit"
          name="login_text"
          @click="submit"
        >
      </div>
    </div>
    <div v-if="checkFreightStatus() === 1">
      <div class="approval-card">
        <div class="">
          <div class="warning-icon-pstn">
            <i class="el-icon-success warning-icon" />
          </div>
          <div class="cancelOptions--content-message verification-header">
            Your Application has been submitted
          </div>
          <div class="cancelOptions--content-message verification-description">
            Thanks {{ logged_user }} we have received your registration.
          </div>
          <div class="cancelOptions--content-message verification-description">
            Our customer representative will contact you within 24 hrs with the next steps to
            activate your account and get you started.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SessionMxn from '../../mixins/session_mixin';
import NotificationMxn from '../../mixins/notification_mixin';

export default {
  name: 'TermsAndCondition',
  mixins: [SessionMxn, NotificationMxn],

  data() {
    return {
      u_terms: false,
      terms: true,
      logged_user: '',
    };
  },
  mounted() {
    this.loggedUser();
  },
  methods: {
    ...mapActions({
      updateFreightStatus: '$_freight/updateFreightStatus',
    }),
    loggedUser() {
      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        const fullName = session[session.default].user_name.split(' ');
        const firstName = fullName[0];
        this.logged_user = firstName;
      }
    },
    checkFreightStatus() {
      const session = this.$store.getters.getSession;
      let resp = 0;
      if (Object.prototype.hasOwnProperty.call(session[session.default], 'freight_status')) {
        if (session[session.default].freight_status === 2) {
          this.$router.push('/freight/transporters');
        } else {
          resp = session[session.default].freight_status;
        }
      } else {
        resp = 0;
      }
      return resp;
    },
    submit() {
      if (this.u_terms) {
        const session = this.$store.getters.getSession;
        let fullPayload = {};
        if (session.default === 'biz') {
          const bizPayload = {
            cop_id: session[session.default].cop_id,
            cop_name: session[session.default].cop_name,
            cop_contact_person: session[session.default].cop_contact_person,
            cop_email: session[session.default].cop_biz_email,
            cop_phone: session[session.default].cop_biz_phone,
            freight_status: 1,
          };
          fullPayload = {
            values: bizPayload,
            app: 'NODE_PRIVATE_API',
            endpoint: 'update_cop',
          };
        } else {
          const peerPayload = {
            user_id: session[session.default].user_id,
            freight_status: 1,
          };
          fullPayload = {
            values: peerPayload,
            app: 'NODE_PRIVATE_API',
            endpoint: 'update_user',
          };
        }
        this.updateFreightStatus(fullPayload).then(
          (response) => {
            let workingResponse = response;
            if (response.length > 1) {
              workingResponse = response[0];
            }

            if (workingResponse.status) {
              const updatedSession = session;
              updatedSession[session.default].freight_status = 1;

              const newSession = JSON.stringify(updatedSession);
              this.setSession(newSession);
              this.$router.push('/freight/verify');
              const level = 1; // success
              this.message = 'Terms and Conditions accepted!';
              const notification = {
                title: '',
                level,
                message: this.message,
              }; // notification object
              this.displayNotification(notification);
            } else {
              const level = 3;
              this.message = 'Something went wrong.';
              const notification = {
                title: '',
                level,
                message: this.message,
              }; // notification object
              this.displayNotification(notification);
            }
          },
          () => {
            const level = 3;
            this.message = 'Something went wrong.';
            const notification = {
              title: '',
              level,
              message: this.message,
            }; // notification object
            this.displayNotification(notification);
          },
        );
      } else {
        this.doNotification(2, 'Freight final setup failed', 'Agree to Terms and Conditions');
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
  },
};
</script>

<style lang="css">
.terms-main {
  text-align: center;
  border: 0px solid #ccc;
  margin: 7%;
}

.terms-inner {
  border: 1px solid #A29D9D;
  border-radius: 4px;
  margin: 2rem auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
  height: 25rem;
}

.terms-header {
  font-weight: 500;
  text-align: left;
  font-family: 'Nunito', sans-serif;
  font-size: 18px;
  line-height: 0px;
  display: flex;
  align-items: center;
  color: #000000;
}
.freight-terms{
  text-align: left;
  font-size: 14px;
  line-height: 5px;
  color: #000000;
}
.next-terms-holder-btn {
  margin-top: 2%;
  padding-bottom: 4% !important;
}
.terms-btn-color {
 border-width: 0px !important;
}
.next-freight-submit {
  width: 15%;
}
.approval-card{
  max-width: 24rem;
  border: 1px solid #d8dfe6;
  border-radius: 4px;
  margin: 1rem auto;
  padding: 2rem;
  font-family: 'Nunito', sans-serif;
}
.warning-icon{
  font-size: 57px !important;
  color: #1B7FC3 !important;
}
.warning-icon-pstn{
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 14%;
}
.cancelOptions--content-message {
  margin: 15px;
  margin-bottom: 30px;
}
.verification-header{
  font-size: 16px;
  text-align: center;
  color: #000000;
}
.verification-description{
  font-size: 14px;
  text-align: center;
  color: #343232;
}
</style>
