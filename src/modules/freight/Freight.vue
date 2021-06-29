<template lang="html">
  <div class="">
    <div
      id="orders_container"
      class="box"
    >
      <transition
        name="fade"
        mode="out-in"
      >
        <div class="final-set-up-pop">
          <el-dialog
            :visible.sync="updateCrmData"
            width="30%"
            class="updateCrmDialog"
            :before-close="handleClose"
            :modal-append-to-body="false"
          >
            <div class="finish-setup-outer">
              <p class="crm-setup">
                {{ $t('freight.finish_freight') }}
              </p>
              <div class="">
                <div
                  v-if="acc_type === 'biz' && updateSetIndustry"
                  class=""
                >
                  <label class="final-label">{{ $t('freight.industry') }}</label>
                  <div class="final-upper-padding">
                    <el-select
                      v-model="industry_type"
                      :placeholder="$t('general.select')"
                      class="compliance-select-final"
                    >
                      <el-option
                        v-for="item in industriesOptions"
                        :key="item.industry_id"
                        :label="item.name"
                        :value="item.industry_id"
                      />
                    </el-select>
                  </div>
                </div>

                <div
                  v-if="acc_type === 'peer' && updatePeerId"
                  class="final-upper-padding"
                >
                  <label class="final-label">{{ $t('freight.id_no') }}</label>
                  <div class="final-upper-padding">
                    <input
                      v-model="id_number"
                      class="input-control upgrade-final"
                      type="text"
                      name="id_number"
                      :placeholder="$t('freight.id_no_placeholder')"
                      autocomplete="on"
                    >
                  </div>
                </div>

                <div
                  v-if="updateKraSection"
                  class="final-upper-padding"
                >
                  <label class="final-label">{{ userKraNoLabel }}</label>
                  <div class="final-upper-padding">
                    <input
                      v-model="kra_pin"
                      class="input-control upgrade-final"
                      type="text"
                      name="kra_pin"
                      :placeholder="userKraNoPlaceholder"
                      autocomplete="on"
                    >
                    <span
                      v-show="!kraPinValidation(kra_pin)"
                      class="invalid-kra"
                    >
                      {{ kraFailResponse }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="acc_type === 'biz' && updateBizRegistration"
                  class="final-upper-padding"
                >
                  <label class="final-label">{{ userBizRgLabel }}</label>
                  <div class="final-upper-padding">
                    <input
                      v-model="biz_registration"
                      class="input-control upgrade-final"
                      type="text"
                      name="biz_registration"
                      :placeholder="userBizRgPlaceholder"
                      autocomplete="on"
                    >
                    <span
                      v-show="!bizRegValidation(biz_registration)"
                      class="invalid-kra"
                    >
                      {{ bizRegFailResponse }}
                    </span>
                  </div>
                </div>

                <div class="">
                  <input
                    class="button-primary final-step-submit"
                    type="submit"
                    :value="$t('general.submit')"
                    @click="submit"
                  >
                </div>
              </div>
            </div>
          </el-dialog>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapGetters, mapActions } from 'vuex';
import SessionMxn from '../../mixins/session_mixin';
import NotificationMxn from '../../mixins/notification_mixin';
import MixpanelMixin from '../../mixins/mixpanel_events_mixin';
import ValidationMixin from '../../mixins/validation_mixin';

