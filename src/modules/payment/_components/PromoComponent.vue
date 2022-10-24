<template>
  <div class="paymentbody--form">
    <div
      v-if="promoCodes !== null && promoCodes.length !== 0"
      class="paymentbody--list"
    >
      <div class="promocodestitle main-header">
        {{ $t('general.valid_promo_codes') }}
      </div>
      <div
        v-for="(promocode, index) in promoCodes"
        :key="index"
        class="promocodeinfo"
        :class="{ 'last-item': index === Object.keys(promoCodes).length - 1 }"
      >
        <div class="promocodestitle promocode-sub-header">
          {{ promocode.couponName }}
        </div>
        <div
          v-if="promocode.couponCodeType === 1"
          class="promocode-value"
        >
          {{ promocode.currency }} {{ promocode.couponBalance }}
        </div>
        <div
          v-else
          class="promocode-value"
        >
          {{ promocode.couponBalance * 100 }}% {{ $t('genral.off') }} ({{ $t('genral.max') }}. {{ promocode.currency }}
          {{ formatNumber(promocode.maxDiscountAmount) }})
        </div>
        <div
          class="promocode-date"
          :class="{ 'to-expire' : formatExpiryDate(promocode.couponEndDate).status === 'red' } "
        >
          {{ $t('general.expiry') }}: {{ formatExpiryDate(promocode.couponEndDate).expiryDate }}
        </div>
      </div>
    </div>
    <div class="paymentbody--input-wrap">
      <input
        v-model="promocode_payment_data.sendy_coupon"
        type="text"
        name="sendy_coupon"
        :placeholder="$t('general.promo_code')"
        class="input-control paymentbody--input"
        @blur="sendGA4Events('enter_promo_code', {promo_code: promocode_payment_data.sendy_coupon})"
      >
    </div>
    <div class="paymentbody--input-wrap">
      <button
        type="button"
        name="button"
        :disabled="processing || !valid_payment"
        class="button-primary paymentbody--input-button"
        :class="{ 'paymentbody--input-button button--primary-inactive' : !valid_payment || processing }"
        @click="redeem_coupon"
      >
        {{ $t('general.redeem') }}
        <i
          v-if="processing"
          class="el-icon-loading tracking-loading-spinner promocode-spinner"
        />
      </button>
    </div>
  </div>
</template>

<script>
/* eslint-disable max-len */

import { mapActions } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';
import TimezoneMxn from '../../../mixins/timezone_mixin';
import promocodesMxn from '../../../mixins/promocodes_mixin';
import EventsMixin from '../../../mixins/events_mixin';

export default {
  mixins: [NotificationMxn, TimezoneMxn, promocodesMxn, EventsMixin],
  data() {
    return {
      promocode_payment_data: {
        sendy_coupon: '',
      },
    };
  },
  computed: {
    valid_payment() {
      return this.promocode_payment_data.sendy_coupon !== '';
    },
  },
  watch: {
    promoCodes(data) {
      this.promoCodes = data;
    },
    notification(obj) {
      this.displayNotification(obj);
    },
  },
  mounted() {
    this.requestPromoCodes();
    this.sendGA4Events('Open_promotions');
  },
  methods: {
    ...mapActions(['$_payment/requestPromoCodePayment']),

    redeem_coupon() {
      this.requestPromoPayment(this.promocode_payment_data.sendy_coupon);
      this.sendGA4Events('redeem_promo_code');
    },
    sendGA4Events(label, params) {
      const eventPayload = {
        name: label,
        parameters: params,
      };
      this.fireGA4Event(eventPayload);
    },
  },
};
</script>

<style lang="css">
.promocodestitle{
    font-size: 16px;
    line-height: 28px;
    letter-spacing: 0.02em;
    color: #000000;
}
.promocodeinfo {
  padding: 8px 0;
    border-bottom: 0.4px solid #DCDFE6;
}
.main-header {
  font-weight: 500;
}
.promocode-sub-header {
    color: #303133;
}
.promocode-value {
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.4px;
  color: #909399;
}
.promocode-date {
  font-size: 11px;
  line-height: 18px;
  color: #6EC763;
}
.to-expire {
  color: #F7797F;
}
.paymentbody--form {
  margin-left: 2em;
}
.paymentbody--list {
  margin: .5em;
}
.promocode-spinner {
  font-size: 15px !important;
  font-weight: 700;
  color: #fff !important;
}
.last-item {
    border-bottom: none;
}

</style>
