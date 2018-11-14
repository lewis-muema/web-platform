<template lang="html">
  <div class="screen-one">
    <div class="form-header">
      Join the {{getBizName}} business account on Sendy
    </div>
    <div class="form-inputs">
      <div class="row-defined">
        <div class="input-field">
          <input id="first_name" class="input-classy2" placeholder="First Name" type="text" v-model="f_name" @focus="setCurrentStep(1)">
        </div>
        <div class="input-field">
          <input id="last_name" placeholder="Last Name" class="input-classy2" type="text" v-model="l_name" @focus="setCurrentStep(1)">
        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <input class="input-classy" placeholder="Email" id="email" type="email" v-model="email" @focus="setCurrentStep(2)">
        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <input class="input-classy" placeholder="Phone Number" id="phone" type="text" v-model="phone" @focus="setCurrentStep(3)">
        </div>
      </div>
    </div>
    <div class="divide"></div>
    <div class="form-submits">
      <a class="waves-effect">Back</a>
      <button v-on:click="next_view" class="btn waves-effect waves-light blue" name="next" id="nextBtn">Next
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'

export default {
  name: 'screen-one-component',
  data: function () {
    return {
      f_name:"",
      l_name:"",
      phone:"",
      email : ""
    }
  },
  methods: {
    ...mapMutations(
      {
        setViewState:'$_external/setViewState',
        updateViewStep:'$_external/updateViewStep'
      }
    ),
    next_view: function ()
    {
      this.setViewState(2);
    },
    setCurrentStep: function (step){
        this.updateViewStep(step);
        // this.$store.commit('updateViewStep', num);
    }
  },
  computed : {
      ...mapGetters({
          // 'getType',
          // 'getBizEmail',
          getBizName:'$_external/getBizName',
          // 'getName'
        }
      ),
    is_valid : function() {
      return this.f_name != '' && this.l_name !='' && this.phone != '' && this.email !='';
    },
    is_type : function() {
      if (this.getType == 0) {
        return true
      }
      else {
        return false
      }
    }
  },
  mounted(){
    if (this.getType == 0) {
      var that = this
      setTimeout(function(){
        let name = that.getBizName
        let pers = that.getName
        var res = pers.split(" ")
        $('#email').val(that.getBizEmail);
        that.email = that.getBizEmail
        $("#emailabel").addClass("active");

        $('#first_name').val(res[0]);
        that.f_name = res[0]
        $("#fnamelabel").addClass("active");

        $('#last_name').val(res[1]);
        that.l_name = res[1]
        $("#lnamelabel").addClass("active");
      }, 100);
    }
  }
}
</script>

<style lang="css">
.input-field{
  width: 29%;
  left: auto;
  right: auto;
  padding: 0 .75rem;
  min-height: 1px;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;

}
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
  width: 100%;
  font-size: 16px;
  margin: 0 0 8px 0;
  padding: 0;
}
.input-classy2{
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #9e9e9e;
  border-radius: 0;
  outline: none;
  height: 3rem;
  width: 100%;
  font-size: 16px;
  margin: 0 0 8px 0;
  padding: 0;
}
.waves-effect{
  position: relative;
  cursor: pointer;
  display: inline-block;
  overflow: hidden;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
  vertical-align: middle;
  z-index: 1;
  transition: .3s ease-out;
  box-shadow: none;
  background-color: transparent;
  color: #343434;
  height: 36px;
  line-height: 36px;
  padding: 0 16px;
  text-transform: uppercase;
}
.row-defined{
  flex-direction: row;
  display: flex;
  width: 120%;
}
.row{
  width: 120%
}


</style>