export default {
  name: 'Freight',
  mixins: [SessionMxn, NotificationMxn, MixpanelMixin, ValidationMixin],
  data() {
    return {
      id_number: '',
      kra_pin: '',
      biz_registration: '',
      industry_type: '',
      industriesOptions: [],
      updateCrmData: false,
      updateKraSection: false,
      updateSetIndustry: false,
      updateBizRegistration: false,
      updatePeerId: false,
      tax_compliance: false,
    };
  },
  computed: {
    ...mapGetters({
      get_session: 'getSession',
    }),
    valid_kra_pin() {
      const pin = this.kra_pin;
      const session = this.$store.getters.getSession;

      if (pin !== '') {
        if (session[session.default].country_code === 'KE') {
          return /^[apAP]\d{9}[a-zA-Z]$/.test(pin);
        } if (session[session.default].country_code === 'CI') {
          return /^[0-9]{7}[A-Z]{1}$/.test(pin);
        }
        return /^\d{10}$/.test(pin);
      }
      return true;
    },
    fetchKraHeader() {
      let kraName = this.$t('freight.tin_no');
      const session = this.$store.getters.getSession;
      if (session[session.default].country_code === 'KE') {
        kraName = this.$t('freight.kra_pin');
      }
      let resp = this.$t('freight.enter_biz') + kraName;
      if (session.default === 'peer') {
        resp = this.$t('freight.enter_your') + kraName;
      }
      return resp;
    },
    kraFailResponse() {
      let resp = this.$t('freight.valid_tin_no');
      const session = this.$store.getters.getSession;
      if (session[session.default].country_code === 'KE') {
        resp = this.$t('freight.valid_kra');
      }
      return resp;
    },
    acc_type() {
      const session = this.$store.getters.getSession;
      return session.default;
    },
  },
  watch: {
    get_session: {
      handler() {
        this.$router.push('/freight');
      },
      deep: true,
    },
  },

  created() {},
  mounted() {
    this.initiatePage();
    this.checkSession();
  },
  methods: {
    ...mapActions({
      requestIndustries: '$_orders/requestIndustries',
      updateFreightInformation: '$_freight/updateFreightStatus',
    }),

    ...mapMutations({}),
    checkSession() {
      const session = this.$store.getters.getSession;
      const sessionData = Object.keys(session).length;
      if (sessionData === 0) {
        const notification = {
          title: this.$t('freight.session_expired'),
          level: 2,
          message: this.$t('freight.redirected'),
        };
        this.displayNotification(notification);
        setTimeout(() => {
          localStorage.removeItem('_sessionSnack');
          localStorage.removeItem('jwtToken');
          this.$router.replace({ name: 'sign_in' });
        }, 5000);
      }
    },
    initiatePage() {
      this.KraFrefill();
      this.bizRegistrationFrefill();
      this.peerIdFrefill();
      this.isNewCopAcc();
      this.industryFrefill();
    },
    KraFrefill() {
      const session = this.$store.getters.getSession;
      if (
        Object.keys(session).length > 0
        && Object.prototype.hasOwnProperty.call(session[session.default], 'tax_authority_pin')
      ) {
        this.kra_pin = session[session.default].tax_authority_pin;
        if (session[session.default].tax_authority_pin === null) {
          this.tax_compliance = false;
          this.kra_pin = '';
        } else if (
          session[session.default].tax_authority_pin !== ''
          && !this.kraPinValidation(this.kra_pin)
        ) {
          this.tax_compliance = false;
          this.kra_pin = session[session.default].tax_authority_pin;
        } else if (session[session.default].tax_authority_pin !== '') {
          this.tax_compliance = true;
          this.kra_pin = session[session.default].tax_authority_pin;
        } else {
          this.tax_compliance = false;
          this.kra_pin = '';
        }
      }
    },
    industryFrefill() {
      const session = this.$store.getters.getSession;
      if (
        Object.keys(session).length > 0
        && Object.prototype.hasOwnProperty.call(session[session.default], 'industry_id')
      ) {
        if (session.default === 'biz') {
          if (session[session.default].industry_id === null) {
            this.industry_type = '';
          } else {
            this.industry_type = session[session.default].industry_id;
          }
        }
      }
    },
    bizRegistrationFrefill() {
      const session = this.$store.getters.getSession;
      if (
        Object.keys(session).length > 0
        && Object.prototype.hasOwnProperty.call(session[session.default], 'company_reg_no')
      ) {
        if (session.default === 'biz') {
          if (session[session.default].company_reg_no === null) {
            this.biz_registration = '';
          } else {
            this.biz_registration = session[session.default].company_reg_no;
          }
        }
      }
    },
    peerIdFrefill() {
      const session = this.$store.getters.getSession;
      if (
        Object.keys(session).length > 0
        && Object.prototype.hasOwnProperty.call(session[session.default], 'id_no')
      ) {
        if (session.default === 'peer') {
          if (session[session.default].id_no === null) {
            this.id_number = '';
          } else {
            this.id_number = session[session.default].id_no;
          }
        }
      }
    },
    handleClose() {
      this.$router.push('/orders');
      this.id_number = '';
      this.kra_pin = '';
      this.biz_registration = '';
      this.industry_type = '';
    },
    isNewCopAcc() {
      let isSet = false;
      let kraSection = false;
      let setIndustry = false;
      let bizRegistration = false;
      let peerId = false;

      const session = this.$store.getters.getSession;
      if (Object.keys(session).length > 0) {
        if (
          (session.default === 'biz' && session[session.default].user_type === 2)
          || session.default === 'peer'
        ) {
          // Admin and Peer users

          if (
            session[session.default].primary_business_unit === 0
            || session[session.default].primary_business_unit === null
          ) {
            isSet = true;
            kraSection = true;
          }
          if (
            session[session.default].industry_id === null
            || session[session.default].industry_id === ''
          ) {
            isSet = true;
            setIndustry = true;
            this.fetchIndustries();
          }
          if (
            session[session.default].tax_authority_pin === null
            || session[session.default].tax_authority_pin === ''
            || (session[session.default].tax_authority_pin !== ''
              && !this.kraPinValidation(this.kra_pin))
          ) {
            isSet = true;
            kraSection = true;
          }
          if (
            session[session.default].company_reg_no === null
            || session[session.default].company_reg_no === ''
            || (session[session.default].company_reg_no !== ''
              && !this.bizRegValidation(this.biz_registration))
          ) {
            isSet = true;
            bizRegistration = true;
          }
          if (session[session.default].id_no === null || session[session.default].id_no === '') {
            isSet = true;
            peerId = true;
          }
        }
      }
      this.updateCrmData = isSet;
      this.updateKraSection = kraSection;
      this.updateSetIndustry = setIndustry;
      this.updateBizRegistration = bizRegistration;
      this.updatePeerId = peerId;

      if (!isSet) {
        this.$router.push('/freight/verify');
      } else {
        this.trackMixpanelEvent('Freight Application Started', {
          userId: session[session.default].user_id,
          email: session[session.default].user_email,
          phone: session[session.default].user_phone,
          name: session[session.default].user_name,
          clientType: 'Web',
          clientMode: session.default === 'peer' ? 'Peer' : 'Cop',
          device: 'Desktop',
        });
      }
    },
    fetchIndustries() {
      const payload = {
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'industries?isActive=1',
      };
      this.requestIndustries(payload).then(
        (response) => {
          this.industriesOptions = response;
        },
        // eslint-disable-next-line no-unused-vars
        (error) => {
          this.industriesOptions = [];
        },
      );
    },
    submit() {
      const session = this.$store.getters.getSession;
      if (session.default === 'biz') {
        this.submitBizData();
      } else {
        this.submitPeerData();
      }
    },
    submitBizData() {
      const session = this.$store.getters.getSession;
      if (this.kra_pin === '' || (this.kra_pin !== '' && !this.kraPinValidation(this.kra_pin))) {
        this.doNotification(2, this.$t('freight.final_setup_error'), this.kraFailResponse);
      } else if (this.industry_type === '') {
        this.doNotification(
          2,
          this.$t('freight.final_setup_error'),
          this.$t('freight.select_industry'),
        );
      } else if (
        this.biz_registration === ''
        || (this.biz_registration !== '' && !this.bizRegValidation(this.biz_registration))
      ) {
        this.doNotification(2, this.$t('freight.final_setup_error'), this.bizRegFailResponse);
      } else {
        const payload = {
          cop_id: session[session.default].cop_id,
          cop_name: session[session.default].cop_name,
          cop_contact_person: session[session.default].cop_contact_person,
          cop_email: session[session.default].cop_biz_email,
          cop_phone: session[session.default].cop_biz_phone,
          tax_authority_pin: this.kra_pin,
          industry_id: this.industry_type,
          company_reg_no: this.biz_registration,
        };
        const fullPayload = {
          values: payload,
          app: 'NODE_PRIVATE_API',
          endpoint: 'update_cop',
        };
        this.finalUpdate(fullPayload);
      }
    },
    submitPeerData() {
      const session = this.$store.getters.getSession;

      if (this.kra_pin === '' || (this.kra_pin !== '' && !this.kraPinValidation(this.kra_pin))) {
        this.doNotification(2, this.$t('freight.final_setup_error'), this.kraFailResponse);
      } else if (this.id_number === '') {
        this.doNotification(
          2,
          this.$t('freight.final_setup_error'),
          this.$t('freight.enter_id_no'),
        );
      } else {
        const payload = {
          user_id: session[session.default].user_id,
          tax_authority_pin: this.kra_pin,
          id_no: this.id_number,
        };
        const fullPayload = {
          values: payload,
          app: 'NODE_PRIVATE_API',
          endpoint: 'update_user',
        };
        this.finalUpdate(fullPayload);
      }
    },
    finalUpdate(fullPayload) {
      const session = this.$store.getters.getSession;
      this.updateFreightInformation(fullPayload).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            /* eslint prefer-destructuring: ["error", {VariableDeclarator: {object: true}}] */
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            const updatedSession = session;
            if (session.default === 'biz') {
              updatedSession[session.default].tax_authority_pin = this.kra_pin;
              updatedSession[session.default].industry_id = this.industry_type;
              updatedSession[session.default].company_reg_no = this.biz_registration;
            } else {
              updatedSession[session.default].tax_authority_pin = this.kra_pin;
              updatedSession[session.default].id_no = this.id_number;
            }

            const newSession = JSON.stringify(updatedSession);
            this.setSession(newSession);
            const level = 1; // success
            this.message = this.$t('freight.info_accepted');
            const notification = {
              title: '',
              level,
              message: this.message,
            }; // notification object
            this.displayNotification(notification);
            this.trackMixpanelEvent('Freight Application Submitted', {
              userId: session[session.default].user_id,
              email: session[session.default].user_email,
              phone: session[session.default].user_phone,
              name: session[session.default].user_name,
              clientType: 'Web',
              clientMode: session.default === 'peer' ? 'Peer' : 'Cop',
              device: 'Desktop',
            });
            this.$router.push('/freight/verify');
          } else {
            const level = 3;
            this.message = this.$t('freight.something_wrong');
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
          this.message = this.$t('freight.something_wrong');
          const notification = {
            title: '',
            level,
            message: this.message,
          }; // notification object
          this.displayNotification(notification);
        },
      );
    },

    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css">
