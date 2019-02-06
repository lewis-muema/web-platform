<template lang="html">

<div class="">
    <div class="home-view--seperator">
    </div>
    <div class="homeview--form__header homeview--form__header-lower">
        Load Size And Delivery Type
    </div>
    <div class="home-view-vendor-classes">
        <div class="home-view-vendor-classes--body">
            <div class="">
                <div class="home-view-vendor-classes--label">
                    <div class="home-view-vendor-classes-label-item" v-for="(vendor_class, index) in getPriceRequestObject.economy_price_tiers" :key="index" @click="setActivePackageClassWrapper(vendor_class.tier_group)" 
                        v-if="vendor_class.price_tiers.length > 0">
                        <a class="home-view-vendor-classes-menu section__link" :class="getCurrentActivePackageClass(vendor_class.tier_group)">
                          <img :src="getPackageIcon(vendor_class.tier_group)" class="home-view-vendor-classes-menu--img" alt="vendor_class.tier_group">
                          <span class="home-view-vendor-classes-menu--span">{{vendor_class.tier_group}}</span>
                        </a>
                    </div>
                </div>
            </div>
            <div class="home-view-vendor-types" v-if="activePriceTierData != '' ">
                <div v-for="j in activePriceTierData.price_tiers" :key="j.order_no" @click="setVendorDetails(j);">
                  <div class="home-view-vendor-types--item home-view-vendor-types-item-wrap" :class="getCurrentActiveTendorTypeClass(j.vendor_name)">
                      <div class="home-view-vendor-types-item home-view-vendor-types-item--vendor-wrapper">
                          <div class="home-view-vendor-types-item--vendor-wrapper__img">
                              <img class="home-view-vendor-types-item__image" :src="getVendorIcon(j.vendor_id)" alt="">
                          </div>
                          <div class="home-view-vendor-types-item--vendor-wrapper__vendor">
                              {{j.vendor_name}}
                          </div>
                      </div>

                      <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper">
                          <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-left">
                              <div class="home-view-vendor-types-item--cost-wrapper__cost">
                                  Ksh {{getVendorPrice(j)}}
                              </div>
                              <div class="home-view-vendor-types-item--cost-wrapper_time">
                                  Pickup by {{transformDate(j)}}
                              </div>
                          </div>
                          <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-right">
                              <el-popover placement="right" width="350" trigger="hover">
                                  <div class="reset-font" v-html="j.tier_description"></div>
                                  <span slot="reference"><i class="el-icon-info"></i></span>
                              </el-popover>
                          </div>
                      </div>
                      <div class="home-view-carrier-type" v-if="vendors_with_fixed_carrier_type.includes(j.vendor_name) === false && j.vendor_name === get_active_vendor_name">
                          <div class="home-view-carrier-type--item">
                            <el-radio v-model="carrier_type" label="2" @input="dispatchCarrierType">Any</el-radio>
                          </div>
                          <div class="home-view-carrier-type--item">
                            <el-radio v-model="carrier_type" label="1" @input="dispatchCarrierType">{{getCarrierBoxName()}}</el-radio>

                          </div>
                          <div class="home-view-carrier-type--item">
                            <el-radio v-model="carrier_type" label="0" @input="dispatchCarrierType">{{getCarrierNoBoxName()}}</el-radio>
                          </div>
                        </transition>
                  </div>
                </div>
            </div>
        </div>
    </div>
    <div class="" v-if="get_active_package_class !== '' ">
        <order-options v-on:destroyOrderOptions="destroyVendorComponent()"></order-options>
    </div>
</div>
</div>

</template>

<script>
import numeral from 'numeral';
import {
  mapActions,
  mapGetters,
  mapMutations
}
from 'vuex';
import OrderOptions from './OrderOptions.vue';

