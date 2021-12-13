<template>
  <div class="paymentbody--form">
    <div v-if="!isCVV">
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
    </div>
    
    <div v-else>
      <form @submit.prevent="submitCvv">
        <div
          id="cc-cvc"
          class="form-group text-field"
        >
          <div class="form-control-static">
            <span class="fake-input" />
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
    </div>
  
  </div> 
</template>

<script>
import { mapActions, mapMutations, mapGetters } from 'vuex';
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
      fields: [],
      errors: {},
      isCVV: false,
      updateFields: false,
    }
  },
  computed: {
    ...mapGetters({
      getSavedPayMethods: '$_payment/getSavedCards',
    })
  },
  watch: {
    additionalData(val) {
      const cvv = val.filter(element => element.field_id === 'cvv');
      if (cvv.length) {
        this.initCVV();
        return;
      }
      this.fields = val;
    },
    updateFields(val) {
      if (val) {
        const cvv = this.additionalData.filter(element => element.field_id === 'cvv');
        if (cvv.length) {
          this.initCVV();
          return;
        }
      }
    }
  },
  mounted() {
    this.fields = this.additionalData ? this.additionalData : [];
    this.loadVeryGoodSecurityScript();
    const cvv = this.additionalData.filter(element => element.field_id === 'cvv');
    if (cvv.length) {
      this.initCVV();
    }
  },
  methods: {
    ...mapMutations(['setTwoFACompleted']),
    getDefaultPayment() {
      const defaultMethod = this.getSavedPayMethods ? this.getSavedPayMethods.filter(method => method.default === 1)[0] : [];
      return defaultMethod;
    },
    ...mapActions({
      paymentAxiosPost: '$_payment/paymentAxiosPost',
    }),
    initCVV() {
      this.isCVV = true
      setTimeout(() => {
        this.setForm();
      }, 500);
    },
    loadVeryGoodSecurityScript() {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://js.verygoodvault.com/vgs-collect/2.0/vgs-collect.js';
      document.head.appendChild(script);
    },
    setForm() {
      // eslint-disable-next-line no-undef
      this.form = VGSCollect.create(
        process.env.CONFIGS_ENV.VGS_VAULT_ID,
        process.env.CONFIGS_ENV.VGS_ENVIRONMENT,
        () => {},
      );

      this.form.field('#cc-cvc .fake-input', {
        type: 'card-security-code',
        name: 'cvv',
        fontSize: '13px',
        placeholder: 'CVV',
        validations: ['required', 'validCardSecurityCode'],
      });

    },
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
    submitCvv() {
      this.form.submit(
        '/customers/collect_card_details',
        {
          headers: {
            Authorization: localStorage.jwtToken,
          },
        },
        (status, res) => {

          if (res.status) {
            const values = res.data;
            delete values.language;

            const session = this.$store.getters.getSession;
            const accData = session[session.default];
            const defaulMethod = this.getDefaultPayment();

            const payload = {
              transaction_id: this.transaction_id,
              email: accData.user_email,
              card_id: defaulMethod.pay_detail_id,
              ...values,
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
                  this.updateFields = true;
                  if (response.tds) {
                    const responsePayload = {
                      status: true,
                      additionalData: response.additional_data,
                    }

                    this.$emit('continue3DS', responsePayload)
                    return;
                  }

                  this.fields = response.additional_data;
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

          }

        }
      )
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

#cc-cvc {
  width: 100% !important;
  padding-left: 0px !important;
}
</style>
