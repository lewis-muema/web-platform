<template lang="html">
    <div v-if="available" id="log_in" class="admin-edit-item">

        <div class="admin-edit-inner">
            <div class="">

                <i class="el-icon-caret-left edit-back" v-on:click="go_back"></i>

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
                    <el-select class="addUser--select edit-select" v-model="deptDetails.cop_user_id" placeholder="Admin">
                        <el-option v-for="user in userData" :key="user.cop_user_id" :label="user.name"
                                   :value="user.cop_user_id">
                        </el-option>
                    </el-select>
                </div>
                <!-- <div class="edit-holder edit-dimen dept--id-storetemp">
                    <input class="input-control edit-dept" type="text" name="department_id"
                           v-model="deptDetails.department_id"
                           placeholder="Dept_id">
                </div> -->

                <div class="sign-holder">
                    <input class="button-primary" type="submit" value="Update" id="update_department"
                           v-on:click="update_department">
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

            if(this.deptDetails !== undefined){
                this.available = true;
            }
            else{
                this.available = false;
                this.go_back();
                console.log("back to users' table")
            }
        },
        computed: {
            ...mapGetters({
                deptData: '$_admin/getDepartmentsList',
                userData: '$_admin/getUsersList'

            }),
        },

        methods: {
            ...mapActions({
                editAdminDepartment: '$_admin/editAdminDepartment'
            }),
            update_department: function () {
                let payload = {}
                    payload.department_id = this.deptDetails.department_id;
                    payload.department_name = this.deptDetails.department_name;
                    payload.cop_user_id = this.deptDetails.cop_user_id;
                    payload.department_admin= this.deptDetails.department_admin;

                console.log('payload',payload);
                let editDept_full_payload = {
                    "values":payload,
                    "vm": this,
                    "app": "NODE_PRIVATE_API",
                    "endpoint": "cop_departments_update"
                }
                this.$store.commit('setNotificationStatus', true); //activate notification
                let level = 0; //this will show the white one
                this.$store.dispatch("$_admin/editAdminDepartment", editDept_full_payload).then(response => {
                    console.log(response);
                    console.log("updated");
                    let message = response.data.msg;
                    if(response.data.status == false){
                        level = 3; //warning //use 3 to show the red one
                        this.message = "Something went wrong."
                    } else {
                        level = 1; //success
                        this.message = "edit Successful!"
                    }
                    let notification = {"title":"Edit Department", "level":level, "message":this.message}; //notification object
                    this.$store.commit('setNotification', notification);
                    // this.$router.push('/admin/department');
                }, error => {
                    console.log(error);
                    level = 2;
                    this.message = "Something went wrong."
                    let notification = {"title":"Edit Department", "level":level, "message":this.message}; //notification object
                    this.$store.commit('setNotification', notification);
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
</style>
