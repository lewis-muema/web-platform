<template lang="html">
  <div class="screen-three">
    <div class="onboarding-user-header">
      Set a Password
    </div>
    <div class="form-inputs">
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>Create Password</span>
          </label>
          <input id="password" class="form-control" type="password" placeholder="Enter your password"  v-model="password" @focus="setCurrentStep(1)" >

        </div>
      </div>
      <div class="row">
        <div class="input-field2">
          <label class="input-descript">
            <span>Confirm Password</span>
          </label>
          <input id="password" class="form-control" type="cpassword" placeholder="Confirm your password"  v-model="cpassword" @focus="setCurrentStep(2)" >

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
import {mapGetters,mapMutations,mapActions} from 'vuex'
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
        updatePassPlain:'$_external/updatePassPlain',
        updateViewStep:'$_external/updateViewStep'
      }
    ),
    ...mapActions({
       requestInvitation :'$_external/requestInvitation',
   }),
    next_view: function ()
    {  if (this.password !== this.cpassword) {
        console.log("Password does not match!")

      }
      else {

        let payload = {};
        this.updatePassPlain(this.cpassword);
        if (this.getType == 0) {
          let cop_id = this.getCopId;
          let user_id = this.getCopUserId ;
          let pass = this.cpassword;
          let name = this.getName;
          let biz_email = this.getBizEmail ;
          let personal_email = this.getPerEmail ;
          let phone = this.getPhone ;
          let type = this.getType ;
          let dept_id = this.getDeptId;
          let cop_user_id = this.getCopUserId ;


          payload = {
            cop_id :cop_id,
            user_id:user_id,
            password : pass,
            name : name,
            biz_email : biz_email,
            personal_email : personal_email,
            phone : phone,
            type : type,
            dept_id : dept_id,
            cop_user_id : cop_user_id
          };
        } else if (this.getType == 1) {

          let cop_id = this.getCopId;
          let pass = this.cpassword;
          let name = this.getName;
          let biz_email = this.getBizEmail ;
          let personal_email = this.getPerEmail ;
          let phone = this.getPhone ;
          let type = this.getType ;
          let dept_id = this.getDeptId;
          let cop_user_id = this.getCopUserId ;


          payload = {
            cop_id :cop_id,
            password : pass,
            name : name,
            biz_email : biz_email,
            personal_email : personal_email,
            phone : phone,
            type : type,
            dept_id : dept_id,
            cop_user_id : cop_user_id
        };
      }

        // this.updatePassPlain(this.cpassword);

        let full_payload = {
          values: payload,
          vm: this,
          app: "NODE_PRIVATE_API",
          endpoint: "onboard_user"
        };

        this.requestInvitation(full_payload).then(response => {

             if (response.length > 0) {
               response = response[0];
             }

             if (response.status == true) {
                console.log(response);
                this.setViewState(4);
                this.updateViewStep(0);

             } else {

               console.warn("Onboarding Failed");
               this.$router.push("/auth");
             }
        }, error => {
            console.error("Check Internet Connection")
            console.log(error);
        });

      }
  },
    last_view: function(){
      this.setViewState(2);
      this.updateViewStep(0);
    },
    setCurrentStep: function (step){
        this.updateViewStep(step);
    }
  },
  computed : {
    is_valid : function() {
      return this.password != '' && this.cpassword !='' && this.password === this.cpassword;
    },
    ...mapGetters({
        getName : '$_external/getName',
        getBizEmail : '$_external/getBizEmail',
        getPerEmail:'$_external/getPerEmail',
        getPhone : '$_external/getPhone',
        getType : '$_external/getType',
        getDeptId : '$_external/getDeptId',
        getCopId : '$_external/getCopId',
        getCopUserId : '$_external/getCopUserId'
      })
  }
}
</script>

<style lang="css">
.onboarding-user-header{
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
