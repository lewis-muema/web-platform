<template lang="html">
    <div class="cop_info_container" id="cop_info_container">
      <div class="cop-edit-inner">

          <div class="company-edit2-details">
              Edit Company Details.
          </div>
          <div class="edit-cop-info-position">

              <div class="cop-edit-holder">
                <label class="cop-input-descript">
                  <span>Company Name</span>
                </label>
                  <input class="input-control cop-edit-form" type="text" autocomplete="off" v-model ="cop_name">
              </div>

              <div class="cop-edit-holder">
                <label class="cop-input-descript">
                  <span>Name of contact person</span>
                </label>
                  <input class="input-control cop-edit-form" type="text" v-model="contact_name">
              </div>

              <div class="cop-edit-holder">
                <label class="cop-input-descript">
                  <span>Email of Contact person</span>
                </label>
                  <input class="input-control cop-edit-form" type="text" v-model="contact_email">
              </div>

              <div class="cop-edit-holder">
                <label class="cop-input-descript">
                  <span>Phone number of Contact person</span>
                </label>
                <vue-tel-input class="form-control cop-edit-form" v-model.trim="phone" name="phone" value="" @onBlur="validate_phone" v-validate="'required|check_phone'" data-vv-validate-on="blur"
                                 :preferredCountries="['ke', 'ug', 'tz']">
                </vue-tel-input>
                <span v-show="errors.has('phone')" class="sign-up-phone-error">{{ errors.first('phone') }}</span>
              </div>

              <div class="sign-holder">
                  <button class="button-primary btn-edit-cop-info" type="submit" v-on:click="save_cop" >Save</button>
              </div>
          </div>
      </div>
    </div>
</template>

<script>
    import SessionMxn from '../../../mixins/session_mixin.js';
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'CompanyDetails',
        mixins: [SessionMxn],
        data: function () {
            return {
              cop_name:'',
              phone:'',
              contact_email : '',
              contact_name : '',
            }
        },
        mounted() {
          this.set_data();
        },
        methods: {

          validate_phone() {
            this.$validator.validate();
          },
          ...mapActions({
              requestCopInfo: '$_admin/requestCopInfo',
          }),
          set_data: function() {
            let session = this.$store.getters.getSession;
            this.cop_name = session[session.default]['cop_name'];
            this.phone = session[session.default]['cop_phone'];
            this.contact_email = session[session.default]['cop_email'];
            this.contact_name = session[session.default]['cop_contact_person'];
          },

          save_cop: function () {
            if (
              this.cop_name !== '' &&
              this.phone !== '' &&
              this.contact_email !== '' &&
              this.contact_name !== ''
            ){
              let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
              let phone_valid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));

            if (phone_valid) {


                 let phone = this.phone.replace(/[\(\)\-\s]+/g, '');

                 let session = this.$store.getters.getSession;

                      let values = {
                          'cop_id': session[session.default]['cop_id'],
                          'cop_name': this.cop_name,
                          'cop_contact_person': this.contact_name,
                          'cop_biz_email': this.contact_email,
                          'cop_biz_phone': phone,
                      };

                      let full_payload = {
                          'values': values,
                          'app': 'NODE_PRIVATE_API',
                          'endpoint': 'update_cop'
                      }

                      this.requestCopInfo(full_payload).then(response => {
                          if (response.status) {
                              let updated_session = session;
                              updated_session[session.default]['cop_name'] = this.cop_name;
                              updated_session[session.default]['cop_contact_person'] = this.contact_name;
                              updated_session[session.default]['cop_biz_email'] = this.contact_email;
                              updated_session[session.default]['cop_biz_phone'] = phone;


                              let new_session = JSON.stringify(updated_session);
                              this.setSession(new_session);

                              let level = 1; //success
                              this.message = 'Details Saved!';
                              let notification = {
                                'title': '',
                                'level': level,
                                'message': this.message,
                                 };

                              this.$store.commit('setNotification', notification);
                              this.$store.commit('setNotificationStatus', true);
                          }
                          else {
                              let level = 3;
                              this.message = 'Something went wrong.';
                              let notification = {
                                'title': '',
                                'level': level,
                                'message': this.message,
                                };

                              this.$store.commit('setNotification', notification);
                              this.$store.commit('setNotificationStatus', true);

                          }
                      }, error => {
                          console.log(error);
                      });

                }

                else {

                  let level = 3;
                  this.message = 'Invalid Phone Number';
                  let notification = {
                    'title': '',
                    'level': level,
                    'message': this.message,
                    };

                  this.$store.commit('setNotification', notification);
                  this.$store.commit('setNotificationStatus', true);
                }

            }
              else {

                let level = 3;
                this.message = 'Provide all details'
                let notification = {
                  'title': '',
                  'level': level,
                  'message': this.message,
                   };

                this.$store.commit('setNotification', notification);
                this.$store.commit('setNotificationStatus', true);

              }



          },

            },
        }
</script>

<style lang="css">
    @import "../../../assets/styles/datatable.css";
    @import "../../../../node_modules/vue-tel-input/dist/vue-tel-input.css";

    .company-edit2-details {
     font-size: 1.3rem;
     line-height: 1.7em;
     font-weight: 400;
     text-align: center;
     color: #666;
     margin-top: 18% !important;
     margin-left: 100px;
     margin-right: 60px;
    }

    .edit-cop-info-position {
     border-left: 2px solid rgb(23, 130, 197);
     padding-left: 80px;
    }
    .cop-edit-holder {
     margin: 1em;
     display: block;
     width: 83%;
    }
    .cop-input-descript{
     margin: 0 0 .25rem;
     display: block;
     font-size: 15px;
     line-height: 1.5rem;
     font-weight: 400!important;
     margin-bottom: .5rem!important;
     width:140%;
    }
    .cop-edit-form {
     height: 42px !important;
     width: 140% !important;
    }

    .btn-edit-cop-info{
     border-width:0px !important;
     margin-left: 15px !important;
    }
    .cop-edit-inner {
     max-width: 60rem;
     border-radius: 4px;
     padding: 2rem;
     font-family: 'Rubik', sans-serif;
     display: flex;
    }
    .edit-cop-info-position > div:nth-child(4) > div > div > ul {
    z-index: 9;
    width: 326px;
    margin-top: 8px;
    margin-left: -15px;
   }
</style>
