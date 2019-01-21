<template lang="html">
    <div class="new-card2">
        <div class="help-card" style="width:400px;margin-left:30%;margin-top:30px;">
            <p style="margin-bottom: 20px;">
                <label class="input-descript">
                    <span>Name</span>
                </label>
                <input type="text" name="user_name" v-model="user_name" class="form-control profile1-dimen"/>
            </p>
            <p style="margin-bottom: 20px;">
                <label class="input-descript">
                    <span>Email</span>
                </label>
                <input type="text" name="user_email" v-model="user_email" class="form-control profile1-dimen"/>
            </p>
            <p style="margin-bottom: 20px;">
                <label class="input-descript">
                    <span>Phone Number</span>
                </label>
               <vue-tel-input class="form-control profile1-dimen" v-model.trim="phone" name="phone" value="" @onBlur="validate_phone" v-validate="'required|check_phone'" data-vv-validate-on="blur"
                                :preferredCountries="['ke', 'ug', 'tz']">
               </vue-tel-input>
               <span v-show="errors.has('phone')" class="sign-up-phone-error">{{ errors.first('phone') }}</span>
            </p>
            <p>
                <br/>

                <input type="submit" class="button-primary btn-content" id="save_personal" v-on:click="save_personal"
                       value="Save"/>
            </p>

        </div>
    </div>
</template>

<script>
    import SessionMxn from "../../../mixins/session_mixin.js";
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'PersonalInfo',
        mixins: [SessionMxn],
        data() {
            return {
                // user_id: '',
                user_name: '',
                user_email: '',
                phone: ''
            }
        },
        mounted() {
          this.set_data();
        },
        computed : {
          ...mapGetters({
            getSess : 'getSession',
          }),
        },
        watch: {
          getSess: {
            handler(val, oldVal){
              this.set_data();
            },
            deep: true,
          }
        },
        methods: {
          set_data: function() {
            let session = this.$store.getters.getSession;
            this.user_name = session[session.default]['user_name'];
            this.user_email = session[session.default]['user_email'];
            this.phone = session[session.default]['user_phone'];
          },
          validate_phone() {
            this.$validator.validate();
          },
            ...mapActions({
                requestPersonalInfo: '$_user/requestPersonalInfo',
            }),
            save_personal: function () {
              if (
                this.user_name != "" &&
                this.user_email != "" &&
                this.phone != ""
              ){
                let phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();
                let phone_valid = phoneUtil.isValidNumber(phoneUtil.parse(this.phone));

              if (phone_valid == true) {


                let phone = this.phone.replace(/[\(\)\-\s]+/g, '');

                  let session = this.$store.getters.getSession;
                  console.log('session', session[session.default]['user_id']);

                    if (session.default == 'biz') {
                        console.log("Cop user found");
                        let values = {
                            "cop_user_id": session[session.default]['user_id'],
                            "user_name": this.user_name,
                            "user_email": this.user_email,
                            "user_phone": phone
                        };

                        let full_payload = {
                            "values": values,
                            "vm": this,
                            "app": "NODE_PRIVATE_API",
                            "endpoint": "update_user"
                        }

                        this.requestPersonalInfo(full_payload).then(response => {
                            if (response.status == true) {
                                let updated_session = session;
                                updated_session[session.default]['user_name'] = this.user_name;
                                updated_session[session.default]['user_phone'] = phone;
                                updated_session[session.default]['user_email'] = this.user_email;

                                let new_session = JSON.stringify(updated_session);
                                console.log('New session',new_session);
                                this.setSession(new_session);

                                console.log('updated session',updated_session);
                                console.log("Personal Cop User Information Updated successfully")
                                console.log(response);
                                let level = 1; //success
                                this.message = "Details Saved!"
                                let notification = {"title": "", "level": level, "message": this.message}; //notification object
                                this.$store.commit('setNotification', notification);
                                this.$store.commit('setNotificationStatus', true); //activate notification
                            }
                            else {
                                console.warn('Cop user details Update Failed');
                                let level = 3;
                                this.message = "Something went wrong."
                                let notification = {"title": "", "level": level, "message": this.message}; //notification object
                                this.$store.commit('setNotification', notification);
                                this.$store.commit('setNotificationStatus', true); //activate notification

                            }
                        }, error => {
                            console.error("Check Internet Connection")
                            console.log(error);
                        });
                    }
                    else if (session.default == 'peer') {
                        console.log("Peer Account Found");
                        let values = {
                            "user_id": session[session.default]['user_id'],
                            "user_name": session[session.default]['user_name'],
                            "user_email": session[session.default]['user_email'],
                            "user_phone": session[session.default]['user_phone'],
                        };

                        let full_payload = {
                            "values": values,
                            "vm": this,
                            "app": "NODE_PRIVATE_API",
                            "endpoint": "update_user"
                        }

                        this.requestPersonalInfo(full_payload).then(response => {
                            if (response.status == true) {
                              let updated_session = session;
                              updated_session[session.default]['user_name'] = this.user_name;
                              updated_session[session.default]['user_phone'] = phone;
                              updated_session[session.default]['user_email'] = this.user_email;

                              let new_session = JSON.stringify(updated_session);
                              this.setSession(new_session);
                              this.$store.commit("setSession", updated_session);

                                console.log("Personal Peer Information Updated successfully")
                                console.log(response);
                                let level = 1; //success
                                this.message = "Details Saved!"
                                let notification = {"title": "", "level": level, "message": this.message}; //notification object
                                this.$store.commit('setNotification', notification);
                                this.$store.commit('setNotificationStatus', true); //activate notification
                            }
                            else {
                                console.warn('Peer details Update Failed');
                                let level = 3;
                                this.message = "Something went wrong."
                                let notification = {"title": "", "level": level, "message": this.message}; //notification object
                                this.$store.commit('setNotification', notification);
                                this.$store.commit('setNotificationStatus', true); //activate notification

                            }
                        }, error => {
                            console.error("Check Internet Connection")
                            console.log(error);
                            let level = 3;
                            this.message = "Something went wrong."
                            let notification = {"title": "", "level": level, "message": this.message}; //notification object
                            this.$store.commit('setNotification', notification);
                            this.$store.commit('setNotificationStatus', true); //activate notification
                        });
                    }
                    else {

                        console.log("Session expired");
                        this.$router.push('/auth');
                    }

                  }

                  else {

                    let level = 3;
                    this.message = "Invalid Phone Number"
                    let notification = {"title": "", "level": level, "message": this.message}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true);
                  }

              }
                else {

                  let level = 3;
                  this.message = "Provide all details"
                  let notification = {"title": "", "level": level, "message": this.message}; //notification object
                  this.$store.commit('setNotification', notification);
                  this.$store.commit('setNotificationStatus', true);

                }



            },
        },
    }
