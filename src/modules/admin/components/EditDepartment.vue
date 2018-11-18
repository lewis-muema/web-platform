<template lang="html">
    <div id="log_in" class="admin-edit-item">

        <div class="admin-edit-inner">
            <div class="">

                <i class="el-icon-caret-left edit-back" v-on:click="go_back"></i>

            </div>
            <!--{{deptDetails}}-->
            <div class="admin-edit2-details position--details">
                Edit Department Details
            </div>
            <div class="edit-position">
                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" name="department"
                           v-model="deptDetails.department_name"
                           placeholder="Name">
                </div>
                <div class="edit-holder">
                    <el-select class="addUser--select edit-select" v-model="filterData.user" placeholder="Admin">
                        <el-option v-for="user in userData" :key="user.cop_user_id" :label="user.name"
                                   :value="user.cop_user_id">
                        </el-option>
                    </el-select>
                </div>
                <div class="edit-holder edit-dimen dept--id-storetemp">
                    <input class="input-control edit-dept" type="text" name="department_id"
                           v-model="deptDetails.department_id"
                           placeholder="Dept_id">
                </div>

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
            let session = this.$store.getters.getSession;
            let cop_id = 0;
            if (session.default == 'biz') {
                cop_id = session[session.default]['cop_id'];
            }

            console.log("getting session")
            let usersList_payload = {
                "cop_id": cop_id,
            }
            let users_full_payload = {
                "values": usersList_payload,
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
        data() {
            return {
                department: '',
                admin: '',
                dept_value: '',
                status_value: '',
                type_value: '',
                deptDetails: {},
                filterData: {
                    "user": ""
                }
            }
        },
        mounted() {
            let cop_user_id = this.$route.params.id;
            this.deptDetails = this.deptData.filter(dept => dept.cop_user_id == cop_user_id)[0];

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
                requestUsersList: '$_admin/requestUsersList',
            }),
            update_department: function () {
                let editDept_payload = {
                    "department_id": this.deptDetails.department_id,
                    "department_name": this.deptDetails.department_name,
                    "cop_user_id": this.filterData.user
                }
                console.log(editDept_payload)
                let editDept_full_payload = {
                    "values": editDept_payload,
                    "vm": this,
                    "app": "NODE_PRIVATE_API",
                    "endpoint": "cop_departments_update"
                }
                this.$store.dispatch("$_admin/editAdminDepartment", editDept_full_payload).then(response => {
                    console.log(response);
                    console.log("updated");
                    // this.$router.push('/admin/department');
                }, error => {
                    console.log(error);
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
