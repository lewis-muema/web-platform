<template lang="html">
    <div v-if="available" id="log_in" class="admin-edit-item">

        <div class="admin-edit-inner">
            <div class="">

                <i class="el-icon-back edit-back" v-on:click="go_back"></i>

            </div>
            <div class="admin-edit2-details position--details">
                Edit Department Details
            </div>
            <div class="edit-position">
                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" name="department_name"
                           v-model="deptDetails.department_name"
                           placeholder="Name">
                </div>
                <div class="edit-holder">
                    <el-select class="addUser--select edit-select" v-model="deptDetails.cop_user_id"
                               placeholder="Admin">
                        <el-option v-for="user in userData" :key="user.cop_user_id" :label="user.name"
                                   :value="user.cop_user_id">
                        </el-option>
                    </el-select>
                </div>
                <div class="sign-holder">
                    <button class="button-primary btn-edit-dept" type="submit" id="update_department"
                            v-on:click="update_department">Update
                    </button>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: 'EditDepartment',
        mounted() {

        },
        data() {
            return {
                message: "",
                available: false,
                deptDetails: {},
                userDetails: {}
            }
        },
        mounted() {
            let cop_user_id = this.$route.params.id;
            this.deptDetails = this.deptData.filter(dept => dept.cop_user_id == cop_user_id)[0];

            if (this.deptDetails !== undefined) {
                this.available = true;
            }
            else {
                this.available = false;
                this.go_back();
                console.log("back to users' table")
            }
            let session = this.$store.getters.getSession;
            let cop_id = 0;
            if (session.default == 'biz') {
                cop_id = session[session.default]['cop_id'];
            }
            let payload = {
                "cop_id": cop_id

            }
            let users_full_payload = {
                "values": payload,
                "vm": this,
                "app": "NODE_PRIVATE_API",
                "endpoint": "cop_users"
            }
            this.$store.dispatch("$_admin/requestUsersList", users_full_payload).then(response => {
                console.log(response);
            }, error => {
                console.log(error);
            });
        },
        computed: {
            ...mapGetters({
                deptData: '$_admin/getDepartmentsList',
                userData: '$_admin/getUsersList'

            }),
        },

        methods: {
            ...mapActions({
                editAdminDepartment: '$_admin/editAdminDepartment',
                requestUsersList: '$_admin/requestUsersList'
            }),
            update_department: function () {
                let payload = {}
                payload.department_id = this.deptDetails.department_id;
                payload.department_name = this.deptDetails.department_name;
                payload.cop_user_id = this.deptDetails.cop_user_id;
                console.log('payload', payload);
                let editDept_full_payload = {
                    "values": payload,
                    "vm": this,
                    "app": "NODE_PRIVATE_API",
                    "endpoint": "cop_departments_update"
                }
                this.$store.dispatch("$_admin/editAdminDepartment", editDept_full_payload).then(response => {
                    console.log(response);
                    console.log("updated");
                    let level = 1; //success
                    this.message = "Edit Successful!"
                    let notification = {"title": "", "level": level, "message": this.message}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true); //activate notification

                }, error => {
                    console.log(error);
                    let level = 2;
                    this.message = "Something went wrong."
                    let notification = {"title": "", "level": level, "message": this.message}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true); //activate notification

                });
            },
            go_back: function () {
                this.$router.push('/admin/department');
            }
        },

    }
</script>

<style lang="css">
    .position--details {
        margin-top: 8% !important;
    }

    .dept--id-storetemp {
        display: none !important;
    }
    .btn-edit-dept{
       border-width: 0px !important;
    }
</style>
