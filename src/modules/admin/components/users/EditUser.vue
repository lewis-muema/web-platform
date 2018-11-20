<template lang="html">
    <div id="log_in" class="admin-edit-item">

        <div class="admin-edit-inner">

            <div class="">

                <i class="el-icon-caret-left edit-back" v-on:click="one_step_back"></i>

            </div>

            <div class="admin-edit2-details">
                Edit User
            </div>
            <div class="edit-position">

                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" style="margin-top: 14%;" name="name"
                           v-model="userDetails.name" placeholder="Name" autocomplete="off">
                </div>

                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" name="email" v-model="userDetails.email"
                           placeholder="Email">
                </div>

                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" name="phone" v-model="userDetails.phone"
                           placeholder="Phone">
                </div>

                <div class="edit-holder">
                    <el-select class="addUser--select edit-select" v-model="userDetails.department_id"
                               placeholder="Department">
                        <el-option v-for="depart in departments" :key="depart.department_id"
                                   :label="depart.department_name" :value="depart.department_id">
                        </el-option>
                    </el-select>
                </div>

                <div class="edit-holder">
                    <el-select class="addUser--select edit-select" v-model="userDetails.status" placeholder="Status">
                        <el-option v-for="status in statuses" :key="status.status" :label="status.status_label"
                                   :value="status.status">
                        </el-option>
                    </el-select>
                </div>

                <div class="edit-holder">
                    <el-select class="addUser--select edit-select" v-model="userDetails.type" placeholder="User Type">
                        <el-option v-for="type in types" :key="type.type_value" :label="type.type_name"
                                   :value="type.type_value">
                        </el-option>
                    </el-select>
                </div>

                <div class="sign-holder">
                    <input class="button-primary" type="submit" value="Update" id="UpdateEdit" v-on:click="update_edit">
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: 'EditUser',
        data() {
            return {
                userDetails: {},
                message: ""
            }
        },
        mounted() {
            let cop_user_id = this.$route.params.id;
            this.userDetails = this.userData.filter(user => user.cop_user_id == cop_user_id)[0];

        },
        computed: {
            ...mapGetters({
                userData: '$_admin/getUsersList',
                departments: '$_admin/getDepartmentsList'
            }),
        },

        methods: {
            ...mapActions({
                editAdminUser: '$_admin/editAdminUser',
            }),
            update_edit: function () {
                let payload = {};
                payload.cop_user_id = this.userDetails.cop_user_id;
                payload.user_name = this.userDetails.name;
                // payload.user_email = this.userDetails.email;
                payload.user_phone = this.userDetails.phone;
                payload.department_id = this.userDetails.department_id;
                payload.user_type = this.userDetails.type;
                payload.user_email = this.userDetails.email;
                payload.status = this.userDetails.status;
                // this.editAdminUser(payload).then(response => {
                //     console.log("User Details Updated!")
                //     console.log(response);
                // }, error => {
                //     console.error("Check Internet Connection")
                //     console.log(error);
                // });
                let editUser_full_payload = {
                    "values": payload,
                    "vm": this,
                    "app": "NODE_PRIVATE_API",
                    "endpoint": "update_user"
                }
                this.$store.commit('setNotificationStatus', true); //activate notification
                let level = 0; //this will show the white one
                this.$store.dispatch("$_admin/editAdminUser", editUser_full_payload).then(response => {
                    console.log(response);
                    console.log("updated");
                    let message = response.data.msg;
                    if (response.data.status == false) {
                        level = 3; //warning //use 3 to show the red one
                        this.message = "An error occurred while saving."
                    } else {
                        level = 1; //success
                        this.message = "Edit Successful!"

                    }
                    let notification = {"title": "Edit User", "level": level, "message": this.message}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$router.push('/admin/users');
                }, error => {
                    console.log(error);
                    level = 3;
                    this.message = "Something went wrong.";
                    let notification = {"title": "Edit User Error!", "level": level, "message": this.message}; //notification object
                    this.$store.commit('setNotification', notification);
                });
            },
            one_step_back: function () {
                this.$router.push('/admin/users/');
            }
        },

    }
</script>

<style lang="css">
    .admin-edit-item {
        text-align: center;
        border: 0 solid #ccc;
        margin: 5px;
    }

    .admin-edit-inner {
        max-width: 60rem;
        border-radius: 4px;
        padding: 2rem;
        font-family: 'Rubik', sans-serif;
        display: flex;
    }

    .admin-edit2-details {
        font-size: 1.3rem;
        line-height: 1.7em;
        font-weight: 400;
        text-align: center;
        color: #666;
        /* margin-right: 20%; */
        margin-top: 18% !important;
        margin-left: 100px;
        margin-right: 60px;
    }

    .edit-holder {
        margin: 1em;
        display: block;
    }

    .edit-dimen {
        width: 83%;
    }

    .edit-form {
        height: 42px !important;
        width: 160% !important;
    }

    .edit-select {
        height: 42px !important;
        width: 155% !important;
    }

    .edit-back {
        width: 40px;
        border-radius: 20px;
        transition: .3s;
        box-shadow: 0 0 6px rgba(0, 0, 0, .12);
        line-height: 40px !important;
        cursor: pointer;
    }

    .edit-position {
        border-left: 2px solid rgb(23, 130, 197);
        padding-left: 80px;
    }
</style>
