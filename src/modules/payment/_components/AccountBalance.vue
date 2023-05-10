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
    <div class="payinfo-container">
      <div class="paytitle">
        {{ $t('general.top_up_your_sendy_account') }}
      </div>
      <div class="payinfo">
        <div class="payinfo-icon-container">
          <font-awesome-icon
            icon="wallet"
            width="15px"
          />
        </div>
        <div class="payinfo--balance">
          <p class="account-balance-info-title">
            {{ $t('general.account_balance') }}
          </p>
          <p class="account-balance-info-body">
            {{ getActiveCurrency }}<span class="payinfo--balance-el">{{ running_balance }}</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faWallet } from '@fortawesome/free-solid-svg-icons';

library.add(faWallet);

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
.paytitle {
  display: flex;
  flex: 2;
  align-items: center;
  font-size: 16px;
  height: 40px;
  font-weight: 500;
  font-size: 24px;
}
.payinfo {
  display: flex;
  justify-content: flex-start;
  flex: 1;
  color: rgb(85, 85, 85);
  font-size: 14px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.25);
  border-radius: 6px;
  width: 80%;
  margin: auto;
  height: 70px;
  margin-top: 10px;
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
  display: block;
}
.payinfo--balance-el {
  padding: 0px 5px;
}
.payinfo-currencies {
  position: absolute;
  bottom: 90px;
  display: flex;
  width: 100%;
  border-bottom: 2px solid #ebeef5;
}
.payinfo-container {
  height: 80px;
  width: 100%;
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
.payinfo-icon-container {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  background: #E8F3FC;
  margin: 10px 20px 10px 20px;
  color: #527CBD;
  font-size: 20px;
}
.account-balance-info-title {
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: #909399;
  font-size: 10px;
  margin: 15px 0px 0px 0px;
}
.account-balance-info-body {
  letter-spacing: 0.02em;
  color: #527CBD;
  font-weight: 500;
  font-size: 16px;
  margin: 7px 0px 0px 0px;
}
</style>
