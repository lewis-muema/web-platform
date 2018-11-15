<template lang="html">
  <div class="screen-two">
    <div class="form-header">
      Connect your personal Sendy account
    </div>
    <div class="form-inputs">
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>Personal Email</span>
          </label>
          <input id="perEmail" class="form-control" type="email" placeholder="you@email.com"  v-model="per_email" @focus="setCurrentStep(1)" >

        </div>
      </div>
    </div>
    <div class="divide"></div>
    <div class="form-submits">
      <a v-on:click="last_view" class="waves-effect waves-teal btn-flat">Back</a>
      <button v-on:click="next_view" class="btn-submit" style="width:30% !important;" name="next" id="nextBtn">Next
      </button>
    </div>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'

export default {
  name: 'screen-two-component',
  data: function () {
    return {
      per_email : ""
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
      this.setViewState(3);
    },
    last_view: function(){
        this.setViewState(1);
    },
    setCurrentStep: function (num){
        this.$store.commit('updateViewStep', num);
    },
  },
  computed : {
    is_valid : function() {
      return this.per_email != '';
    }
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
.input-descript{
  margin: 0 0 .25rem;
 display: block;
 font-size: 1rem;
 line-height: 1.5rem;
 font-weight: 400!important;
 margin-bottom: .5rem!important;
}
</style>
