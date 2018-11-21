<template lang="html">
    <div>
        <div class="payment--loading-title">
        {{payment_loading_title}}
        </div>
        <div class="payment--mpesa-loader">
        </div>
        <div class="paymemt--mpesa-loader-actions">
            <button type="button" class="button-primary paymentbody--input-button" @click="cancelPaymentRequest">
                Cancel
            </button>
        </div>
    </div>
    
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
    name: 'payment_loading',
    data() {
        return {
            loading: true
        }
    },
    mounted() {
    },
    methods:{
       ...mapActions(["$_payment/terminateMpesaPaymentRequest"]),
       cancelPaymentRequest() {
        let payload = {};
        this.$store.dispatch("$_payment/terminateMpesaPaymentRequest", payload).then(
        response => {
          console.log(response);
        },
        error => {
          console.log(error);
        });
       }
    },
    computed :{
        payment_loading_title() {
            return "Please follow the M-Pesa instructions on your phone screen"
        },
        
        
    },
}
</script>

<style lang="css">
    
</style>
