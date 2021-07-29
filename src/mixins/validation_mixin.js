import { mapGetters } from 'vuex';

const ValidationMxn = {
  computed: {
    ...mapGetters({
      getBusinessCountry: '$_freight/getBusinessCountry',
    }),
    acc_default() {
      const session = this.$store.getters.getSession;
      return session[session.default];
    },
    acc() {
      const session = this.$store.getters.getSession;
      return session;
    },
    userKraNoLabel() {
      let pin = this.$t('freight.tin_no');
      if (this.getBusinessCountry === 'KE') {
        pin = this.$t('freight.kra_pin');
      }
      if (this.getBusinessCountry === 'CI') {
        pin = this.$t('freight.ncc_no');
      }

      let label = `${this.$t('freight.pin_biz_label')} ${pin}`;

      if (this.acc.default === 'peer') {
        label = `${this.$t('freight.pin_peer_label')} ${pin}`;
      }

      return label;
    },
    userKraNoPlaceholder() {
      let placeholder = this.$t('freight.tin_no_placeholder');
      if (this.getBusinessCountry === 'KE') {
        placeholder = this.$t('freight.kra_pin_placeholder');
      }
      if (this.getBusinessCountry === 'CI') {
        placeholder = this.$t('freight.ncc_placeholder');
      }
      return placeholder;
    },
    userBizRgLabel() {
      let label = this.$t('freight.default_biz_reg_label');

      if (this.getBusinessCountry === 'CI') {
        label = this.$t('freight.ci_biz_reg_label');
      }

      return label;
    },
    userBizRgPlaceholder() {
      let placeholder = this.$t('freight.default_biz_reg_placeholder');

      if (this.getBusinessCountry === 'CI') {
        placeholder = this.$t('freight.ci_biz_reg_placeholder');
      }

      return placeholder;
    },
    kraFailResponse() {
      let resp = this.$t('freight.valid_tin_no');
      if (this.getBusinessCountry === 'KE') {
        resp = this.$t('freight.valid_kra');
      }
      if (this.getBusinessCountry === 'CI') {
        resp = this.$t('freight.valid_ci_pin');
      }
      return resp;
    },
    bizRegFailResponse() {
      let resp = this.$t('freight.please_enter_biz_regno');

      if (this.getBusinessCountry === 'CI') {
        resp = this.$t('freight.please_enter_ci_no');
      }
      return resp;
    },
  },
  methods: {
    kraPinValidation(val) {
      if (val !== '') {
        if (this.getBusinessCountry === 'KE') {
          return /^[apAP]\d{9}[a-zA-Z]$/.test(val);
        }

        if (this.getBusinessCountry === 'CI') {
          return /^[0-9]{7}[A-Z]{1}$/.test(val);
        }

        return /^\d{10}$/.test(val);
      }
      return true;
    },
    bizRegValidation(val) {
      if (val !== '') {
        if (this.getBusinessCountry === 'KE') {
          return /^[PVT]{3}[A-Z0-9]{7}|[A-Z]{3}[/][0-9]{4}[/][0-9]{5,}$/.test(val);
        }
        if (this.getBusinessCountry === 'CI') {
          return /^[A-Z]{2}[-][A-Z]{3}[-][0-9]{4}[-][A-Z]{1}[-][0-9]{2,10}$/.test(val);
        }

        return /^[0-9]{5,}$/.test(val);
      }
      return true;
    },
  },
};
export default ValidationMxn;
