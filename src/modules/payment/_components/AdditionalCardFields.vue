<template>
  <div class="paymentbody--form">
    <span v-if="!is3DS">
    <form @submit.prevent="submit">
      <div v-for="(item, index) in fields" :key="index">
        <div class="textfield mt-5" v-if="item.type === 'phone'" >
          <vue-tel-input 
            autoFormat 
            :defaultCountry="getBupayload.country_code"
            :dropdownOptions="dropdownOptions"
            mode="national"
            invalidMsg="Phone number is Invalid"
            @validate="validatePhone"
            required
          >
          </vue-tel-input>
        </div>
        <div class="paymentbody--input-wrap mt-5" v-if="item.type === 'date'" >
          <input
            type="text"
            :placeholder="`${item.field}`"
            required
            v-model="form[item.field_id]"
            class="input-control paymentbody--input"
          >
        </div>

        <div class="paymentbody--input-wrap mt-5" v-if="item.type === 'text'" >
          <input
            type="text"
            :placeholder="`${item.field}`"
            required
            v-model="form[item.field_id]"
            class="input-control paymentbody--input"
          />
        </div>
      </div>

      <button
        type="submit"
        name="button"
        :disabled="loading"
        class="button-primary paymentbody--input-button"
      >
        {{$t('general.submit')}}
        <i
          v-if="loading"
          class="el-icon-loading tracking-loading-spinner promocode-spinner"
        />
      </button>
    </form>

    

    </span>
    <span v-else>
      <Processing text="Processing your card details" />
    </span>

  </div> 
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { VueTelInput } from 'vue-tel-input';

export default {
  name: 'AdditionalCardFields',
  components: {
    VueTelInput,
  },
  props: ['additionalData', 'transaction_id', 'is3DS'],
  data() {
    return {
      loading: false,
      address: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      phone: '',
      dropdownOptions: {
        showFlags: true,
        showDialCodeInSelection: true
      },
      formattedPhone: null,
      form: {},
      fields: this.additionalData,
      errors: {},
    }
  },
  watch: {
    additionalData(val) {
      this.fields = val;
    }
  },
  methods: {
    ...mapMutations(['setTwoFACompleted']),
    ...mapActions({
      paymentAxiosPost: '$_payment/paymentAxiosPost',
    }),
    validatePhone(val) {
      this.formattedPhone = val.valid ? val.number : null;
      this.form['phone'] = this.formattedPhone;
      return;
    },
    submit() {
      this.loading = true;
      
      const payload = {
        transaction_id: this.transaction_id,
        ...this.form,
      }

      const fullPayload = {
        values: payload,
        app: 'PAYMENT_GATEWAY',
        endpoint: '/api/v2/submit_info'
      }

      this.paymentAxiosPost(fullPayload)
      .then(response => {
        if (response.status) {

          if (response.additional_data) {
            this.fields = response.additional_data;
            return;
          }
          
          this.$emit('continue', true);
          return;
        } 
        this.loading = false;
        this.$emit('continue', false);
      }).catch(err => {
        this.loading = false;
        this.$emit('continue', false);
      })
    },
    capitalize(str) {
      const result = str.charAt(0).toUpperCase() + str.slice(1);
      return result;
    }
  }
}
</script>

<style scoped>
.phone-input {
  padding: 8px;
  height: 40px;
  background: #FFFFFF;
  border: 0.5px solid #C0C4CC;
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
}

.vue-tel-input {
  border-radius: 3px;
  display: flex;
  border: 0.5px solid #C0C4CC !important;
  text-align: left;
  height: 40px;
}
.paymentbody--input-wrap-saved-cards{
  min-height: 4rem;
  margin: .5em;
}
</style>