@import '../../assets/styles/section_headers.css';
.module-container {
  margin: 8px;
}

.title {
  font-size: 22px;
  padding-bottom: 0px;
  border-bottom: 1px solid #ccc;
  color: #999;
  padding-top: 15px;
  margin-bottom: 30px;
}
.updateCrmDialog{

}
.final-set-up-pop > div > div > div.el-dialog__body{
  padding-top: 0 !important;
}
.crm-setup{
  font-size: 19px;
  color: #000000;
  font-weight: 400;
}
final-set-up-pop > div > div > div.el-dialog__header{
  padding-top: 0 !important;
}
.compliance-select-final{
  width: 100% !important;
}
.upgrade-final{
  width: 100% !important;
  margin-bottom: 2%;
}
.final-step-submit{
  margin-top: 6% !important;
  width: 100% !important;
}
.final-label{
 margin-bottom: 2%;
 font-size: 14px;
 font-weight: 200;
 color: #000;
}
.final-inner{
 font-size: 12px;
 color: #8F8F8F;
 margin-bottom: 0;
}
.invalid-kra {
  display: block;
  color: #f57f20;
  font-size: 14px;
}
.final-upper-padding{
  padding-top: 2%;
}
.finish-setup-outer{
  margin-left: 6%;
  margin-right: 6%;
}
</style>
