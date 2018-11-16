<template lang="html">
    <div>
        <div class="section--filter-wrap">
            <div class="section--filter-input-wrap">
                <input class="input-control section--filter-input" type="text" name="name" value="" placeholder="Name">

                <el-select class="section--filter-input" v-model="value" placeholder="All Departments">
                    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="section--filter-action-wrap">
                <button class="button-primary section--filter-action" @click="addUser">Add User</button>
                <button type="button" class="button-primary section--filter-action">Search</button>

            </div>
        </div>
        <el-table
                :data="fetchedData"
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
                tableData: [
                    {
                        "name": "CASH-AC29TZ828-T4W",
                        "phone": "Computer Architecture",
                        "email": "Computers",
                        "department": "125.60",
                        "type": "24",
                        "status": "24",
                        "branch": "24"
                    },
                    {
                        "name": "CASH-AC29TZ828-T4W",
                        "phone": "Asp.Net 4 Blue Book",
                        "email": "Programming",
                        "department": "56.00",
                        "type": "24",
                        "status": "24",
                        "branch": "24"
                    },
                    {
                        "name": "CASH-AC29TZ828-T4W",
                        "phone": "Popular Science",
                        "email": "Science",
                        "department": "210.40",
                        "type": "27",
                        "status": "27",
                        "branch": "27"
                    }
                ]

            }
        },
        computed: {
            ...mapGetters({
                fetchedData: '$_admin/getUsersList',
            }),
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
                if (this.fetchedData.length > 0) {
                    resp = this.fetchedData[index].type;
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
                if (this.fetchedData.length > 0) {
                    resp = this.fetchedData[index].status;
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
