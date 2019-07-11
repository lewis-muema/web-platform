<template lang="html">
  <div class="">
    <div class="paytitle">
      Top up your Sendy account
    </div>
    <div class="payinfo">
      <div class="payinfo--icon" />
      <div class="payinfo--balance">
        Balance <span class="payinfo--balance-el">{{ running_balance }}</span>
        {{ default_currency }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

const currencyConversion = require('country-tz-currency');

export default {
  name: 'AccountBalance',
  data() {
    return {
      default_currency: 'KES',
    };
  },
  computed: {
    ...mapGetters({
      getDefaultCurrency: 'getDefaultCurrency',
    }),
    // this just gets what is on the store
    running_balance() {
      // format the amount
      const value = this.$store.getters.getRunningBalance;
      if (value !== null && value !== '' && typeof value !== 'undefined') {
        let val = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        val = val.split('.');
        return val[0];
      }
      return value;
    },
  },
  mounted() {
    this.requestRB();
    this.checkUserLocation();
  },
  methods: {
    ...mapActions({
      _requestRunningBalance: '$_payment/requestRunningBalance',
      requestCountryCode: '$_payment/requestCountryCode',
    }),
    requestRB() {
      this.checkDefaultCurrency();
      // this will request from the api and update the store
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
      }
      const runningBalancePayload = {
        cop_id,
        phone: session[session.default].user_phone,
        default_currency: session[session.default].default_currency,
        rb_currency: session[session.default].default_currency,
      };
      const payload = {
        values: runningBalancePayload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'running_balance',
      };

      this.$store.dispatch('requestRunningBalance', payload, { root: true }).then(
        (response) => {
          const resp = response.data;
          const balance = resp.data.running_balance;
          this.$store.commit('setRunningBalance', balance);
        },
        (error) => {
          // ...
        },
      );
    },
    checkDefaultCurrency() {
      const session = this.$store.getters.getSession;
      const countryCurrency = session[session.default].default_currency;
      if (countryCurrency === null) {
        this.default_currency = 'KES';
      } else {
        this.default_currency = countryCurrency;
      }
    },
    checkUserLocation() {
      let markedCoords = '';
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const long = position.coords.longitude;

          markedCoords = `${lat},${long}`;
          // markedCoords = '0.3130284,32.4590386'; (Uganda coordinates for test)
          this.getCode(markedCoords);
        });
      }
    },
    getCode(position) {
      const payload = {};
      payload.coordinates = position;
      const fullPayload = {
        values: payload,
        app: 'PRIVATE_API',
        endpoint: 'geocountry',
      };
      this.requestCountryCode(fullPayload).then(
        (response) => {
          const code = response.country_code;
          this.$store.commit('setCountryCode', code);
          const countryCodeData = currencyConversion.getCountryByCode(code);
          this.$store.commit('setDefaultCurrency', countryCodeData.currencyCode);
          this.requestRB();
        },
        (error) => {
          // ...
        },
      );
    },
  },
};
</script>

<style lang="css">
.payinfo {
  display: flex;
}
.paytitle {
  display: flex;
  flex: 2;
  align-items: center;
  font-size: 16px;
}
.payinfo {
  display: flex;
  justify-content: space-between;
  flex: 1;
  color: rgb(85, 85, 85);
  font-size: 14px;
}
.payinfo--icon {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}
.payinfo--icon img {
  width: 25px;
}
.payinfo--balance {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 2;
}
.payinfo--balance-el {
  padding: 0px 5px;
}
</style>
