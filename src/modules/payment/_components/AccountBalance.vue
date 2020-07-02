<template lang="html">
  <div class="">
    <div class="payinfo-currencies">
      <div
        v-for="(currency, index) in currencies"
        :key="index"
        class="currency-tabs"
        :class="activeCurrency === currency ? 'active-currency' : ''"
        @click="activeCurrency = currency"
      >
        {{ currency }}
      </div>
    </div>
    <div class="paytitle">
      Top up your Sendy account
    </div>
    <div class="payinfo">
      <div class="payinfo--icon" />
      <div class="payinfo--balance">
        Balance <span class="payinfo--balance-el">{{ running_balance }}</span>
        {{ getActiveCurrency }}
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

const currencyConversion = require('country-tz-currency');

export default {
  name: 'AccountBalance',
  data() {
    return {
      default_currency: 'KES',
      activeCurrency: '',
      secondaryRB: '',
      currencies: [],
    };
  },
  watch: {
    activeCurrency(val) {
      this.setActiveCurrency(val);
      if (this.running_balance && this.activeCurrency !== this.default_currency) {
        this.requestSecondaryRunningBalance();
      } else if (this.running_balance && this.activeCurrency === this.default_currency) {
        this.requestRB();
      }
    },
  },
  computed: {
    ...mapGetters({
      getDefaultCurrency: 'getDefaultCurrency',
      getActiveCurrency: '$_payment/getActiveCurrency',
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
    this.requestCurrencies();
    this.currencies.push(this.default_currency);
    this.activeCurrency = this.default_currency;
  },
  methods: {
    ...mapActions({
      _requestRunningBalance: '$_payment/requestRunningBalance',
      requestCountryCode: '$_payment/requestCountryCode',
    }),
    ...mapMutations({
      setActiveCurrency: '$_payment/setActiveCurrency',
    }),
    requestCurrencies() {
      const session = this.$store.getters.getSession;
      const profile_id = session.default === 'biz' ? session[session.default].cop_id : session[session.default].user_id;
      const profile_name = session.default === 'biz' ? 'cop_id' : 'user_id';
      const currencyPayload = {
        [profile_name]: profile_id,
      };
      const payload = {
        values: currencyPayload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'get_currencies',
      };
      this.$store.dispatch('requestRunningBalance', payload, { root: true }).then(
        (response) => {
          if (response.status) {
            this.currencies = response.data.currencies;
          }          
        },
        (error) => {
          // ...
        },
      );
    },
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
    requestSecondaryRunningBalance() {
      const session = this.$store.getters.getSession;
      const profile_id = session.default === 'biz' ? session[session.default].cop_id : session[session.default].user_id;
      const profile_name = session.default === 'biz' ? 'cop_id' : 'user_id';
      const runningBalancePayload = {
        [profile_name]: profile_id,
        phone: session[session.default].user_phone,
        default_currency: session[session.default].default_currency,
        rb_currency: session[session.default].default_currency,
        secondary_profile: true,
      };
      const payload = {
        values: runningBalancePayload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'running_balance',
      };

      this.$store.dispatch('requestRunningBalance', payload, { root: true }).then(
        (response) => {
          this.secondaryRB = response.data.data.running_balance;
          this.$store.commit('setRunningBalance', this.secondaryRB);
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
.payinfo-currencies {
  position: absolute;
  bottom: 33px;
  display: flex;
  width: 100%;
  border-bottom: 2px solid #ebeef5;
}
.currency-tabs {
  width: 60px;
  text-align: center;
  border: 1px solid #ebeef5;
  padding: 10px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: -1px;
  cursor: pointer;
}
.active-currency {
  color: white;
  background: #1B7FC3;
  border: 1px solid #1B7FC3 !important;
}
</style>
