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
                        <div class="home-view-vendor-classes-label-item" v-for="(vendor_class, index) in get_price_request_object.economy_price_tiers" :key="index" @click="setActivePackageClass(index)" @click="setActivePackageClass(index)">
                            {{index}}
                        </div>
                        <!-- <div class="home-view-vendor-classes-label-item">
                            medium
                        </div>
                        <div class="home-view-vendor-classes-label-item">
                            large
                        </div> -->
                    </div>
                </div>
                <div class="home-view-vendor-types" v-if="active_vendor_price_data != '' ">
                    <div class="home-view-vendor-types--item" v-for="vendor in active_vendor_price_data" :key="vendor.vendor_name">
                        {{vendor.vendor_name}}
                    </div>
                </div>
                <!-- <div class="">
                    <div class="">
                        choose payment
                    </div>
                    <div class="">
                        add note
                    </div>
                    <div class="">
                        schedule
                    </div>
                </div> -->
            </div>

        </div>
      </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
    data () {
        return {
            active_package_class : ""
        }
    },
    computed :{
        ...mapGetters({
          get_price_request_object : '$_orders/$_home/get_price_request_object',
          get_active_package_class : '$_orders/$_home/get_active_package_class'
        }),
        active_vendor_price_data (){
            if(this.get_active_package_class != ""){
                return this.get_price_request_object.economy_price_tiers[this.get_active_package_class];
            }
            return "";
        },
    },
    methods:{
        ...mapMutations({
          set_active_package_class : '$_orders/$_home/set_active_package_class'
        }),
        setActivePackageClass(name){
            this.set_active_package_class(name);
            console.log('name',name)
        },
    }
}
</script>

<style lang="css" scoped>
    .home-view--seperator{
        border-top: 1px solid #6663;
        margin-left: -20px;
        margin-right: -20px;
    }
    .home-view-vendor-classes{

    }
    .home-view-vendor-classes--title{
        text-align: center;
        font-weight: normal;
        padding: 20px;
    }
    .home-view-vendor-classes--body{

    }
    .home-view-vendor-classes--icons, .home-view-vendor-classes--label, .home-view-vendor-classes-icons-item, .home-view-vendor-classes-label-item{
        display: flex;
    }
    .home-view-vendor-classes-icons-item, .home-view-vendor-classes-label-item{
        flex: 1;
        justify-content: center;
        align-items: center;
    }
    .home-view-vendor-classes--icons{

    }
    .home-view-vendor-classes--label{
        padding: 5px 0px;
    }
    .home-view-vendor-classes-icons-item--img{
        width: 30px;
        max-height: 30px;
    }
    .home-view-vendor-classes-label-item{
        text-transform: uppercase;
        font-size: smaller;
    }
    .home-view-vendor-classes-label-item, .home-view-vendor-classes-icons-item--img{
        cursor: pointer;
    }
    .home-view-vendor-types--item{
        border-radius: 5px;
        height: 2.5em;
        margin: 20px 0;
    }
    .home-view-vendor-types--item:hover, .home-view-vendor-types--item:active{
        border: 2px solid #1782c5;
    }

</style>
