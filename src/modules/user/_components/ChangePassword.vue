<template lang="html">
    <div class="new-card2">
        <div class="help-card" style="width:400px;margin-left:30%;margin-top:30px;">
            <p style="margin-bottom: 20px;">
                <label class="input-descript">
                    <span>Old Password</span>
                </label>
                <input name="old_password" type="password" v-model="old_password" class="form-control profile-dimen"/>
            </p>
            <p style="margin-bottom: 20px;">
                <label class="input-descript">
                    <span>New Password</span>
                </label>
                <input type="password" name="new_password" v-model="new_password" class="form-control profile-dimen"/>
            </p>
            <p style="margin-bottom: 20px;">
                <label class="input-descript">
                    <span>Confirm Password</span>
                </label>
                <input type="password" name="confirm_password" v-model="confirm_password"
                       class="form-control profile-dimen"/>
            </p>
            <!--<p class="change-password-error">-->
                <!--{{message}}-->
            <!--</p>-->
            <!--<p class="change-password-success">-->
                <!--{{message}}-->
            <!--</p>-->
            <p>
                <br/>
                <input type="submit" class="button-primary btn-content" v-on:click="update_password" value="Update"/>
            </p>

        </div>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: 'ChangePassword',
        data() {
            return {
                // user_id: '',
                old_password: '',
                new_password: '',
                confirm_password: '',
                message: ''
            }
        },
        methods: {
            ...mapActions({
                requestChangePassword: '$_user/requestChangePassword',
            }),
            update_password: function () {
                if (this.new_password !== this.confirm_password) {
                    console.log("Passwords Don't Match");
                    this.message = "Passwords don't match";
                }
                else {
                    console.log("Password match");
                    let session = this.$store.getters.getSession;

                    if (session['biz']['cop_id'] > 0) {
                        console.log("Cop user found");

                        let values = {
                            "cop_user_id": session[session.default]['user_id'],
                            "old_password": this.old_password,
                            "new_password": this.new_password,
                            "password": this.confirm_password,
                        };


                        let full_payload = {
                            "values": values,
                            "vm": this,
                            "app": "NODE_PRIVATE_API",
                            "endpoint": "update_user"
                        }

                        this.requestChangePassword(full_payload).then(response => {
                            if (response.status == true) {

                                console.log("Cop User Password Updated successfully")
                                console.log(response);
                                let level = 1; //success
                                this.message = "Password Changed!"
                                let notification = {"title": "", "level": level, "message": this.message}; //notification object
                                this.$store.commit('setNotification', notification);
                                this.$store.commit('setNotificationStatus', true); //activate notification
                            }
                            else {
                                console.warn('Cop user password Update Failed');
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
                    else if (session['peer']['user_id'] > 0) {
                        console.log("Peer user found");

                        let values = {
                            "user_id": session[session.default]['user_id'],
                            "old_password": this.old_password,
                            "password": this.new_password,
                            "password": this.confirm_password,
                        };

                        let full_payload = {
                            "values": values,
                            "vm": this,
                            "app": "NODE_PRIVATE_API",
                            "endpoint": "update_user"
                        }

                        this.requestChangePassword(full_payload).then(response => {
                            if (response.status == true) {

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

            },
        },
    }
</script>

<style lang="css">
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

    .profile-dimen {
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
        text-transform: uppercase;
        letter-spacing: 1.1px;
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

    .change-password-error {
        height: 0px;
    }
</style>
