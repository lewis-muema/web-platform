<template lang="html">
  <div class="user-invite-outer">
    <header-component></header-component>
    <bod-component></bod-component>
  </div>
</template>

<script>
// import Vue from 'vue'
import {mapGetters,mapMutations,mapActions} from 'vuex'
import external_store from './_store';
import RegisterStoreModule from '../../mixins/register_store_module'
import HeaderComponent from './components/HeaderComponent.vue'
import BodComponent from './components/BodComponent.vue'

export default {
  name:'External',
  mixins: [ RegisterStoreModule ],
  components: {HeaderComponent,BodComponent},
  created() {
    this.$store.registerModule('$_external', external_store);
  },
  mounted(){
    let token = this.$route.params.token;
    console.log('token',token);
    this.check_validity();
  },
  methods:{
    ...mapActions({
       requestTokenValidation :'$_external/requestTokenValidation',
   }),
    check_validity: function() {
      console.log("Checked");
      // console.log(this.$route.params.token);
        let values = {};
        values.token = this.$route.params.token;
        let full_payload = {
          values: values,
          vm: this,
          app: "NODE_PRIVATE_API",
          endpoint: ""
        };
        this.requestTokenValidation(full_payload).then(
          response => {
            console.log(response);
            if (response.length > 0) {
              response = response[0];
            }
            if (response.status == true) {
              console.log(response);
              console.log("Valid Token")
              this.$router.push("");
            } else {

              console.warn("Invalid Token");
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
