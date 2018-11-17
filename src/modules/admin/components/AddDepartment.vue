<template lang="html">

    <div id="log_in" class="admin-edit-item" >
        <div class="side-flex error">
            <span id="show_error"></span>
        </div>
        <div class="admin-edit-inner">
            <div class="admin-edit-details">
                Add Department Department
            </div>

            <div>
                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" v-model="cop_id" placeholder="cop_id">
                </div>

                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" v-model="department_name" placeholder="department_name">
                </div>

                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" v-model="cop_user_id" placeholder="cop_user_id">
                </div>

                <div class="sign-holder">
                    <input class="button-primary" type="submit" value="Add Department" v-on:click="add_department" >
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

        },
        data() {
            return {
                empty_departmens_state: 'Adding Department',
                cop_id: 285,
                department_name: "department_name",
                cop_user_id: 12
            }
        },
        methods:{
            ...mapActions({
                addNewDepartment :'$_admin/addNewDepartment',
            }),
            add_department: function ()
            {
                let newDept_payload = {
                    "cop_id": this.cop_id,
                    "department_name": this.department_name,
                    "cop_user_id": this.cop_user_id
                }

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
    .error {
        justify-content: center;
    }
</style>
