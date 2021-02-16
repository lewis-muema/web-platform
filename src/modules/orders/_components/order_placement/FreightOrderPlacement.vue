<template lang="html">
  <div>
    <div
      v-if="!loadingStatus && !parent_order"
      class="homeview--outer-override"
    >
      <div
        v-if="phase === 1"
        class="homeview--input-products block"
      >
        <div class="homeview--input-categories">
          {{$t('general.goods_type')}}
        </div>
        <select
          v-model="productCategoryId"
          class="homeview--input-categories"
          @change="selectCategory()"
        >
          <option
            v-for="category in categories"
            :key="category.id"
            :value="category.id"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <fbu-containers
        v-if="productCategoryId === 1"
        @clicked="changePhase"
      />
    </div>
    <div>
      <a
        v-if="parent_order"
        class="back--button"
        @click="set_parent_order('')"
      >
        <i class="el-icon-back" />
      </a>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import orderPlacementStore from './_store';
import SessionMxn from '../../../../mixins/session_mixin';
import FbuContainersFlow from './_components/FbuContainersFlow.vue';
import NotificationMxn from '../../../../mixins/notification_mixin';

export default {
  name: 'OrderPlacement',

  components: {
    'fbu-containers': FbuContainersFlow,
  },
  mixins: [SessionMxn, NotificationMxn],
  data() {
    return {
      productCategoryId: 1,
      phase: 1,
      loadingStatus: true,
      categories: [],
      loading: false,
      locations: [],
      countdown: '',
    };
  },
  computed: {
    ...mapGetters({
      getOuterPriceRequestData: '$_orders/getOuterPriceRequestData',
      parent_order: '$_orders/getParentOrder',
    }),
  },
  created() {
    this.instantiateHomeComponent();
    this.$nextTick(() => {
      this.requestCategories();
    });
  },
  mounted() {
    this.checkSessionData();
  },
  destroyed() {
    clearInterval(this.countdown);
    this.$root.$emit('Countdown status', false);
    this.destroyOrderPlacement();
  },
  methods: {
    ...mapMutations({
      setProductCategories: '$_orders/$_home/setProductCategories',
      setProductId: '$_orders/$_home/setProductId',
      set_parent_order: '$_orders/setParentOrder',
    }),

    ...mapActions({
      requestFreightProductCategories: '$_orders/$_home/requestFreightProductCategories',
    }),
    requestCategories() {
      const that = this;
      this.loadingStatus = true;
      const payload = {
        app: 'AUTH',
        endpoint: 'vendors/freight_categories',
      };
      clearInterval(this.countdown);
      this.requestFreightProductCategories(payload).then(
        (response) => {
          this.loadingStatus = false;
          response.products.forEach((row, i) => {
            this.categories.push(row);
            const productRows = {
              index: i,
              data: row,
            };
            this.setProductCategories(productRows);
            this.setProductId(this.productCategoryId);
          });
        },
        // eslint-disable-next-line no-unused-vars
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error, 'count_down') && error.count_down.show_count_down) {
            // eslint-disable-next-line no-param-reassign
            let secs = error.count_down.seconds;
            this.countdown = setInterval(() => {
              if (secs === 0) {
                that.requestCategories();
              } else {
                secs -= 1;
              }
            }, 1000);
            this.$root.$emit('Countdown status', true, error.count_down);
          } else {
            this.doNotification(2, this.$t('general.could_not_fetch_freight_categories'), this.$t('general.please_try_again'));
          }
        },
      );
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },

    selectCategory() {
      this.setProductId(this.productCategoryId);
      // eslint-disable-next-line default-case
      switch (this.productCategoryId) {
        case 1: {
          break;
        }
        case 2: {
          break;
        }
        case 3: {
          this.$router.push('/orders');
          break;
        }
        case 4: {
          break;
        }
      }
    },
    changePhase(value) {
      this.phase = value;
    },
    destroyOrderPlacement() {
      try {
        this.$store.unregisterModule(['$_orders', '$_home']);
      } catch (er) {
        // console.log('failed to unregisterModule $_orders $_home on order placement home', er);
      }

      // do not unregister payments module since we do not expect any conflicts with the payment page state

      this.$destroy();
    },

    registerOrderPlacementModule() {
      let moduleIsRegistered = false;
      try {
        moduleIsRegistered = this.$store._modules.root._children.$_orders._children.$_home !== undefined;
      } catch (er) {
        //
      }

      if (!moduleIsRegistered) {
        this.$store.registerModule(['$_orders', '$_home'], orderPlacementStore);
      }
    },

    instantiateHomeComponent() {
      this.registerOrderPlacementModule();
    },
    checkSessionData() {
      const session = this.$store.getters.getSession;
      const acc = session[session.default];
      if (!acc.hasOwnProperty('country_code')) {
        this.$router.push({ path: '/auth/sign_in' });
      }
    },
  },
};
</script>

<style lang="css">
@import '../../../../assets/styles/orders_order_placement.css?v=2';
</style>
<style scoped>
/* unfortunately browser vendors dont care about BEM */
::-webkit-scrollbar {
  width: 12px;
}
/* Track */
::-webkit-scrollbar-track {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.1);
}
/* Handle */
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 5px;
  border-radius: 5px;
  background: #007FFF;
}
::-webkit-scrollbar-thumb:window-inactive {
  background-color: rgba(0, 0, 0, 0.2);
}
.back--button {
  position: absolute;
  top: 10px;
  left: 10px;
  border: 1px solid #55555500;
  background-color: #fff;
  border-radius: 50%;
  padding: 15px;
  font-size: larger;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2), 0 -1px 0px rgba(0,0,0,0.02);
  cursor: pointer;
  color: #555;
}
</style>
