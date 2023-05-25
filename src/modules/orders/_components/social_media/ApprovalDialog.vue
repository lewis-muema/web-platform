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
            {{$t('approvalDialogue.your_application_has_been_recieved')}}
          </div>
          <div class="dialog--content-text">
            <p>
              {{$t('approvalDialogue.by_filling_social_commerce_business')}}
            </p>
            <p>
              {{$t('approvalDialogue.enjoy_discounted_prices')}}
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
             {{$t('approvalDialogue.your_application_has_been_approved')}}
          </div>
          <div class="dialog--content-text">
            <p>
            {{$t('approvalDialogue.congrats_your_application_has_been_approved')}}
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
            {{$t('approvalDialogue.your_application_has_been_declined')}}
          </div>
          <div class="dialog--content-text">
            <p>
            {{$t('approvalDialogue.sorry_your_application_declined')}}
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
  name: 'SocialApprovalDialog',
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
