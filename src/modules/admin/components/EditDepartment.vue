<template lang="html">
    <div id="log_in" class="admin-edit-item">

        <div class="admin-edit-inner">
            <div class="admin-edit-details">
                Edit Department Details
            </div>
            <div>
                <div class="edit-holder edit-dimen">
                    <input readonly class="input-control edit-dept" type="text" name="department" v-model="deptDetails.department_name"
                           placeholder="Department">
                </div>

                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-dept" type="text" name="admin" v-model="deptDetails.department_admin"
                           placeholder="Admin">
                </div>

                <div class="sign-holder">
                    <input class="button-primary" type="submit" value="Update Details" id="update_department"
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
        data() {
            return {
                department: '',
                approver: '',
                dept_value: '',
                status_value: '',
                type_value: '',
                deptDetails: {},
            }
        },
        mounted() {
            let cop_user_id = this.$route.params.id;

            this.deptDetails = this.deptData.filter(dept => dept.cop_user_id == cop_user_id)[0];

        },
        computed: {
            ...mapGetters({
                deptData: '$_admin/getDepartmentsList',
            }),
        },

        methods: {
            ...mapActions({
                editAdminDepartment: '$_admin/editAdminDepartment',
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
                    "endpoint": "cop_departments_update/"
                }
                this.$store.dispatch("$_admin/editAdminDepartment", editDept_full_payload).then(response => {
                    console.log(response);
                    console.log("updated");
                }, error => {
                    console.log(error);
                });
            },
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

    .admin-edit-details {
        font-size: 1.3rem;
        line-height: 1.7em;
        font-weight: 400;
        text-align: center;
        color: #666;
        margin-right: 20%;
        margin-top: 4%;
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

    .edit-select {
        height: 42px !important;
        width: 155% !important;
    }
</style>
