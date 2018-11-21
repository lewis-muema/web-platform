<template lang="html">
    <div>
        <div class="section--filter-wrap">
            <div class="section--filter-input-wrap">
                <el-input class="section--filter-input" v-model="filterData.user" placeholder="Search users"></el-input>

                <el-select class="section--filter-input"  v-model="filterData.department" placeholder="All Departments">
                    <el-option v-for="dept in deptData" :key="dept.department_id" :label="dept.department_name" :value="dept.department_id">
                    </el-option>
                </el-select>

                <button type="button" :class="active_filter ? 'button-primary section--filter-action align-left':'button-primary section--filter-action-inactive align-left'" @click="filterUserTableData">Search</button>

            </div>
            <div class="section--filter-action-wrap">
                <button class="button-primary section--filter-action" @click="addUser">Add User</button>
            </div>
        </div>

        <el-table
                :data="user_data"
                style="width: 100%"
                :border="true"
                :stripe="true"
        >
            <template slot="empty">
                {{empty_orders_state}}
            </template>
            <el-table-column
                    label="Name"
                    prop="name"
            >
            </el-table-column>
            <el-table-column
                    label="Phone"
                    prop="phone">
            </el-table-column>
            <el-table-column
                    label="Email"
                    prop="email"
                    width="250">
            </el-table-column>
            <el-table-column
                    label="Department"
                    prop="department_name">
            </el-table-column>
            <el-table-column
                    label="Type">
                <template slot-scope="scope">
                <span>{{ get_user_type(scope.$index) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="Status">
                <template slot-scope="scope">
                    <span>{{ get_user_status(scope.$index) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="Action">
                <template slot-scope="scope">
                    <a @click="edit_user(user_data[scope.$index]['cop_user_id'])">Edit User</a>
                </template>
            </el-table-column>
        </el-table>
        <div class="section--pagination-wrap">
            <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="userData.length"
                    :page-size="pagination_limit"
                    :current-page.sync="pagination_page"
                    @current-change="changePage"
                    :page-sizes="[10, 20, 50, 100]"
                    @size-change="changeSize"
                    class="section--pagination-item"
            >
            </el-pagination>
        </div>

    </div>

</template>

<script>
    import {mapActions, mapGetters,mapMutations} from 'vuex'

    export default {
        name: "ListUsers",
        mounted() {
            let session = this.$store.getters.getSession;
            let cop_id = 0;
            if(session.default == 'biz'){
                cop_id = session[session.default]['cop_id'];
            }
            let payload = {
                "cop_id": cop_id

            }
            let users_full_payload = {
                "values" : payload,
                "vm":this,
                "app":"NODE_PRIVATE_API",
                "endpoint":"cop_users"
            }
            this.$store.dispatch("$_admin/requestUsersList", users_full_payload).then(response => {
                console.log(response);
            }, error => {
                console.log(error);
            });


            let depts_full_payload = {
                "values" : payload,
                "vm":this,
                "app":"NODE_PRIVATE_API",
                "endpoint":"cop_departments"
            }
            this.$store.dispatch("$_admin/requestDepartmentsList", depts_full_payload).then(response => {
                console.log(response);
            }, error => {
                console.log(error);
            });

        },
        data: function () {
            return {
                empty_payments_state: "Fetching Users",
                empty_departments_state: "Fetching Departments",
                pagination_limit: 10,
                pagination_page: 1,
                filteredUserData:[],
                filterState:false,
                search_users: '',
                filterData:{
                    "user": "",
                    "department":""
                }

            }
        },
        computed: {
            ...mapGetters({
                userData: '$_admin/getUsersList',
                deptData: '$_admin/getDepartmentsList'
            }),
            ...mapActions({
                requestUsersList: '$_admin/requestUsersList'
            }),
            user_data(){
                let from = (this.pagination_page - 1) * this.pagination_limit;
                let to = this.pagination_page * this.pagination_limit;

                if(this.filterState == true){
                    return this.filteredUserData.slice(from, to);
                }
                return this.userData.slice(from, to);
            },
            active_filter() {
                return this.filterData.user !== "" || this.filterData.department !== "";
            }
        },

        methods: {

            addUser() {
                this.$router.push({name: 'adminAddUser'});
            },
            changeSize(val) {
                this.pagination_page = 1;
                this.pagination_limit = val;
            },
            changePage() {
                console.log('Page changed to', this.pagination_page);
                let from = (this.pagination_page - 1) * this.pagination_limit;
                let to = this.pagination_page * this.pagination_limit;
                let user_data = this.userData.slice(from, to);
                console.log(from, to, user_data);

            },
            get_user_type: function (index) {
                let resp = '';
                if (this.user_data.length > 0) {
                    resp = this.user_data[index].type;
                    if (resp === 1) {
                        resp = "Admin"
                    }
                    else {
                        resp = "Normal"
                    }
                }
                return resp;
            },
            get_user_status: function (index) {
                let resp = '';
                if (this.user_data.length > 0) {
                    resp = this.user_data[index].status;
                    if (resp === 1) {
                        resp = "Active"
                    }
                    else if (resp === 2) {
                        resp = "Deactivated"
                    }
                    else if (resp === 0) {
                        resp = "Deleted"
                    }
                }
                return resp;
            },
            filterUserTableData() {
                //reset filter
                this.filterState  = false;
                let user_id = this.filterData.user;
                let department = this.filterData.department;

                console.log(user_id);
                console.log(department);

                this.filteredUserData = this.userData;


                console.log(this.filteredUserData);
                //check if both are filled
                if(user_id !== '' && department !== ''){
                    console.log('performing a user and departments filter');
                    let vm = this;
                    this.filteredUserData = this.filteredUserData.filter(function (user) {
                        return user.name.toLowerCase().indexOf(vm.filterData.user.toLowerCase()) >= 0  && user.department_id == department;
                    });
                    this.filterState = true;

                } else if(user_id !== ''){
                    //user filter
                    console.log('performing a user filter');
                    console.log(user_id);

                    let vm = this;
                    this.filteredUserData = this.filteredUserData.filter(function (user) {
                        return user.name.toLowerCase().indexOf(vm.filterData.user.toLowerCase()) >= 0;
                    });
                    this.filterState = true;


                } else {
                    //department filter
                    console.log('performing a department filter');

                    this.filteredUserData = this.filteredUserData.filter( user => user.department_id ==  department);
                    this.filterState = true;

                }
            },
            ...mapActions([
                '$_admin/requestUsersList',
                '$_admin/requestDepartmentsList',

            ]),
            ...mapMutations(
              {
                updateCopUserId:'$_admin/updateCopUserId',
                updateUserName:'$_admin/updateUserName',
                updateUserEmail:'$_admin/updateUserEmail',
                updateUserPhone: '$_admin/updateUserPhone',
                updateType: '$_admin/updateType'
              }
            ),
             edit_user(cop_user_id) {
                let cop_user_details = cop_user_id;
                this.$router.push('/admin/users/edit_user/'+cop_user_id);
            },

        }
    }
</script>

<style lang="css" scoped>
    @import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
    /* @import "../../../../assets/styles/datatable.css"; */
</style>
