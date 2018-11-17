<template lang="html">
    <div id="log_in" class="admin-edit-item" >

        <div class="admin-edit-inner">

            <div class="admin-edit-details">
                Edit Department Details
            </div>

            <div>
                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" name="email" v-model="department" placeholder="Department">
                </div>

                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" name="phone" v-model="approver" placeholder="Approver">
                </div>

                <div class="sign-holder">
                    <input class="button-primary" type="submit" value="Update Details" v-on:click="update_department" >
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    import {mapActions} from 'vuex'
    export default {
        name:'EditDepartment',
        data() {
            return {
                departments: [{
                    dept_value: '1',
                    label: 'Department1'
                }, {
                    dept_value: '2',
                    label: 'Department2'
                }, {
                    dept_value: '3',
                    label: 'Department3'
                }],
                statuses: [{
                    status_value: '1',
                    status_name: 'Active'
                }, {
                    status_value: '2',
                    status_name: 'Deactivate'
                }],
                types: [{
                    type_value: '1',
                    type_name: 'User'
                }, {
                    type_value: '2',
                    type_name: 'Admin'
                }],
                dept_value: '',
                status_value: '',
                type_value: ''
            }
        },

        methods:{
            ...mapActions({
                requestEditUserAdmin :'$_admin/requestEditUserAdmin',
            }),
            update_department: function ()
            {
                // "cop_id" : 285,
                // "department_name" : "department_nameggggg",
                // "cop_user_id":12
                let payload = {};
                payload.cop_user_id = '';
                payload.user_name = '';
                payload.user_email = '';
                payload.user_phone = '';
                payload.department_id = this.dept_value;
                payload.user_type = this.type_value;
                payload.email = '';
                payload.status = this.status_value;
                this.requestEditUserAdmin(payload).then(response => {
                    console.log("User Details Updated!")
                    console.log(response);
                }, error => {
                    console.error("Check Internet Connection")
                    console.log(error);
                });
            },
        },

    }
</script>

<style lang="css">
    .admin-edit-item{
        text-align: center;
        border: 0px solid #ccc;
        margin: 5px;
    }
    .admin-edit-inner{
        max-width: 60rem;
        border-radius: 4px;
        padding: 2rem;
        font-family: 'Rubik', sans-serif;
        display: flex;
    }
    .admin-edit-details{
        font-size: 1.3rem;
        line-height: 1.7em;
        font-weight: 400;
        text-align: center;
        color: #666;
        margin-right: 20%;
        margin-top: 4%;
    }
    .edit-holder{
        margin: 1em;
        display: block;
    }

    .edit-dimen{
        width: 83%;
    }

    .edit-form{
        height:42px!important;
        width: 160%!important;
    }
    .edit-select{
        height:42px!important;
        width: 155%!important;
    }
</style>