</script>

<style lang="css">
@import "../../../../node_modules/vue-tel-input/dist/vue-tel-input.css";

#auth_container > div > div:nth-child(2) > div > div > p:nth-child(3) > div > div > ul{
      z-index: 9;
      width: 357px;
      margin-top: 9px;
      margin-left: -15px;

   }

    .my-profile {
        padding-top: 45px;
        width: 90%;
        margin: 0px auto;
    }

    .my-profile__menu {
        font-size: 22px;
        padding-bottom: 0px;
        border-bottom: 1px solid #ccc;
        color: #999;
        padding-top: 15px;
        margin-bottom: 30px;
    }

    .my-profile__menu__balance {
        float: right;
        font-size: 14px;
        color: #1782C5;
    }

    .my-profile__inner__menu {
        margin-bottom: 50px;
        border-bottom: 1px solid #1782c5;
        padding-bottom: 2px;
    }

    .my-profile__inner__menu__link {
        color: #1782c5;
        text-transform: uppercase;
        text-align: center;
        padding: 2px 25px;
        font-size: 17px;
    }

    .my-profile__inner__menu__selected {
        font-weight: 400;
        border-bottom: 3px solid #1782c5;
        text-decoration: none;
    }

    .my-profile__main__header__2 {
        font-size: 16px;
        padding-bottom: 3px;
        border-bottom: 1px solid #ccc;
        text-transform: uppercase;
        color: #999;
    }

    .my-profile__input {
        background-color: transparent;
        border: 0px solid #ccc;
        border-bottom: 1px solid #ccc;
        padding: 10px;
        width: 300px;
        margin-top: 9px;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
        color: #575757;
    }

    .my-profile__phone_input {
        height: 50px;
        display: flex;
        margin: 0 0 10px;
    }

    .my-profile__btn {
        font-size: 14px;
        width: 320px;
        -webkit-appearance: button;
        cursor: pointer;
        padding: 10px 16px;
        line-height: 1.33;
        border-radius: 3px;
        color: #fff;
        background-color: #1782C5;
        border-color: #357ebd;
        display: inline-block;
        margin-bottom: 0;
        font-weight: normal;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        text-transform: uppercase;
    }

    .input-descript {
        margin: 0 0 .25rem;
        display: block;
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 400 !important;
        margin-bottom: .5rem !important;
    }

    .profile1-dimen {
        width: 90% !important;
    }

    .input-descript {
        margin: 0 0 .25rem;
        display: block;
        font-size: 1rem;
        line-height: 1.5rem;
        font-weight: 400 !important;
        margin-bottom: .5rem !important;
    }

    .btn-content {
        height: 40px;
        width: 35%;
        font-size: medium;
        letter-spacing: 1.1px;
        border-width:0px !important;
    }

    .panel-card {
        -webkit-box-flex: 2;
        flex: 2;
        padding-right: 40px;
        -webkit-box-orient: vertical;
        flex-direction: column;
        display: flex;
        -webkit-box-direction: normal;
    }

    .help-card {
        -webkit-box-flex: 1;
        flex: 1;
        -webkit-box-orient: vertical;
        flex-direction: column;
        display: flex;
        -webkit-box-direction: normal;
        padding-top: 30px;
        margin: -9% auto;
        max-width: 32rem;

    }

    .new-card2 {
        -webkit-box-flex: 1;
        flex: 1;
        -webkit-box-orient: vertical;
        flex-direction: column;
        display: flex;
        -webkit-box-direction: normal;
        padding-top: 3px ! important;

    }

</style>
