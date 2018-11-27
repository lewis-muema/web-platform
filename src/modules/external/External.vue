<template lang="html">
  <div class="user-invite-outer">
    <header-component></header-component>
    <bod-component v-if="this.received_response == true"></bod-component>
  </div>
</template>

<script>
import Vue from "vue"
import {mapGetters,mapMutations,mapActions} from 'vuex'
import external_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import HeaderComponent from './components/HeaderComponent.vue'
import BodComponent from './components/BodComponent.vue'
import VeeValidate from 'vee-validate';
import { Validator } from 'vee-validate';
import VueTelInput from 'vue-tel-input'

Vue.use(VueTelInput)
Vue.use(VeeValidate);

Validator.extend('check_phone', {
       getMessage: field => `The phone number not valid`,
       validate: value => {
         const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
         var validity = false
         try {

           var number = phoneUtil.parse(value);
           validity = (phoneUtil.isValidNumber(number));
         } catch (e) {
           console.log(e)
           validity = false
         }
         return validity;
       }
   });

export default {
  data(){
    return {
      received_response : false,
    }
  },
  name:'External',
  mixins: [ RegisterStoreModule ],
  components: {HeaderComponent,BodComponent},
  created() {
    this.$store.registerModule('$_external', external_store);
  },
  mounted(){
    this.check_validity();
  },
  methods:{
    ...mapActions({
       requestTokenValidation :'$_external/requestTokenValidation',
   }),
   ...mapMutations(
     {
       updateCopID:'$_external/updateCopID',
       updateBizName:'$_external/updateBizName',
       updateDeptID:'$_external/updateDeptID',
       updatePerEmail:'$_external/updatePerEmail',
       updateName:'$_external/updateName',
       updateInviteType:'$_external/updateInviteType',
       updateCopUserID:'$_external/updateCopUserID'
     }
   ),
    check_validity: function() {
      console.log("Checked");
      let type = '';
      let content = this.$route.params.content;
      let tag = this.$route.params.tag;

        if (this.$route.params.type == 'link') {
          type = 1;
        }
        else if (this.$route.params.type == 'email') {
          type = 0;
        }
        let values = {};
        values.type = type;
        values.content = content;
        values.tag = tag;
        let full_payload = {
          values: values,
          vm: this,
          app: "NODE_PRIVATE_API",
          endpoint: "onboard_details"
        };
        this.requestTokenValidation(full_payload).then(
          response => {
            console.log(response);
            if (response.length > 0) {
              response = response[0];
            }

            if (response.status == true) {

              let dept_id = 1;
              if (response.data.department_id) {

                  dept_id = response.data.department_id ;
              }

              console.log(response);
              console.log("Valid Token");
              this.updateCopID(response.data.cop_id);
              this.updateBizName(response.data.cop_name);
              this.updateDeptID(dept_id);
              this.updatePerEmail(response.data.email);
              this.updateName(response.data.name);
              this.updateCopUserID(response.data.cop_user_id);
              this.updateInviteType(type);
              this.received_response = true;
              // this.$router.push("");
            } else {

              console.warn("Invalid Token");
              this.$router.push("/auth");
            }
          },
          error => {
            console.error("Check Internet Connection");
            console.log(error);
          }
        );
    }
  }
}
</script>

<style lang="css">
.user-invite-outer{
  background-color: #fcfcfc;
}
</style>
