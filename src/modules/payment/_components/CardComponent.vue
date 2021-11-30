<template>
  <div
    v-if="getCardPaymentStatus"
    class="paymentbody--form"
  >
    <div
      v-if="deleteCardIndex !== ''"
      class="saved-cards-delete-dialogue"
    >
      <div class="saved-cards-delete-dialogue-container">
        <p>
          {{$t('general.sure_like_delete_card')}}
          <strong>{{ get_saved_cards[deleteCardIndex].card }}</strong>?
        </p>
        <p>
          <span
            class="delete-saved-card-dialogue-buttons"
            @click="deleteSavedCard(deleteCardIndex)"
          >
            {{$t('general.yes')}}
          </span>
          <span
            class="delete-saved-card-dialogue-buttons"
            @click="deleteCardIndex = ''"
          >
            {{$t('general.no')}}
          </span>
        </p>
      </div>
    </div>
    <div
      v-if="!addCardStatus"
      class="saved-cards-container"
    >
      <PaymentLoading 
        payMethod="card" 
        :transactionText="transactionText" 
        :count="count" 
        v-if="loadingStatus"
      />

      <div v-else>
        <p class="card-payment-saved-cards-title">
          {{$t('general.cards')}}
        </p>
        <p class="card-payment-saved-cards-label">
          {{$t('general.select_card')}}
        </p>
        <div
          v-for="(cards, index) in get_saved_cards"
          :key="index"
          class="card-payment-saved-cards-row"
        >
          <span class="card-payment-saved-cards-icon">
            <font-awesome-icon icon="credit-card" />
          </span>
          <input
            v-model="selectedSavedCard"
            type="radio"
            class="card-payment-saved-card-radio"
            :value="index"
          >
          {{ formatCardNumber(cards.pay_method_details) }}
          <span
            class="card-payment-remove-cards-icon"
            @click="deleteCardIndex = index"
          >
            <font-awesome-icon icon="trash-alt" />
          </span>
        </div>
        <div class="card-payment-add-card-holder">
          <span>
            <font-awesome-icon
              icon="plus-circle"
              class="card-payment-add-card-icon"
            />
          </span>
          <span
            class="card-payment-add-card"
            @click="addCardStatus = !addCardStatus"
          >{{$t('general.add_a_new_card')}}</span>
        </div>
        <div class="card-payment-flex">
          <span class="prepend-currency">{{ getActiveCurrency }}</span>
          <input
            v-model="savedCardAmount"
            type="number"
            class="card-payment-amount-input"
          >
        </div>
        <div
          v-loading="loadingStatus"
          class="orders-loading-container orders-loading-container--completion loader-height-override"
          :element-loading-text="transactionText"
          element-loading-spinner="el-icon-loading"
        >
          <button
            :class="
              valid_saved_vgs_payment && !loadingStatus
                ? 'button-primary paymentbody--input-button'
                : 'paymentbody--input-button card--input button--primary-inactive inactive-payment-button'
            "
            @click="chargeSavedCard()"
          >
            {{$t('general.make_payment')}}
          </button>
        </div>
      </div>
    </div>

    <form
      v-if="addCardStatus"
      @submit.prevent="onSubmit"
    > 
      <PaymentLoading 
        payMethod="card" 
        :transactionText="transactionText" 
        :count="count" 
        v-if="loadingStatus"
      />
      <AdditionalCardFields 
        :additionalData="additionalData" 
        :transaction_id="transaction_id" 
        v-if="!loadingStatus && showAdditionalCardFields" 
        @continue="handleContinue"
      />

      <div v-if="!loadingStatus && !showAdditionalCardFields" >
        <div
          v-if="get_saved_cards.length > 0"
          class="card-payment-back-arrow"
          @click="addCardStatus = !addCardStatus"
        >
          <span>
            <font-awesome-icon
              icon="arrow-left"
              class="card-payment-add-card-icon"
            />
          </span>
          <span class="card-payment-back-option">
          {{$t('general.back')}}
          </span>
        </div>

        <div
          id="cc-number"
          class="form-group"
        >
          <div class="form-control-static">
            <span class="fake-input" />
          </div>
        </div>

        <div class="cvv-expire-fields">
          <div
            id="cc-expiration-date"
            class="form-group"
          >
            <div class="form-control-static">
              <span class="fake-input" />
            </div>
          </div>
          <div
            id="cc-cvc"
            class="form-group"
          >
            <div class="form-control-static">
              <span class="fake-input" />
            </div>
          </div>
        </div>

        <div
          id="cc-save-card"
          class="form-group"
        >
          <div class="form-control-static">
            <input
              v-model="saveCardState"
              type="checkbox"
            >
            <span
              class="fake-checkbox-label"
            >{{$t('general.save_card_details')}}</span>
          </div>
        </div>
        <div
          id="cc-amount"
          class="form-group"
        >
          <div class="form-control-static amount-input">
            <span class="prepend-currency">{{ getActiveCurrency }}</span>
            <span class="fake-input" />
          </div>
        </div>

        <div
          v-loading="loading"
          class="orders-loading-container orders-loading-container--completion loader-height-override"
          :element-loading-text="transactionText"
          element-loading-spinner="el-icon-loading"
        >
          <button
            type="submit"
            :class="
              vgs_valid_payment && !loadingStatus
                ? 'button-primary paymentbody--input-button'
                : '.paymentbody--input-button card--input button--primary-inactive inactive-payment-button'
            "
          >
            {{$t('general.make_payment_capital')}}
          </button>
        </div>
      </div>
    </form>

    <div v-if="!getCardPaymentStatus">
      <p
        v-if="country === 'KE'"
        class="card-payment-disabled-notification"
        v-html="$t('general.technical_mantainance_still_pay', {user_name: user_name})">
      </p>
      <p
        v-if="country === 'UG'"
        class="card-payment-disabled-notification"
        v-html="$t('general.technical_mantainance_contact_customer_care', {user_name: user_name})"/>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import moment from 'moment';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faChevronDown,
  faPlusCircle,
  faArrowLeft,
  faCreditCard,
  faTrashAlt,
} from '@fortawesome/free-solid-svg-icons';
import payment_success from './SuccessComponent.vue';
import payment_fail from './FailComponent.vue';
import addCard from './AddCard.vue';
import Mcrypt from '../../../mixins/mcrypt_mixin';
import PaymentMxn from '../../../mixins/payment_mixin';
import NotificationMxn from '../../../mixins/notification_mixin';

