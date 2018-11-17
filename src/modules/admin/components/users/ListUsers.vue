<template lang="html">
    <div>
        <div class="section--filter-wrap">
            <div class="section--filter-input-wrap">
                <el-select class="section--filter-input" v-model="filterData.user" placeholder="Users">
                    <el-option v-for="user in userData" :key="user.cop_user_id" :label="user.name" :value="user.cop_user_id">
                    </el-option>
                </el-select>
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
        <!-- {{deptData}}
        {{user_data}} -->
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
                    width="200"
            >
            </el-table-column>
            <el-table-column
                    label="Phone"
                    prop="phone"
                    width="200">
            </el-table-column>

            <el-table-column
                    label="Email"
                    prop="email"
                    width="220"
            >
            </el-table-column>
            <el-table-column
                    label="Department"
                    prop="department_name"
                    width="180"
            >
            </el-table-column>
            <el-table-column
                    label="Type"
                    width="120"
            >
                <template slot-scope="scope">
                    <span>{{ get_user_type(scope.$index) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="Status"
                    width="120"
            >
                <template slot-scope="scope">
                    <span>{{ get_user_status(scope.$index) }}</span>
                </template>
            </el-table-column>
            <!--<el-table-column-->
            <!--label="Branch"-->
            <!--prop="branch">-->
            <!--</el-table-column>-->
            <el-table-column
                    label="Action">
                <template slot-scope="scope">
                    <a>Edit User</a>
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
    import {mapActions, mapGetters} from 'vuex'

    export default {
        name: "ListUsers",
        mounted() {
            //TODO: Get this from session
            //TODO: also create payload depending on session

            let user_payload = {
                "cop_id": 669
            }
            this.$store.dispatch("$_admin/requestUsersList", user_payload).then(response => {
                console.log(response);
                this.empty_payments_state = "Users List Not Found";
            }, error => {
                console.log(error);
                this.empty_payments_state = "Users List Failed to Fetch";
            });

            let department_payload = {
                "cop_id": 669
            }
            this.$store.dispatch("$_admin/requestDepartmentsList", department_payload).then(response => {
                console.log(response);
                this.empty_departments_state = "Departments List Not Found";
            }, error => {
                console.log(error);
                this.empty_departments_state = "Departments List Failed to Fetch";
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
                        return user.cop_user_id ==  user_id  && user.department_id == department;
                    });
                    this.filterState = true;

                } else if(user_id !== ''){
                    //user filter
                    console.log('performing a user filter');
                    console.log(user_id);

                    this.filteredUserData = this.filteredUserData.filter( user => user.cop_user_id ==  user_id);
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

        }
    }
</script>

<style lang="css" scoped>
    @import 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons';
    /* @import "../../../../assets/styles/datatable.css"; */

    .button {
        float: right;
    }

    .button__element {
        text-transform: uppercase;
        display: inline-block;
        padding: 10px 30px;
        margin-bottom: 0;
        font-size: 14px;
        font-weight: normal;
        line-height: 1.42857143;
        text-align: center;
        white-space: nowrap;
        vertical-align: middle;
        cursor: pointer;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        background-image: none;
        border: 1px solid transparent;
        border-radius: 3px;
        color: #fff;
        background-color: #1782C5;
        border-color: #357ebd;
        text-decoration: none;
    }

    .menu {
        display: flow-root;
    }

</style>
