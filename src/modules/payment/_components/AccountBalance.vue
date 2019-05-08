<template lang="html">
  <div class="">
    <div class="paytitle">
      Top up your Sendy account
    </div>
    <div class="payinfo">
      <div class="payinfo--icon">
        <!-- <font-awesome-icon icon="wallet" /> -->
      </div>
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
  name: 'account-balance',
  data() {
    return {
      default_currency: 'KES',
    };
  },
  mounted() {
    this.requestRB();
  },
  methods: {
    ...mapActions({
      _requestRunningBalance: '$_payment/requestRunningBalance',
      requestCountryCode: '$_payment/requestCountryCode',
    }),
    requestRB() {
      this.checkDefaultCurrency();
      //this will request from the api and update the store
      let session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
      }
      let running_balance_payload = {
        cop_id: cop_id,
        phone: session[session.default]['user_phone'],
        default_currency: session[session.default].default_currency,
        rb_currency: this.getDefaultCurrency,
      };
      let payload = {
        values: running_balance_payload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'running_balance',
      };

      this.$store.dispatch('requestRunningBalance', payload, { root: true }).then(
        response => {
          const resp = response.data;
          let balance = '';
          if (resp.data.running_balance === 0) {
            balance = resp.data.running_balance;
          } else {
            balance = resp.data.running_balance * -1;
          }
          this.$store.commit('setRunningBalance', balance);
        },
        error => {}
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
        navigator.geolocation.getCurrentPosition(position => {
          let lat = position.coords.latitude;
          let long = position.coords.longitude;

          markedCoords = `${lat},${long}`;
          // markedCoords = '0.3130284,32.4590386'; (Uganda coordinates for test)
          this.getCode(markedCoords);
        });
      }
    },
    getCode(position) {
      const payload = {};
      payload.coordinates = position;
      let full_payload = {
        values: payload,
        app: 'PRIVATE_API',
        endpoint: 'geocountry',
      };
      this.requestCountryCode(full_payload).then(
        response => {
          let code = response.country_code;
          this.$store.commit('setCountryCode', code);
          let country_code_data = currencyConversion.getCountryByCode(code);
          this.$store.commit('setDefaultCurrency', country_code_data.currencyCode);
          this.requestRB();
        },
        error => {}
      );
    },
  },
  computed: {
    ...mapGetters({
      getDefaultCurrency: 'getDefaultCurrency',
    }),
    //this just gets what is on the store
    running_balance() {
      //format the amount
      let value = this.$store.getters.getRunningBalance;
      if (value !== null && value !== '' && typeof value !== 'undefined') {
        let val = value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
        val = val.split('.');
        return val[0];
      } else {
        return value;
      }
    },
  },
  created() {
    this.checkUserLocation();
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
