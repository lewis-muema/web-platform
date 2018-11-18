<template lang="html">
    <div id="log_in" class="admin-edit-item">

        <div class="admin-edit-inner">
            <div class="">

                <i class="el-icon-caret-left edit-back" v-on:click="go_back" ></i>

            </div>
            <div class="dept-edit-details">
                Edit Department Details
            </div>
            <div class="edit-position-dept">
                <div class="edit-holder edit-dimen">
                    <input readonly class="input-control edit-dept" type="text" name="department" v-model="deptDetails.department_name"
                           placeholder="Name">
                </div>

                <el-select class="section--filter-input edit-holder add-dept" v-model="filterData.user" placeholder="Admin">
                    <el-option v-for="user in userData" :key="user.cop_user_id" :label="user.name" :value="user.cop_user_id">
                    </el-option>
                </el-select>

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
            let usersList_payload = {
                "cop_id": 1083
            }
            let users_full_payload = {
                "values" : usersList_payload,
                "vm":this,
                "app":"NODE_PRIVATE_API",
                "endpoint":"cop_users"
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
                approver: '',
                dept_value: '',
                status_value: '',
                type_value: '',
                deptDetails: {},
                filterData:{
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
                requestUsersList :'$_admin/requestUsersList',
            }),
            update_department: function () {
                let editDept_payload = {
                    "cop_id": this.deptDetails.department_id ,
                    "department_name": this.deptDetails.department_name ,
                    "cop_user_id": this.deptDetails.cop_user_id
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
                }, error => {
                    console.log(error);
                });
            },
            go_back:function () {
                this.$router.push('/admin/department');
            }
        },

    }
</script>

<style lang="css">
    .admin-edit-item {
        text-align: center;
        border: 0px solid #ccc;
        margin: 5px;
    }

    .admin-edit-inner {
        max-width: 60rem;
        border-radius: 4px;
        padding: 2rem;
        font-family: 'Rubik', sans-serif;
        display: flex;
    }

    .dept-edit-details {
        font-size: 1.3rem;
        line-height: 1.7em;
        font-weight: 400;
        text-align: center;
        color: #666;
        /* margin-right: 20%; */
        margin-top: 8%!important;
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

    .edit-dept{
        height:42px!important;
        width: 300%!important;
    }
    .edit-position-dept{
        border-left: 2px solid rgb(23, 130, 197);
        padding-left: 80px;
    }
    .edit-select {
        height: 42px !important;
        width: 155% !important;
    }
</style>
