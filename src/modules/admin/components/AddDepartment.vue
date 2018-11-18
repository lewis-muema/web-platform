<template lang="html">

    <div id="log_in" class="admin-edit-item" >
        <div class="side-flex error">
            <span id="show_error"></span>
        </div>
        <div class="admin-edit-inner">
            <div class="">

                <i class="el-icon-caret-left edit-back" v-on:click="go_back" ></i>

            </div>
            <div class="dept-edit-details">
                Add Department
            </div>

            <div class="edit-position-dept">
                <div class="edit-holder edit-dimen">
                    <input class="input-control add-dept" type="text" v-model="department_name" placeholder="Name">
                </div>

                <el-select class="section--filter-input edit-holder add-dept" v-model="filterData.user" placeholder="Admin">
                    <el-option v-for="user in userData" :key="user.cop_user_id" :label="user.name" :value="user.cop_user_id">
                    </el-option>
                </el-select>

                <!--<div class="edit-holder edit-dimen">-->
                    <!--<input class="input-control add-dept" type="text" v-model="department_admin" placeholder="Admin" >-->
                <!--</div>-->

                <div class="sign-holder">
                    <input class="button-primary" type="submit" value="Add" v-on:click="add_department" >
                </div>
            </div>
        </div>
    </div>


</template>

<script>
    import {mapActions, mapGetters,mapMutations} from 'vuex'
    export default {
        name:'AddDepartment',
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
                empty_departmens_state: 'Adding Department',
                filterData:{
                    "user": ""
                }
            }
        },
        computed: {
            ...mapGetters({
                userData: '$_admin/getUsersList'
            }),
        },
        methods:{
            ...mapActions({
                addNewDepartment :'$_admin/addNewDepartment',
                requestUsersList :'$_admin/requestUsersList',
            }),
            add_department: function ()
            {
                let newDept_payload = {
                    "cop_id": this.cop_id,
                    "department_name": this.department_name,
                    "cop_user_id": this.cop_user_id
                }
                console.log(newDept_payload)
                let full_payload = {
                    "values" : newDept_payload,
                    "vm":this,
                    "app":"NODE_PRIVATE_API",
                    "endpoint":"cop_departments_update"
                }
                this.$store.dispatch("$_admin/addNewDepartment", full_payload).then(response => {
                    console.log("added");
                    console.log(response);
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
    .dept-edit-details{
        font-size: 1.3rem;
        line-height: 1.7em;
        font-weight: 400;
        text-align: center;
        color: #666;
        /* margin-right: 20%; */
        margin-top: 8%!important;
        margin-left: 100px;
        margin-right: 60px;
        margin-top: 8%!important;
    }
    .edit-holder{
        margin: 1em;
        display: block;
    }

    .edit-dimen{
        width: 100% !important;
    }

    .add-dept{
        height:42px!important;
        width: 300%!important;
    }
    .edit-select{
        height:42px!important;
        width: 155%!important;
    }
    .error {
        justify-content: center;
    }
    add-back-arrow{
        position: relative !important;
        margin-left: -115px !important;
    }
    .edit-position-dept{
        border-left: 2px solid rgb(23, 130, 197);
        padding-left: 80px;
    }
</style>
