<template lang="html">
  <div class="screen-one">
    <div class="form-header">
      Join the {{getBizName}} business account on Sendy
    </div>
    <div class="form-inputs">
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>Name</span>
          </label>
          <input id="first_name" class="form-control" placeholder="John Doe" type="text" v-model="name" @focus="setCurrentStep(1)">
        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>Email Address</span>
          </label>
          <input class="form-control" placeholder="you@email.com" id="email" type="email" v-model="email" @focus="setCurrentStep(2)">
        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>Phone Number</span>
          </label>
          <input class="form-control" placeholder="07XXXXXXX" id="phone" type="text" v-model="phone" @focus="setCurrentStep(3)">
        </div>
      </div>
    </div>
    <div class="divide"></div>
    <div class="form-submits">
      <a class="waves-effect">Back</a>
      <button v-on:click="next_view" class="btn-submit" style="width:30% !important;" name="next" id="nextBtn" v-bind:disabled="!this.is_valid">Next
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
      name:"",
      phone:"",
      email : ""
    }
  },
  methods: {
    ...mapMutations(
      {
        setViewState:'$_external/setViewState',
        updateViewStep:'$_external/updateViewStep',
        updateName:'$_external/updateName',
        updatePhone: '$_external/updatePhone',
        updateBizEmail :'$_external/updateBizEmail'
      }
    ),
    next_view: function ()
    {
      this.setViewState(2);
      this.updateName(this.name);
      this.updatePhone(this.phone);
      this.updateBizEmail(this.email);
      this.updateViewStep(0);
    },
    setCurrentStep: function (step){
        this.updateViewStep(step);
        // this.$store.commit('updateViewStep', num);
    }
  },
  computed : {
      ...mapGetters({
          getType : '$_external/getType',
          getBizEmail : '$_external/getBizEmail',
          getBizName:'$_external/getBizName',
          getName : '$_external/getName'
        }
      ),
    is_valid : function() {
      return this.f_name != '' && this.phone != '' && this.email !='';
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
    // if (this.getType == 0) {
    //   var that = this
    //   setTimeout(function(){
    //     let name = that.getBizName
    //     let pers = that.getName
    //     var res = pers.split(" ")
    //     $('#email').val(that.getBizEmail);
    //     that.email = that.getBizEmail
    //     $("#emailabel").addClass("active");
    //
    //     $('#first_name').val(res[0]);
    //     that.f_name = res[0]
    //     $("#fnamelabel").addClass("active");
    //
    //     $('#last_name').val(res[1]);
    //     that.l_name = res[1]
    //     $("#lnamelabel").addClass("active");
    //   }, 100);
    // }
  }
}
</script>

<style lang="css">
.form-header{
  word-wrap: break-word;
  line-height: 38px !important;
  letter-spacing: 0;
  font-size: 28px !important;
  font-weight: 300 !important;
  margin-bottom: 2rem;
  font-family: Slack-Lato,appleLogo,sans-serif;
  margin: 0 0 1rem;
  display: block;
  -webkit-margin-after: 0.67em;
  -webkit-margin-start: 0px;
  -webkit-margin-end: 0px;
  max-width: 600px;
}
.input-field{
  width: 50%;
  left: auto;
  right: auto;
  padding: 0 .75rem;
  min-height: 1px;
  position: relative;
  margin-top: 1rem;
  margin-bottom: 1rem;

}
.input-field2{
  width: 50% !important;
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
  width: 100%
}
.input-descript{
  margin: 0 0 .25rem;
 display: block;
 font-size: 1rem;
 line-height: 1.5rem;
 font-weight: 400!important;
 margin-bottom: .5rem!important;
}



</style>