library.add(faChevronDown, faPlusCircle, faArrowLeft, faCreditCard, faTrashAlt);

export default {
  name: 'CardComponent',
  components: {
    PaymentLoading: () => import('./LoadingComponent.vue'),
    AdditionalCardFields: () => import('./AdditionalCardFields.vue'),
    payment_success,
    payment_fail,
    addCard,
  },
  mixins: [Mcrypt, PaymentMxn, NotificationMxn],
  data() {
    return {
      card_payment_data: {
        card_expiry: '',
        cvv: '',
        card_no: '',
        amount: '',
        is_save: true,
      },
      payment_card: '',
      activeNames: ['1'],
      isHidden: false,
      payment_state: 'Attempting Payment',
      show_cvv: false,
      country: '',
      form: {},
      selectedSavedCard: '',
      vgs_valid_payment: false,
      savedCardAmount: '',
      addCardStatus: false,
      saveCardState: false,
      loadingStatus: false,
      deleteCardIndex: '',
      transaction_id: null,
      poll_count: 0,
      poll_limit: 6,
      transactionText: 'Loading...',
      showAdditionalCardFields: false,
      additionalData: null,
      is3DS: false,
      twoFACompleted: false,
      transactionStatus: null,
      count: false,
      loading: false,
    };
  },
  computed: {
    ...mapGetters({
      card_fail_status: '$_payment/getCardFailStatus',
      card_loading_status: '$_payment/getCardLoadingStatus',
      card_success_status: '$_payment/getCardSuccessStatus',
      get_saved_cards: '$_payment/getSavedCards',
      get_stripe_user_id: '$_payment/getStripeUserId',
      getCardPaymentStatus: '$_payment/getCardPaymentStatus',
      getActiveCurrency: '$_payment/getActiveCurrency',
    }),
    user_name() {
      const session = this.$store.getters.getSession;
      return session[session.default].user_name.split(' ')[0];
    },
    valid_saved_vgs_payment() {
      if (this.selectedSavedCard !== '' && !this.addCardStatus && this.savedCardAmount) {
        return true;
      }
      return false;
    },
  },
  watch: {
    get_saved_cards() {
      if (this.get_saved_cards.length === 0) {
        this.addCardStatus = true;
      } else {
        this.addCardStatus = false;
      }
    },
    addCardStatus(val) {
      if (val && !this.showAdditionalCardFields ) {
        setTimeout(() => {
          this.setForm();
        }, 500);
      }
    },
    form: {
      handler(val) {
        if (
          Object.prototype.hasOwnProperty.call(val.state, 'cardno')
          && val.state.cardno.isValid
          && val.state.cvv.isValid
          && val.state.expirydate.isValid
          && val.state.amount.isValid
          && this.addCardStatus
        ) {
          this.vgs_valid_payment = true;
        } else {
          this.vgs_valid_payment = false;
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.getUserCards();
    const session = this.$store.getters.getSession;
    this.country = session[session.default].country_code;
    this.loadVeryGoodSecurityScript();
    if (this.get_saved_cards.length === 0) {
      this.addCardStatus = true;
    }
  },
  methods: {
    showCvv() {
      if (this.show_cvv) {
        this.show_cvv = false;
      } else {
        this.show_cvv = true;
      }
    },
    ...mapActions({
      requestSavedCards: '$_payment/requestSavedCards',
      removeSavedCard: '$_payment/deleteSavedCard',
      paymentAxiosPost: '$_payment/paymentAxiosPost',
      paymentAxiosGet: '$_payment/paymentAxiosGet',
    }),
    ...mapMutations({
      setSavedCards: '$_payment/setSavedCards',
      setStripeUserId: '$_payment/setStripeUserId',
    }),
    formatCardNumber(cardno) {
      const last4 = cardno.substring(cardno.length - 4, cardno.length);
      return `**** **** **** ${last4}`;
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

      this.form.field('#cc-number .fake-input', {
        type: 'card-number',
        name: 'cardno',
        successColor: '#4F8A10',
        errorColor: '#D8000C',
        fontSize: '13px',
        placeholder: this.$t('general.card_number'),
        validations: ['required', 'validCardNumber'],
      });

      this.form.field('#cc-cvc .fake-input', {
        type: 'card-security-code',
        name: 'cvv',
        fontSize: '13px',
        placeholder: 'CVV',
        validations: ['required', 'validCardSecurityCode'],
      });

      this.form.field('#cc-expiration-date .fake-input', {
        type: 'card-expiration-date',
        name: 'expirydate',
        fontSize: '13px',
        errorColor: '#D8000C',
        successColor: '#4F8A10',
        placeholder: this.$t('general.card_expiry'),
        serializers: [{ name: 'replace', options: { old: ' ', new: '' } }],
        validations: ['required', 'validCardExpirationDate'],
      });
      this.form.field('#cc-amount .fake-input', {
        type: 'number',
        name: 'amount',
        fontSize: '13px',
        placeholder: this.$t('general.amount_to_topup'),
        validations: ['required'],
      });
    },

    onSubmit() {
      const session = this.$store.getters.getSession;
      const accData = session[session.default];
      const firstName = accData.user_name.split(' ')[0];
      const lastName = accData.user_name.split(' ').length > 1 ? accData.user_name.split(' ')[1] : '';
     
      const newCardPayload = {
        currency: this.getActiveCurrency,
        country: accData.country_code,
        email: accData.user_email,
        phonenumber: accData.user_phone,
        firstname: firstName,
        lastname: lastName,
        txref: `${Date.now()}`,
        userid: accData.user_id,
        copid: session.default === 'biz' ? accData.cop_id : 0,
        save: this.saveCardState,
        company_code: 'FFKE',
        paymethod: 2,
        bulk: false,
        entity: 4,
      };

      this.loading = true;
      this.transactionText = 'Initializing card payment...';
      this.form.submit(
          '/customers/collect_card_details',
          {
            data: newCardPayload,
            headers: {
              Authorization: localStorage.jwtToken,
            },
          },
          (status, response) => {
            this.loading = false;
            if (response.status) {
              this.loadingStatus = true;
              
              const payloadData = response.data;
              delete payloadData['language'];
              const payload = {
                values: payloadData,
                app: 'CUSTOMERS_APP',
                endpoint: 'charge_card_v3',
              }
              

              this.paymentAxiosPost(payload).then((res)=> {
                this.transaction_id = res.transaction_id;
                
                if (res.status) {
                  this.transactionStatus = res.transaction_status;

                  if(res.additional_data) {
                    this.additionalData = res.additional_data;
                    this.is3DS = res.tds;
                    if (res.tds) {
                      this.init3DS(res.additional_data);
                      return;
                    }
                    this.showAdditionalCardFields = true;
                    this.loadingStatus = false;
                    return;
                  }

                  switch (res.transaction_status) {
                    case 'pending':
                      this.transactionPoll();
                      break;
                    case 'success':
                      this.transactionText = res.message;
                      this.loadingStatus = false;
                      this.clearInputs();
                      const notification = {
                        title: this.$t('general.top_up'),
                        level: 1,
                        message: res.message,
                      };
                      this.displayNotification(notification);
                      break;
                    default:
                      break;
                  }

                } else {
                  this.transactionText = res.message;
                  this.loadingStatus = false;
                  this.clearInputs();
                  const notification = {
                    title: res.transaction_status,
                    level: 1,
                    message: res.message,
                  };

                  this.displayNotification(notification);
                  }

              }).catch(err => {
                this.transactionText = this.$t('general.failed_to_charge_card');
                this.loadingStatus = false;
                this.clearInputs();
                const notification = {
                  title: this.$t('general.failed_to_charge_card'),
                  level: 2,
                  message: this.$t('general.failed_to_charge_card_text'),
                };

                this.displayNotification(notification);
              });
            
            } else {
              this.loadingStatus = false;
              const notification = {
                title: this.$t('general.failed_to_charge_card'),
                level: 2,
                message: response.message,
              };
              this.displayNotification(notification);
            }
          },
      );
    },

    handleContinue(val) {
      if (val) {

        this.loadingStatus = true;
        this.pollCard();
        return;
      }
      this.loadingStatus = false;
      this.showAdditionalCardFields = false;
      this.clearInputs();
      const notification = {
        title: this.$t('general.failed_to_charge_card'),
        level: 2,
        message: this.$t('general.failed_to_charge_card_text'),
      };
      this.displayNotification(notification);
    },

    chargeSavedCard() {
      const session = this.$store.getters.getSession;
      const accData = session[session.default];
      const firstName = accData.user_name.split(' ')[0];
      const payload = {
        txref: `${Date.now()}`,
        cardno:
          this.get_saved_cards.length > 0 && this.selectedSavedCard !== ''
            ? this.get_saved_cards[this.selectedSavedCard].pay_method_details
            : '',
        currency: this.getActiveCurrency,
        amount: this.savedCardAmount,
        country: accData.country_code,
        phonenumber: accData.user_phone,
        userid: accData.user_id,
        copid: session.default === 'biz' ? accData.cop_id : 0,
        bulk: false,
      };
      this.transactionText = 'Initializing card payment...';
      const savedCardPayload = {
        values: payload,
        app: 'AUTH',
        endpoint: 'customers/charge_saved_card_v3',
      };
      this.loadingStatus = true;
      this.requestSavedCards(savedCardPayload).then(
        (response) => {
          // decrypt response here
          this.transaction_id = response.transaction_id;
          if (response.status) {
            this.transactionPoll();
            this.count = true;
          } else {
            this.transactionText = response.reason;
            this.loadingStatus = false;
            this.clearInputs();
            const notification = {
              title: response.transaction_status,
              level: 1,
              message: response.message,
            };
            this.displayNotification(notification);
          }
        },
        error => false,
      );
    },

    transactionPoll() {
      this.poll_count = 0;
      for (let poll_count = 0; poll_count < this.poll_limit; poll_count++) {
        const that = this;
        (function (poll_count) {
          setTimeout(() => {
            if (that.poll_count === that.poll_limit) {
              poll_count = that.poll_limit;
              return;
            }
            
            that.updateTransactionStatus(); 
            if (poll_count === (that.poll_limit - 1)) {
                that.transactionText = 'Failed'
                that.loadingStatus = false;

                const notification = {
                  title: that.$t('general.failed_to_charge_card'),
                  level: 2,
                };
                that.clearInputs();
                that.displayNotification(notification);
              return;
            }
          }, 10000 * poll_count);
        }(poll_count));
      }
    },
    updateTransactionStatus() {
      const fullPayload = {
        app: 'CUSTOMERS_APP',
        endpoint: `transaction_status/?id=${this.transaction_id}`,
      }
      this.paymentAxiosGet(fullPayload).then((res) => {
        let level = 1;
        if (res.status) { 
          this.transactionText = res.message;
          switch (res.transaction_status) {
            case 'success':
              this.poll_count = this.poll_limit;
              this.clearInputs();
              this.loadingStatus = false;
              const notification1 = {
                title: res.transaction_status,
                level: 1,
                message: res.message,
              };
              this.displayNotification(notification1);
              this.requestRB();
              this.getUserCards();
              break;
            case 'failed':
              this.poll_count = this.poll_limit;
              this.loadingStatus = false;
              level = 2;
              this.clearInputs();
              const notification2 = {
                title: res.transaction_status,
                level: level,
                message: res.message,
              };
              this.displayNotification(notification2);
              break;
            case 'pending':
              break;
            default:
              break;
          }
          return res;
        }

        const notification = {
          title: this.$t('general.failed_to_charge_card'),
          level: 2,
          message: res.message
        };
        this.clearInputs();
        this.displayNotification(notification);
      })
        
    },
    clearInputs() {
      this.addCardStatus = false;
      this.saveCardState = false;
      setTimeout(() => {
        this.addCardStatus = true;
      }, 100);
    },

    deleteSavedCard(index) {
      const session = this.$store.getters.getSession;
      const accData = session[session.default];
      const payload = {
        cardno: this.get_saved_cards[index].pay_method_details,
        userid: accData.user_id,
      };
      const deleteCardPayload = {
        values: payload,
        app: 'PAYMENT_GATEWAY',
        endpoint: '/api/v1/card/delete',
      };
      this.deleteCardIndex = '';
      this.loading = true;
      this.requestSavedCards(deleteCardPayload).then((response) => {
        this.loading = false;
        if (response.status) {
          this.getUserCards();
        } else {
          const notification = {
            title: this.$t('general.failed_to_delete_saved_card'),
            level: 2,
            message: this.$t('general.try_again_later'),
          };
          this.displayNotification(notification);
        }
      });
    },

    getUserCards() {
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      let user_id = 0;
      if (session.default === 'biz') {
        cop_id = session.biz.cop_id;
        user_id = session.biz.user_id;
      } else {
        cop_id = 0;
        user_id = session.peer.user_id;
      }

      const cardPayload = {
        user_id,
        cop_id,
        entity_id: 3,
        country_code: session[session.default].country_code,
      };

      // encrypt card payload here

      const fullPayload = {
        values: cardPayload,
        app: 'PAYMENT_GATEWAY',
        endpoint: '/payment_methods',
      };

      this.requestSavedCards(fullPayload).then(
        (response) => {
          // decrypt response here
          if (response.status) {
            const cards = response.saved_payment_methods.filter(el => el.pay_method_id === 2)
            this.setSavedCards(cards);
          } else {
            this.setSavedCards([]);
          }
        },
        error => false,
      );
    },

    init3DS(additionalData) {
      const res = additionalData[0];
      const url = res.field;
      const urlWindow = window.open(url, '');

      const timer = setInterval(() => {
			  if (urlWindow.closed) {
          this.init3dsPoll();
          clearInterval(timer);
        }
	  	}, 500);

    },
    init3dsPoll() {
      this.loadingStatus = true;
      const payload = {
        transaction_id: this.transaction_id,
        tds: true,
      }

      const fullPayload = {
        values: payload,
        app: 'CUSTOMERS_APP',
        endpoint: 'submit_info'
      }

      this.paymentAxiosPost(fullPayload).then((res) => {
        if (res.status) {
          switch (res.transaction_status) {
              case 'pending':
                this.transactionPoll();
                this.count = true;
                break;
              case 'success':
                this.poll_count = this.poll_limit;
                this.clearInputs();
                this.loadingStatus = false;
                const notification1 = {
                  title: res.transaction_status,
                  level: 1,
                  message: res.message,
                };
                this.displayNotification(notification1);
                this.requestRB();
                break;
              default:
                break;
          };
          return;
        }
      }).catch((error) => {
        this.transactionText = this.$t('general.failed_to_charge_card');
        this.loadingStatus = false;
        this.clearInputs();
        const notification = {
        title: this.$t('general.failed_to_charge_card'),
        level: 2,
        message: res.message,
        };
        this.displayNotification(notification);
      });
      

    },
  },
};
</script>
<style lang="css">
.card--new-card {
  margin-top: 20px;
  width: 100%;
  padding: 16px 15px !important;
  height: 50px !important;
}
.card--saved-card {
  margin-top: 20px;
  width: 100%;
  padding: 16px 15px !important;
  height: 50px !important;
}
.card--saved-card-width {
  width: 100%;
}
.payments-orange {
  color: #f57f20;
}
.card--saved-expiry {
  margin-left: 43px;
}
.card--input {
  height: 50px !important;
  width: -webkit-fill-available;
  margin-top: 20px;
}
.card--delete {
  float: right;
}
.paymentbody--input-wrap-saved-cards{
  min-height: 4rem;
  margin: .5em;
}
.card-payment-disabled-notification {
  padding: 35px;
  border-radius: 5px;
  background-color: #E8F3FC;
  color: #0F4176;
  font-size: 14px;
}

.fake-input iframe {
  height: 40px;
  width: -webkit-fill-available;
  border-radius: 4px;
  padding-left: 20px;
  color: #606266;
  margin-top: 20px;
  border: 1px solid #909399;
}
#cc-save-card {
  height: 40px;
  display: flex;
  align-items: center;
  margin-top: 10px;
}
.fake-checkbox iframe {
  height: 14px;
  width: 14px;
  margin-right: 10px;
  margin-bottom: -3px;
}
.fake-checkbox-label {
  font-size: 14px;
}
.paymentbody--form form {
  padding-left: 10px;
  padding-right: 10px;
}
.cvv-expire-fields {
  display: flex;
}
#cc-expiration-date {
  width: 60%;
}
#cc-cvc {
  width: 30%;
  padding-left: 10%;
}
.amount-input {
  display: flex;
  align-items: center;
}
.amount-input .fake-input {
  width: 90%;
}
.amount-input .fake-input iframe {
  border-radius: 0px 5px 5px 0px !important;
}
.prepend-currency {
  font-size: 13px;
  width: 13%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  margin-bottom: -16px;
  background: #EBEEF5;
  border: 1px solid #909399;
  border-radius: 5px 0px 0px 5px;
}
.card-payment-saved-cards-title {
  letter-spacing: 1.5px;
  text-transform: uppercase;
  font-weight: 500;
  font-size: 11px;
  margin: 0px 0px 10px 0px;
  color: #527CBD;
}
.card-payment-saved-cards-label {
  color: #909399;
  letter-spacing: 0.03em;
  font-size: 14px;
}
.card-payment-saved-cards-icon {
  color: #EA7125;
  margin-right: 20px;
}
.card-payment-saved-card-radio {
  margin: 0px 10px 0px 10px;
}
.card-payment-remove-cards-icon {
  margin-left: auto;
  color: red;
  margin-right: 10px;
}
.card-payment-saved-cards-row {
  height: 35px;
  display: flex;
  align-items: center;
  color: #606266;
  letter-spacing: 0.03em;
  font-size: 14px;
  cursor: pointer;
}
.card-payment-add-card-holder {
  margin: 10px 0px 5px 0px;
  display: flex;
  align-items: center;
  cursor: pointer;
}
.card-payment-add-card {
  align-items: flex-end;
  letter-spacing: 0.04em;
  font-weight: 500;
  font-size: 14px;
  color: #527CBD;
  margin-left: 8px;
}
.card-payment-add-card-icon {
  color: #527CBD;
}
.saved-card-amount {
  display: flex;
  margin: 25px 0px 10px 0px;
}
.saved-card-amount-input {
  height: 38px;
  width: -webkit-fill-available;
  border-radius: 0px 5px 5px 0px;
  border: 1px solid #527CBD;
  padding-left: 20px;
}
.saved-cards-container {
  width: 95%;
  margin: auto;
}
.saved-card-prepend {
  border: 1px solid #527CBD !important;
}
.card-payment-back-option {
  margin-left: 10px;
  color: #517cbd;
  font-size: 13px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}
.card-payment-back-arrow {
  cursor: pointer;
}
.card-payment-amount-input {
  height: 38px;
  width: -webkit-fill-available;
  padding-left: 20px;
  color: #606266;
  border: 1px solid #909399;
  border-radius: 0px 5px 5px 0px;
}
.card-payment-flex {
  display: flex;
}
.inactive-payment-button {
  pointer-events: none;
}
.loader-height-override {
  height: 50px !important;
}
.saved-cards-delete-dialogue {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #ffffffa8;
  display: flex;
  justify-content: center;
}
.saved-cards-delete-dialogue-container {
  width: 75%;
  background: #e8f3fc;
  height: 100px;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10%;
  color: #527CBD;
  text-align: center;
  font-size: 14px;
}
.delete-saved-card-dialogue-buttons {
  padding: 5px 10px 5px 10px;
  margin: 5px;
  border: 1px solid;
  border-radius: 5px;
  cursor: pointer;
}
</style>
