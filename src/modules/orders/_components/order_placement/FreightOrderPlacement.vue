<template lang="html">
  <div class="homeview--outer-override" v-if="!loadingStatus">
    <div class="homeview--input-products block" v-if="phase === 1">
      <div class="homeview--input-categories">Goods Type</div>
      <select class="homeview--input-categories" v-model="productCategoryId" @change="selectCategory()">
        <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
      </select>
    </div>
    <fbu-containers v-if="productCategoryId === 1" @clicked="changePhase"/>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import orderPlacementStore from './_store';
import SessionMxn from '../../../../mixins/session_mixin';
import FbuContainersFlow from './_components/FbuContainersFlow.vue';

export default {
  name: 'OrderPlacement',

  components: {
    'fbu-containers': FbuContainersFlow,
  },
  mixins: [SessionMxn],
  data() {
    return {
      productCategoryId: 1,
      phase: 1,
      loadingStatus: true,
      categories: [],
      loading: false,
      locations: [],
    };
  },
  computed: {
    ...mapGetters({
      getOuterPriceRequestData: '$_orders/getOuterPriceRequestData',
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
    this.destroyOrderPlacement();
  },
  methods: {
    ...mapMutations({
      setProductCategories: '$_orders/$_home/setProductCategories',
      setProductId: '$_orders/$_home/setProductId',
    }),

    ...mapActions({
      requestFreightProductCategories: '$_orders/$_home/requestFreightProductCategories',
    }),
    requestCategories() {
      this.loadingStatus = true;
      const payload = {
        app: 'AUTH',
        endpoint: 'vendors/freight_categories',
      };
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
        (error) => {
          console.log(error);
        },
      );
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
      this.clearLocationNamesModel();
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
        moduleIsRegistered =
          this.$store._modules.root._children.$_orders._children.$_home !== undefined;
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
      } else {
        this.$apm.setUserContext({
          id: acc.user_id,
          username: acc.user_name,
          email: acc.user_email,
        });
      }
    },
  },
};
</script>

<style lang="css">
@import '../../../../assets/styles/orders_order_placement.css?v=1';
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
  background: #1782c5;
}
::-webkit-scrollbar-thumb:window-inactive {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
