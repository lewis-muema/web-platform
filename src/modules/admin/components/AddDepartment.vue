<template lang="html">

    <div id="log_in" class="admin-edit-item">
        <div class="admin-edit-inner">
            <div class="">

                <i class="el-icon-caret-left edit-back" v-on:click="go_back"></i>

            </div>
            <div class="admin-edit2-details position--details">
                Add Department
            </div>
            <div class="edit-position">
                <div class="edit-holder edit-dimen">
                    <input class="input-control edit-form" type="text" v-model="department_name" placeholder="Name">
                </div>
                <div class="edit-holder">
                    <el-select class="addUser--select edit-select" v-model="filterData.user" placeholder="Admin">
                        <el-option v-for="user in userData" :key="user.cop_user_id" :label="user.name"
                                   :value="user.cop_user_id">
                        </el-option>
                    </el-select>
                </div>
                <div class="sign-holder">
                    <input class="button-primary" type="submit" value="Add" v-on:click="add_department">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'AddDepartment',
        mounted() {
        },
        data() {
            return {
                empty_departmens_state: 'Adding Department',
                filterData: {
                    "user": ""
                }
            }
        },
        computed: {
            ...mapGetters({
                userData: '$_admin/getUsersList'
            }),
        },
        methods: {
            ...mapActions({
                addNewDepartment: '$_admin/addNewDepartment'
            }),
            add_department: function () {
                let session = this.$store.getters.getSession;
                let cop_id = 0;
                if (session.default == 'biz') {
                    cop_id = session[session.default]['cop_id'];
                }
                let newDept_payload = {
                    "cop_id": cop_id,
                    "department_name": this.department_name,
                    "cop_user_id": this.filterData.user
                }

                console.log(newDept_payload)
                let full_payload = {
                    "values": newDept_payload,
                    "vm": this,
                    "app": "NODE_PRIVATE_API",
                    "endpoint": "cop_departments_add"
                }
                this.$store.dispatch("$_admin/addNewDepartment", full_payload).then(response => {
                    console.log("department added");
                    console.log(response);
                    let level = 1; //success
                    let notification = {"title": "Add Department", "level": level, "message": message}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true); //activate notification
                    // this.$router.push('/admin/department');
                }, error => {
                    console.log("department NOT added");
                    console.log(error);
                    let level = 2;
                    let notification = {"title": "Add Department", "level": level, "message": "An error occurred."}; //notification object
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
</style>
