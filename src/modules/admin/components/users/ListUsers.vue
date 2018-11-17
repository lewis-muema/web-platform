<template lang="html">
    <div>
        <div class="section--filter-wrap">
            <!--<div class="section&#45;&#45;filter-input-wrap">-->
                <!--<input class="input-control section&#45;&#45;filter-input" type="text" name="name" value="" placeholder="Name">-->

                <!--<el-select class="section&#45;&#45;filter-input" v-model="value" placeholder="All Departments">-->
                    <!--<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">-->
                    <!--</el-option>-->
                <!--</el-select>-->
            <!--</div>-->
            <div class="section--filter-input-wrap">
                <el-select class="section--filter-input" v-model="filterData.user" placeholder="Users">
                    <el-option v-for="user in users_list" :key="user.cop_user_id" :label="user.name" :value="user.cop_user_id">
                    </el-option>
                </el-select>
                <el-select class="section--filter-input" v-model="value" placeholder="All Departments">
                    <el-option v-for="dept in depts" :key="dept.value" :label="dept.label" :value="dept.value">
                    </el-option>
                </el-select>
            </div>
            <div class="section--filter-action-wrap">
                <button class="button-primary section--filter-action" @click="addUser">Add User</button>
                <button type="button" class="button-primary section--filter-action">Search</button>

            </div>
        </div>
        {{filterData}}
        <el-table
                :data="user_data"
                style="width: 100%"
                :border="true"
                :stripe="true"
        >
            <template slot="empty">
                {{empty_orders_state}}
            </template>
            <el-table-column type="index">
            </el-table-column>
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
                    :total="fetchedData.length"
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

            let payload = {
                "cop_id": 1083
            }
            this.$store.dispatch("$_admin/requestUsersList", payload).then(response => {
                console.log("Got some data, now lets show something in this component")
                console.log(response);
                this.empty_payments_state = "Users List Not Found";
            }, error => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
                console.log(error);
                this.empty_payments_state = "Users List Failed to Fetch";
            });
        },
        data: function () {
            return {
                empty_payments_state: "Fetching Users",
                pagination_limit: 5,
                pagination_page: 1,
                filteredUserData:[],
                filterState:false

            }
        },
        computed: {
            ...mapGetters({
                userData: '$_admin/getUsersList',
            }),
            user_data(){
                if(this.filterState == true){
                    return this.filteredUserData;
                }
                return this.userData;
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
                let paginated_drivers = this.searched_drivers.slice(from, to);
                console.log(from, to, paginated_drivers);
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
            filterTableData() {
                //reset filter
                this.filterState  = false;

                let user = this.filterData.name;
                let department = this.filterData.department_name;
                this.filteredData = this.cop_users_data;


                console.log(this.filteredData);
                //check if both are filled
                if(user !== '' && department !== ''){
                    console.log('performing a user and departments filter');
                    console.log(user);
                    console.log(department);

                    let vm = this;
                    this.filteredData = this.filteredData.filter(function (order) {
                        return order.user_details.name ===  name  && order.user_details.department_name === department_name;
                    });
                    this.filterState = true;

                } else if(user !== ''){
                    //user filter
                    console.log('performing a user filter');
                    console.log(user);

                    this.filteredData = this.filteredData.filter( order => order.user_details.id ===  user);
                    this.filterState = true;


                } else {
                    //date filter
                    console.log('performing a department filter');
                    this.filterState = true;
                    return moment(order.order_date).isSameOrAfter(from_date) && moment(order.order_date).isSameOrBefore(to_date);

                }
            },
            ...mapActions([
                '$_admin/requestUsersList',
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
