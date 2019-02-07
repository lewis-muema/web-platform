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
            <div class="home-view-vendor-types" v-if="activePackageClassPriceData != '' ">
                <div v-for="j in activePackageClassPriceData.price_tiers" :key="j.order_no" @click="setVendorDetails(j);">
                  <div class="home-view-vendor-types--item home-view-vendor-types-item-wrap" :class="getCurrentActiveTendorTypeClass(j.vendor_name)">
                      <div class="home-view-vendor-types-item home-view-vendor-types-item--vendor-wrapper">
                          <div class="home-view-vendor-types-item--vendor-wrapper__img">
                              <img class="home-view-vendor-types-item__image" :src="getVendorIcon(j.vendor_id)" alt="">
                          </div>
                          <div class="home-view-vendor-types-item--vendor-wrapper__vendor">
                            <div class="home-view-vendor-types-item-vendor--vendor-formal-name">
                              {{j.vendor_name}}
                            </div>
                            <div class="home-view-vendor-types-item-vendor--vendor-local-name">
                              {{j.vendor_description}}
                            </div>
                          </div>
                      </div>

                      <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper">
                          <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-left">
                              <div class="home-view-vendor-types-item--cost-wrapper__cost">
                               <span v-if="j.price_variance > 0">
                                 Ksh {{getMinVendorPrice(j)}} - Ksh {{getMaxVendorPrice(j)}}
                               </span>
                               <span v-else>
                                 Ksh {{getVendorPrice(j)}}
                                </span>  
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
                      <transition name="home-carrier-type-fade">
                        <div class="home-view-carrier-type" v-if="expandVendorOptions(j)">
                          <div v-if="get_active_package_class === 'large'"  class="home-view-truck-options-wrapper">
                            <div class="home-view-truck-options-divider">

                            </div>
                            <div class="home-view-truck-options-inner-wrapper">
                              <div class="home-view-truck-options-label">
                                What type of truck do you want?
                              </div>
                              <div class="home-view-truck-options-inner--full-select">
                                <el-select v-model="carrier_type" placeholder="" >
                                  <el-option
                                    v-for="item in truckOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                  </el-option>
                                </el-select>
                              </div>
                            </div>
                            
                            <div class="home-view-truck-options-inner-wrapper" v-if="Number(carrier_type) === 3">
                              <div class="home-view-truck-options-label">
                                Temperature shouldn't exceed? (°C)
                              </div>
                              <div class="home-view-truck-options-inner--number-of-loaders">
                                <el-input-number v-model="max_temperature" @change="handleChangeInMaxTemperature" :min="1" :max="10"></el-input-number>
                              </div>
                            </div>

                            <div class="home-view-truck-options-inner-wrapper">
                              <div class="home-view-truck-options-label">
                                What do you want delivered?
                              </div>
                              <div>
                                <el-input placeholder="(Enter text)" v-model="delivery_item" autocomplete="true"></el-input>
                                <!-- TO DO: Handle autocomplete -->
                              </div>
                            </div>

                            <div class="home-view-truck-options-inner-wrapper">
                              <div class="home-view-truck-options-label">
                                What is the approximate weight of the load?
                              </div>
                              <div class="home-view-truck-options-inner--load-weight">
                                <el-input placeholder="(Enter load weight)" v-model="load_weight" >
                                  <el-select v-model="load_units" slot="append" placeholder="KG">
                                    <el-option label="KG" value="kgs"></el-option>
                                    <el-option label="Tonnes" value="tonnes"></el-option>
                                  </el-select>
                                </el-input>
                              </div>
                            </div>

                            <div class="home-view-truck-options-inner-wrapper">
                              <div class="home-view-truck-options-label">
                                Do you want us to provide you with Loader/s?
                              </div>
                              <div class="">
                                <el-radio v-model="additional_loader" label="1">Yes</el-radio>
                                <el-radio v-model="additional_loader" label="0">No</el-radio>
                              </div>
                            </div>

                            <div class="home-view-truck-options-inner-wrapper" v-if="Number(additional_loader) === 1">
                              <div class="home-view-truck-options-label">
                                How many Loaders do you require?
                              </div>
                              <div class="home-view-truck-options-inner--number-of-loaders">
                                <el-input-number v-model="number_of_loaders" @change="handleChangeInNumberOfLoaders" :min="1" :max="10"></el-input-number>
                              </div>
                            </div>


                          </div>
                          <div v-else class="home-view-carrier-type">
                            <div class="home-view-carrier-type--item">
                              <el-radio v-model="carrier_type" label="2" @input="dispatchCarrierType">Any</el-radio>
                            </div>
                            <div class="home-view-carrier-type--item">
                              <el-radio v-model="carrier_type" label="1" @input="dispatchCarrierType">{{getCarrierBoxName()}}</el-radio>
                            </div>
                            <div class="home-view-carrier-type--item">
                              <el-radio v-model="carrier_type" label="0" @input="dispatchCarrierType">{{getCarrierNoBoxName()}}</el-radio>
                            </div>
                          </div>
                          
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
      additional_loader:false,
      carrier_type: '2',
      number_of_loaders:1,
      max_temperature:4,
      delivery_item: '',
      load_weight:'',
      load_units:'',
      vendors_with_fixed_carrier_type: ['Standard','Runner', 'Van'],
      vendors_without_return: ['Standard','Runner'],
      baseTruckOptions: [
        {
          value: '0',
          label: 'Open'
        }, 
        {
          value: '1',
          label: 'Closed'
        }, 
      ],
    }
  },
  computed: {
    ...mapGetters({
      get_active_package_class: '$_orders/$_home/get_active_package_class',
      get_active_vendor_name: '$_orders/$_home/get_active_vendor_name',
      get_vendor_carrier_type: '$_orders/$_home/get_carrier_type',
      getPriceRequestObject: '$_orders/$_home/get_price_request_object',
      getReturnStatus : '$_orders/$_home/getReturnStatus',
      activeVendorPriceData: '$_orders/$_home/get_active_vendor_details',
    }),

    activePackageClassPriceData: function() {
      if (this.get_active_package_class !== '') {
        return this.getPriceRequestObject.economy_price_tiers.find(
          pack => pack.tier_group === this.get_active_package_class
        )
      }
      return '';
    },
    

    truckOptions: function(){
      let custom_vendor_options = {};
      if(this.activeVendorPriceData.hasOwnProperty('available_options')){
        if(this.activeVendorPriceData.available_options.refrigerated){
          custom_vendor_options.value = '3';
          custom_vendor_options.label = 'Refrigerated';
        }
        
        if(this.activeVendorPriceData.available_options.flatbed){
          custom_vendor_options.value = '4';
          custom_vendor_options.label = 'Flatbed';
        }
        
      }
      return this.baseTruckOptions.concat(custom_vendor_options);
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
      return `https://images.sendyit.com/web_platform/vendor_type/side/v2/${id}.svg`;
    },

    getPackageIcon(name) {
      return `https://images.sendyit.com/web_platform/vendor_size/v2/${name}.svg`;
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

    getPlainVendorPrice(vendorObject){
      if(this.getReturnStatus !== true || this.vendors_without_return.includes(vendorObject.vendor_name)){
        return vendorObject.cost;
      }
      return vendorObject.return_cost;
    },

    getVendorPrice(vendorObject){
      return numeral(this.getPlainVendorPrice(vendorObject)).format('0');
    },

    getMinVendorPrice(vendorObject){
      const price =  this.getPlainVendorPrice(vendorObject) * ((100 - vendorObject.price_variance)/100);
      return numeral(price).format('0');
    },

    getMaxVendorPrice(vendorObject){
      const price = this.getPlainVendorPrice(vendorObject) * ((100 + vendorObject.price_variance)/100);
       return numeral(price).format('0');
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

    expandVendorOptions(vendor){
      return !this.vendors_with_fixed_carrier_type.includes(vendor.vendor_name) && vendor.vendor_name === this.get_active_vendor_name;
    },

    setVendorDetails(vendorObject){
      this.setActiveVendorName(vendorObject.vendor_name);
      this.setActiveVendorDetails(vendorObject);
      this.reCheckCarrierType();
      this.trackMixpanelEvent(`Select Vendor: ${vendorObject.vendor_name}`);
    },

    reCheckCarrierType(){
      if(this.get_active_package_class === 'large' && Number(this.carrier_type) === 2){
        this.carrier_type = '1';
        this.dispatchCarrierType(); 
      }
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

    handleChangeInNumberOfLoaders(value) {
        console.log(value);
    },
    handleChangeInMaxTemperature(value){
      console.log(value);
    },

  },

  created() {
    this.setFirstTimeUser();
  },

  mounted() {
    this.reCheckCarrierType();
    this.setCarrierType(this.carrier_type); 
  },

  watch: {
    get_active_package_class(new_val,old_val){
      this.reCheckCarrierType();
    },
  },

}

</script>

<style lang="css" scoped>

  @import "../../../../../assets/styles/orders_order_placement_vendors.css";
  
</style>
