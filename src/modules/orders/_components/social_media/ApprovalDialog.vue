/* eslint-disable max-len */ "use strict";
<template lang="html">
  <div class="cancel-pop-up">
    <el-dialog
      width="30%"
      class="social-media-approval--dialog"
      :modal-append-to-body="false"
      :visible.sync="showDialog"
    >
      <div class="approval--dialog-wrap">
        <div
          v-if="approvalStatus === 0"
          class="dialog--application-received"
        >
          <div class="dialog--title-image">
            <img src="../../../../assets/img/sendy-biker.png">
          </div>
          <div class="dialog--title-text">
            Your application has been received
          </div>
          <div class="dialog--content-text">
            <p>
              By filling out that you are a social commerce business, you will be enrolled to the
              Sendy Social Club (after verification).
            </p>
            <p>
              You will enjoy discounted prices, exclusive trainings, events and other benefits
              intended to help you grow your business.
            </p>
          </div>
        </div>
        <div
          v-if="approvalStatus === 1"
          class="dialog--application-approved"
        >
          <div class="dialog--title-image">
            <img
              src="../../../../assets/img/happy-smiley.png"
              class="image--smiley"
            >
          </div>
          <div class="dialog--title-text">
            Your application has been approved
          </div>
          <div class="dialog--content-text">
            <p>
              Congrats! your application to join the Sendy Social Club has been approved. You will
              now enjoy discounted prices on your orders among other benefits.
            </p>
          </div>
        </div>
        <div
          v-if="approvalStatus === 2"
          class="dialog--application-rejected"
        >
          <div class="dialog--title-image">
            <img
              src="../../../../assets/img/sad-smiley.png"
              class="image--smiley"
            >
          </div>
          <div class="dialog--title-text">
            Your application has been declined
          </div>
          <div class="dialog--content-text">
            <p>
              Sorry, your application to join the Sendy social club has been declined. Your business
              doesn’t qualify as a social commerce business, however, you can still place Sendy
              orders
            </p>
          </div>
        </div>

        <div class="dialog--submit-button">
          <input
            class="button-primary final-step-submit"
            type="submit"
            value="Okay"
            @click="updateApprovalView"
          >
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import SessionMxn from '../../../../mixins/session_mixin';

export default {
  name: 'ApprovalDialog',
  mixins: [SessionMxn],

  props: {
    approvalStatus: {
      type: Number,
      default: 0,
    },
    copId: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  data() {
    return {
      showDialog: true,
    };
  },

  computed: {
    ...mapGetters({
      get_session: 'getSession',
    }),
  },
  methods: {
    updateApprovalView() {
      this.showDialog = false;

      if (this.approvalStatus !== 0) {
        const fullPayload = {
          values: { social_media_business_approval_status: 2 },
          app: 'ADONIS_PRIVATE_API',
          endpoint: `cop-update/${this.copId}`,
        };
        this.updateSocialApprovalStatus(fullPayload).then((res) => {
          console.log('socialResponse', res);

          // uppdate session
          const session = this.$store.getters.getSession;
          const updatedSession = session;
          updatedSession[session.default].social_media_business_approval_status = 2;
          const newSession = JSON.stringify(updatedSession);
          this.setSession(newSession);
        });
      }
    },
    ...mapActions({
      updateSocialApprovalStatus: '$_orders/updateSocialApprovalStatus',
    }),
  },
};
</script>

<style lang="css" scoped>
.dialog--title-image img {
    height: 200px;
    margin: auto;
    width: auto;
}
.dialog--title-image .image--smiley {
    height: 80px;
    margin: 10px;
}
.approval--dialog-wrap {
    text-align: center;
}
.dialog--title-text {
    font-weight: 500;
    font-size: 15px;
}
.dialog--submit-button {
    width: 150px;
    margin: auto;
}
</style>
