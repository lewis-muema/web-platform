<template lang="html">
  <div class="screen-three">
    <div class="form-header">
      Set a Password
    </div>
    <div class="form-inputs">
      <div class="row">
        <div class="input-field2">
          <input id="password" class="input-classy" placeholder="Create Password" type="password"  v-model="password" @focus="setCurrentStep(1)">
        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <input id="cpassword" class="input-classy" placeholder="Confirm Password" type="password"  v-model="cpassword" @focus="setCurrentStep(2)">
        </div>
      </div>
    </div>
    <div class="divide"></div>
    <div class="form-submits">
      <a v-on:click="last_view" class="waves-effect waves-teal btn-flat">Back</a>
      <button v-on:click="next_view" class="btn waves-effect waves-light blue" name="next" id="nextBtn">Next
        <i class="material-icons right">send</i>
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
export default {
  name: 'screen-three-component',
  data: function () {
    return {
      password : "",
      cpassword: ""
    }
  },
  methods: {
    ...mapMutations(
      {
        setViewState:'$_external/setViewState',
      }
    ),
    next_view: function ()
    {
      this.setViewState(4);
    },
    last_view: function(){
      this.setViewState(2);
    },
    setCurrentStep: function (num){
        this.$store.commit('updateViewStep', num);
    }
  },
  computed : {
    is_valid : function() {
      return this.password != '' && this.cpassword !='' && this.password === this.cpassword;
    }
  }
}
</script>

<style lang="css">
.input-field2{
  width: 76%;
  left: auto;
  right: auto;
  padding: 0 .75rem;
  min-height: 1px;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;

}
.input-classy{
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0;
  outline: none;
  height: 3rem;
  width: 80%;
  font-size: 16px;
  margin: 0 0 8px 0;
  padding: 0;
}
</style>
