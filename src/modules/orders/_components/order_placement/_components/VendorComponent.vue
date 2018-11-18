<template lang="html">
    <div class="">
        <div class="home-view--seperator">
        </div>
        <div class="home-view-vendor-classes">
            <!-- <div class="home-view-vendor-classes--title">
                What size of load do you want delivered?
            </div> -->
            <div class="home-view-vendor-classes--body">
                <div class="">
                    <!-- <div class="home-view-vendor-classes--icons">
                        <div class="home-view-vendor-classes-icons-item">
                           <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/vendor_size/small.svg" alt="" class="home-view-vendor-classes-icons-item--img">
                        </div>
                        <div class="home-view-vendor-classes-icons-item">
                            <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/vendor_size/medium.svg" alt="" class="home-view-vendor-classes-icons-item--img">
                        </div>
                        <div class="home-view-vendor-classes-icons-item">
                            <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/vendor_size/large.svg" alt="" class="home-view-vendor-classes-icons-item--img">
                        </div>
                    </div> -->
                    <div class="home-view-vendor-classes--label">
                        <div class="home-view-vendor-classes-label-item" v-for="(vendor_class, index) in get_price_request_object.economy_price_tiers" :key="index" @click="setActivePackageClass(index)" v-if="vendor_class.length > 0">
                            <a class="section__link" :class="get_current_active_package__class(index)">{{index}}</a>
                        </div>
                    </div>
                </div>
                <div class="home-view-vendor-types" v-if="active_vendor_price_data != '' ">
                    <div  v-for="j in active_vendor_price_data" :key="j.order_no" @click="set_active_vendor_name(j.vendor_name)" class="home-view-vendor-types--item" :class="get_current_active_vendor_type_class(j.vendor_name)" >
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
                            <div class="home-view-vendor-types-item--cost-wrapper__cost">
                                KSh {{j.cost}}
                            </div>
                            <div class="home-view-vendor-types-item--cost-wrapper_time">
                                9.26pm
                            </div>
                        </div>
                    </div>
                </div>

            </div>

        </div>
        <div class="" v-if="get_active_package_class != '' ">
            <order-options></order-options>
        </div>
      </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import OrderOptions from './OrderOptions.vue'
export default {
    components:{OrderOptions},
    data () {
        return {
        }
    },
    computed :{
        ...mapGetters({
          get_price_request_object : '$_orders/$_home/get_price_request_object',
          get_active_package_class : '$_orders/$_home/get_active_package_class',
          get_active_vendor_name : '$_orders/$_home/get_active_vendor_name'
        }),
        active_vendor_price_data: function (){
            if(this.get_active_package_class != ""){
                return this.get_price_request_object.economy_price_tiers[this.get_active_package_class];
            }
            return "";
        },
    },
    methods:{
        ...mapMutations({
          set_active_package_class : '$_orders/$_home/set_active_package_class',
          set_active_vendor_name : '$_orders/$_home/set_active_vendor_name'
        }),
        setActivePackageClass(name){
            this.set_active_package_class(name);
        },
        getVendorIcon(id){
            return "https://images.sendyit.com/web_platform/vendor_type/side/"+id+".svg";
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
        }
    }
}
</script>

<style lang="css" scoped>
    @import "../../../../../assets/styles/orders_order_placement_vendors.css";

</style>
