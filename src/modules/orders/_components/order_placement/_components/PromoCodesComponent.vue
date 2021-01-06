<template>
    <span>
        <div class="promocodes-holder">
            <div @click="applyDiscount()" :class="{ 'hidden': requested }" class="apply-discount"> 
                 Apply a discount
            </div>
             <div v-if="loading" class="loading-promo">
                Loading...
            </div>
        </div>
        <div class="paymentbody--list" v-if="isActive" :class="{ 'full-promo-body': hidePayment }">
            <div class="promocodestitle" v-if="requested">
                Apply a discount from a promo code
            </div>
            <span v-if="requested && promoCodes !== null && promoCodes.length !== 0">
                <div class="promocodeinfo" v-for="(promocode, index) in promoCodes" :key="index" :class="{ 'last-item': index === Object.keys(promoCodes).length - 1 }">
                    <el-row :gutter="20">
                        <el-col :span="16">
                            <div class="promocodestitle promocode-sub-header">{{ promocode.couponName }}</div>
                            <div v-if="promocode.couponCodeType === 1" class="promocode-value">{{promocode.currency }} {{ promocode.couponBalance }}</div>
                            <div v-else class="promocode-value">50% OFF (Max. KES 300)</div>
                            <div class="promocode-date" :class="{ 'to-expire' : formatExpiryDate(promocode.couponEndDate).status === 'red' } ">Expiry: {{ formatExpiryDate(promocode.couponEndDate).expiryDate }}</div>
                        </el-col>
                        <el-col :span="4">
                            <div class="radio-holder">
                                <input
                                    type="radio"
                                    :value="promocode.couponName"
                                    name="promocodesOptions"
                                    class="promocodes__radio-button"
                                    @click="setPromoCode(promocode)"
                                >
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="promocodes-holder">
                    <div @click="new_promocode()" :class="{ 'hidden': isNewPromo }" class="apply-discount"> 
                        Have a new promo code?
                    </div>
                </div>
                
            </span>
             <div v-if="requested && promoCodes === null || isNewPromo" class="promocode-text-holder">
                 <label class="promocode-text-label">Please enter your promo code below</label>
                <div class="promocode-input-holder">
                    <el-input placeholder="Promo Code" v-model="coupon" class="promocode-redeem-input"></el-input>
                     <el-button 
                        type="primary" 
                        class="redeem-button"  
                        @click="redeem_coupon()" 
                        :disabled="processing || coupon === ''"
                        :class="{'button-inactive': processing ||  coupon === ''}"
                        >
                            APPLY
                           <i v-if="processing" class="el-icon-loading tracking-loading-spinner" />
                    </el-button>
                </div>
            </div>
        </div>
    </span>
</template>

<script>
import TimezoneMxn from '../../../../../mixins/timezone_mixin';
import promocodesMxn from '../../../../../mixins/promocodes_mixin';
import NotificationMxn from '../../../../../mixins/notification_mixin';


import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faPlusCircle,
  faArrowLeft,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';

export default {
    name: 'PromoCodesComponent',
    mixins: [TimezoneMxn, promocodesMxn, NotificationMxn],
    props: ['hidePayment'],

    data() {
        return {
        promoCodes: null,
        processing: false,
        loading: false,
        isActive: false,
        requested: false,
        selected_promocode: '',
        isNewPromo: false,
        coupon: '',
        promoCodeDetails: null,

        };
    },
    watch: {
        notification (obj) {
            this.displayNotification(obj);

            if(obj.valid) {
                const coupon = {
                    couponBalance : obj.couponBalance,
                    couponName: this.coupon,
                };
                this.setPromoCode(coupon);
            }
            this.coupon = '';
        },
    },

    methods: {
        new_promocode() {
            this.isNewPromo = true;
        },
        applyDiscount() {
            this.requested = false;
            this.isActive = !this.isActive;
            this.selected_promocode = '';
            if( this.isActive) {
                this.requestPromoCodes();
            }
        },
        redeem_coupon() {
            this.requestPromoPayment(this.coupon);
        },
        setPromoCode(coupon) {
            const couponData = {
                discount_amount: Number(coupon.couponBalance),
                promo_code: coupon.couponName,
            };
            this.promoCodeDetails = couponData;
            this.$emit('promoCodeDetails', this.promoCodeDetails);
        }

    },

}
</script>

<style scoped>
.promocodes-holder {
    line-height: 18px;
    color: #F29D59;
    text-align: center;
    cursor: pointer;
}
.promocodestitle{
    font-weight: 400;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.03em;
    color: #909399;
    margin-bottom: 24px;
}
.promocodeinfo {
  padding: 8px 0;
    border-bottom: 0.4px solid #DCDFE6;
}
.promocode-sub-header {
    color: #303133;
    margin-bottom: 0;
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
.paymentbody--list {
    margin: .5em 0 .5em 4em;
    padding-top: .5em
}
.promocodes__radio-button {
    width: 30px;
    height: 30px;
    cursor: pointer;
}
.radio-holde {
    height: 60px;
    background: red;
}
.promocode-redeem { 
    display: table-cell;
}
.promocode-redeem-input { 
    display: table-cell;
}
.promocode-input-holder {
     display:flex;
    flex-direction:row;
    padding:0px;
    border: 0.6px solid #C0C4CC;
    border-radius: 8px;
    height: 40px;
    margin-top: 16px;
}
.redeem-button {
    background: #527CBD;
    border-radius: 8px;
    height: 40px;
    width: 90px;
    border-color: #527CBD;
}
.redeem-button span {
    display: block;
    padding: 0;
}
.promocode-text-holder {
    background: #E8F3FC;
    border-radius: 4px;
    padding: 24px 19px;

}
.promocode-text-label {
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 0.03em;
    color: #909399;
}
.full-promo-body {
    margin: .5em;
}
.hidden {
    display: none;
}
.last-item {
    border-bottom: none;
    margin-bottom: 2em;
}
.loading-promo {
    color: #2c82c5;
}
.apply-discount {
    text-decoration-line: underline;
}
.tracking-loading-spinner {
    font-size: 15px;
    color: #fff !important;
    font-weight: 700;
}
.button-inactive {
    cursor: not-allowed;
    background: rgba(0,0,0,0.50);
    transition: background-color 0.3s;
    color: #fff;
    border: none;
    width: 90px;
}
</style>