export default {
  components: {
    OrderOptions
  },
  data() {
    return {
      first_time: false,
      popover_visible: false,
      carrier_type: '2',
      vendors_with_fixed_carrier_type: ['Standard','Runner', 'Van'],
      vendors_without_return: ['Standard','Runner'],
    }
  },
  computed: {
    ...mapGetters({
      get_active_package_class: '$_orders/$_home/get_active_package_class',
      get_active_vendor_name: '$_orders/$_home/get_active_vendor_name',
      get_carrier_type: '$_orders/$_home/get_carrier_type',
      getPriceRequestObject: '$_orders/$_home/get_price_request_object',
      getReturnStatus : '$_orders/$_home/getReturnStatus',
    }),

    activePriceTierData: function() {
      if (this.get_active_package_class !== '') {
        return this.getPriceRequestObject.economy_price_tiers.find(
          pack => pack.tier_group === this.get_active_package_class
        )
      }
      return '';
    },

  },

  methods: {
    ...mapMutations({
      setActivePackageClass: '$_orders/$_home/set_active_package_class',
      setActiveVendorName: '$_orders/$_home/set_active_vendor_name',
      setActiveVendorDetails: '$_orders/$_home/set_active_vendor_details',
      setCarrierType: '$_orders/$_home/set_carrier_type',
    }),

    dispatchCarrierType: function() {
      let type = this.carrier_type;
      this.setCarrierType(type);
    },

    setActivePackageClassWrapper(name) {
      this.setActivePackageClass(name);
      this.trackMixpanelEvent(`Switch To Size: ${name}`);
    },

    getVendorIcon(id) {
      return `https://images.sendyit.com/web_platform/vendor_type/side/${id}.svg`;
    },

    getPackageIcon(name) {
      return `https://images.sendyit.com/web_platform/vendor_size/${name}.svg?q=1`;
    },

    getCurrentActivePackageClass(name) {
      return {
        'router-link-active': name === this.get_active_package_class
      };
    },

    getCurrentActiveTendorTypeClass(name) {
      return {
        'home-view-vendor-types--item__active': name === this.get_active_vendor_name
      };
    },

    transformDate(vendor_details) {
      // let start = this.moment();
      // let end   = this.moment().add(eta, 'seconds');
      // return end.from(start);
      if (vendor_details.hasOwnProperty('customer_eta')) {
        return this.moment(vendor_details.customer_eta, 'YYYY-MM-DD HH:mm:ss').format('hh.mm a');
      }
      return this.moment().add(vendor_details.eta, 'seconds').format('hh.mm a');
    },

    getVendorPrice(vendorObject){
      if(this.getReturnStatus !== true || this.vendors_without_return.includes(vendorObject.vendor_name)){
        return numeral(vendorObject.cost).format('0,0');
      }
      return numeral(vendorObject.return_cost).format('0,0');
    },

    setFirstTimeUser() {
      let session = this.$store.getters.getSession;
      if (session.hasOwnProperty('first_time')) {
        if (session.first_time !== false) {
          this.first_time = true;
        }
      }
    },

    destroyVendorComponent() {
      this.setActiveVendorName('');
      this.setActiveVendorDetails({});
      this.setCarrierType(this.carrier_type);
      this.$emit('vendorComponentDestroyed');
      this.$destroy();
    },

    getCarrierBoxName() {
      return this.get_active_package_class === 'small' ? 'Box' : 'Closed';
    },

    getCarrierNoBoxName() {
      return this.get_active_package_class === 'small' ? 'No Box' : 'Open';
    },

    setVendorDetails(vendorObject){
      this.setActiveVendorName(vendorObject.vendor_name);
      this.setActiveVendorDetails(vendorObject);
      this.trackMixpanelEvent(`Select Vendor: ${vendorObject.vendor_name}`);
    },

    trackMixpanelEvent(name){
      let analytics_env = '';
      try {
        analytics_env = process.env.CONFIGS_ENV.ENVIRONMENT;
      } 
      catch (er) {

      }

      try{
        if(analytics_env === 'production'){
          mixpanel.track(name);
        }
      }
      catch(er){

      }
    },

  },

  created() {
    this.setFirstTimeUser();
  },

  mounted() {
    this.setCarrierType(this.carrier_type);
  },

}

</script>

<style lang="css" scoped>

  @import "../../../../../assets/styles/orders_order_placement_vendors.css";

</style>
