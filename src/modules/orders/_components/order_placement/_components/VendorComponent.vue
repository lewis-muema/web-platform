<template lang="html">
    <div class="">
        <div class="home-view--seperator">
        </div>
        <div class="homeview--form__header homeview--form__header-lower">
            Load Size And Delivery Type
        </div>
        <div class="home-view-vendor-classes">
            <div class="home-view-vendor-classes--title" v-if="first_time">
                What size of load do you want delivered?
            </div>
            <div class="home-view-vendor-classes--body">
                <div class="">
                    <div class="home-view-vendor-classes--label">
                        <div class="home-view-vendor-classes-label-item" v-for="(vendor_class, index) in get_price_request_object.economy_price_tiers" :key="index" @click="setActivePackageClass(vendor_class.tier_group)" v-if="vendor_class.price_tiers.length > 0">
                            <a class="home-view-vendor-classes-menu section__link" :class="get_current_active_package__class(vendor_class.tier_group)"><img :src="getPackageIcon(vendor_class.tier_group)" class="home-view-vendor-classes-menu--img" alt="vendor_class.tier_group"> <span class="home-view-vendor-classes-menu--span">{{vendor_class.tier_group}}</span></a>
                        </div>
                    </div>
                </div>
                <div class="home-view-vendor-types" v-if="active_price_tier_data != '' ">
                    <div  v-for="j in active_price_tier_data.price_tiers" :key="j.order_no" @click="set_active_vendor_name(j.vendor_name);set_active_vendor_details(j);" class="home-view-vendor-types--item" :class="get_current_active_vendor_type_class(j.vendor_name)" >
                        <div class="home-view-vendor-types-item home-view-vendor-types-item--vendor-wrapper">
                            <div class="home-view-vendor-types-item--vendor-wrapper__img">
                                <img class="home-view-vendor-types-item__image" :src="getVendorIcon(j.vendor_id)" alt="">
                            </div>
                            <div class="home-view-vendor-types-item--vendor-wrapper__vendor">
                                {{j.vendor_name}}
                            </div>
                        </div>
                        <!-- <div class="home-view-vendor-types-item">

                        </div> -->
                        <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper">
                            <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-left">
                                <div class="home-view-vendor-types-item--cost-wrapper__cost">
                                    Ksh {{formatNumeral(j.cost)}}
                                </div>
                                <div class="home-view-vendor-types-item--cost-wrapper_time">
                                    Delivery by {{transformDate(j.eta)}}
                                </div>
                            </div>
                            <div class="home-view-vendor-types-item home-view-vendor-types-item--cost-wrapper-right">
                                <el-popover
                                    placement="right"
                                    width="350"
                                    trigger="hover">
                                    <div class="reset-font" v-html="j.tier_description"></div>
                                    <span slot="reference"><i class="el-icon-info"></i></span>
                                  </el-popover>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

        </div>
        <div class="" v-if="get_active_package_class != '' ">
            <order-options v-on:destroyOrderOptions="destroyVendorComponent()"></order-options>
        </div>
      </div>
</template>

<script>
import numeral from 'numeral';
import { mapActions, mapGetters, mapMutations } from 'vuex'
import OrderOptions from './OrderOptions.vue'
export default {
    components:{OrderOptions},
    data () {
        return {
            first_time : false,
            popover_visible: false
        }
    },
    computed :{
        ...mapGetters({
          get_price_request_object : '$_orders/$_home/get_price_request_object',
          get_active_package_class : '$_orders/$_home/get_active_package_class',
          get_active_vendor_name : '$_orders/$_home/get_active_vendor_name'
        }),
        active_price_tier_data: function (){
            if(this.get_active_package_class != ""){
                return this.get_price_request_object.economy_price_tiers.find(
                    pack => pack.tier_group === this.get_active_package_class
                )
            }
            return "";
        },
    },
    methods:{
        ...mapMutations({
          set_active_package_class : '$_orders/$_home/set_active_package_class',
          set_active_vendor_name : '$_orders/$_home/set_active_vendor_name',
          set_active_vendor_details : '$_orders/$_home/set_active_vendor_details',
        }),
        setActivePackageClass(name){
            this.set_active_package_class(name);
        },
        getVendorIcon(id){
            return "https://images.sendyit.com/web_platform/vendor_type/side/"+id+".svg";
        },
        getPackageIcon(name){
            return "https://images.sendyit.com/web_platform/vendor_size/"+name+".svg?q=1"
        },
        get_current_active_package__class(name){
            return{
                'router-link-active' : name == this.get_active_package_class
            }
        },
        get_current_active_vendor_type_class(name){
            return {
                'home-view-vendor-types--item__active' : name == this.get_active_vendor_name
            }
        },
        transformDate(eta){
            // return this.moment().duration(eta, "seconds").humanize()
            return this.moment().add(eta, 'seconds').format("HH.mm");
        },
        formatNumeral(num){
            return numeral(num).format('0,0');
        },
        setFirstTimeUser(){
            let session = this.$store.getters.getSession;
            if(session.hasOwnProperty('first_time')){
                if(session.first_time != false){
                    this.first_time = true
                }
            }
        },
        destroyVendorComponent(){
            console.log('in destroyVendorComponent');
            this.set_active_vendor_name('');
            this.set_active_vendor_details({});
            this.$emit('vendorComponentDestroyed');
            this.$destroy();
        }
    },
    created(){
        this.setFirstTimeUser();
    }
}
</script>

<style lang="css" scoped>
    @import "../../../../../assets/styles/orders_order_placement_vendors.css";
</style>
