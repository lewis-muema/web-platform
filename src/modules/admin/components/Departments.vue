<template lang="html">
    <div class="departments_container" id="departments_container">
        <div class="section--filter-wrap">
            <div class="section--filter-input-wrap">

                <el-input class="section--filter-input" v-model="filterData.department" placeholder="Search Department"></el-input>

                <button type="button"
                        :class="active_filter ? 'button-primary section--filter-action align-left':'button-primary section--filter-action-inactive align-left'"
                        @click="filterUserTableData">Search
                </button>

            </div>
            <div class="section--filter-action-wrap">
                <button class="button-primary section--filter-action" @click="addDepartment">Add Department</button>
            </div>
        </div>
        <el-table
                :data="departments_data"
                style="width: 100%"
                :border="true"
                :stripe="true"
        >
            <template slot="empty">
                {{empty_departments_state}}
            </template>
            <el-table-column
                    label="Name"
                    prop="department_name"
            >
            </el-table-column>
            <el-table-column
                    label="Admin"
                    prop="department_admin">
            </el-table-column>
            <el-table-column
                    label="Action"
            >
                <template slot-scope="scope">
                    <a @click="edit_department(departments_data[scope.$index]['cop_user_id'])">Edit</a>
                </template>
            </el-table-column>

        </el-table>

        <div class="section--pagination-wrap">
            <el-pagination
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="deptData.length"
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
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: "Departments",
        mounted() {

            let session = this.$store.getters.getSession;
            let cop_id = 0;
            if (session.default == 'biz') {
                cop_id = session[session.default]['cop_id'];
            }
            let payload = {
                "cop_id": cop_id

            }
            let users_full_payload = {
                "values": payload,
                "vm": this,
                "app": "NODE_PRIVATE_API",
                "endpoint": "cop_departments"
            }
            this.$store.dispatch("$_admin/requestDepartmentsList", users_full_payload).then(response => {
                console.log(response);
                console.log('departments data here')
            }, error => {
                console.log(error);
                console.log('departments data not here')

            });
        },
        data: function () {
            return {
                empty_departments_state: 'Fetching Departments',
                pagination_limit: 10,
                pagination_page: 1,
                filterState: false,
                filteredUserData: [],
                search_users: '',
                filterData: {
                    "user": "",
                    "department": ""
                }
            }
        },
        computed: {
            ...mapGetters({
                deptData: '$_admin/getDepartmentsList',
                userData: '$_admin/getUsersList',
            }),
            ...mapActions({
                requestDepartmentsList: '$_admin/requestDepartmentsList'
            }),
            departments_data() {
                let from = (this.pagination_page - 1) * this.pagination_limit;
                let to = this.pagination_page * this.pagination_limit;
                // if (this.filterState == true) {
                //     return this.filteredUserData.slice(from, to);
                // }
                    return this.deptData.slice(from, to);
            },

            active_filter() {
                return this.filterData.user !== "" || this.filterData.department !== "";
            }

        },
        methods: {
            addDepartment() {
                //TODO:route to add department
                this.$router.push('/admin/department/add_department');
            },
            changeSize(val) {
                this.pagination_page = 1;
                this.pagination_limit = val;
            },
            changePage() {
                console.log('Page changed to', this.pagination_page);
                let from = (this.pagination_page - 1) * this.pagination_limit;
                let to = this.pagination_page * this.pagination_limit;
                let departments_data = this.deptData.slice(from, to);
                console.log(from, to, departments_data);

            },
            edit_department(cop_user_id) {
                let cop_user_details = cop_user_id;
                this.$router.push('/admin/department/edit_department/' + cop_user_id);
            },
            filterUserTableData() {
                //reset filter
                this.filterState = false;
                let user_id = this.filterData.user;
                let department = this.filterData.department;

                console.log(user_id);
                console.log(department);

                this.filteredUserData = this.deptData;


                console.log(this.filteredUserData);
                //check if both are filled
                if (department !== '') {
                    //department filter
                    console.log('performing a department filter');

                    let vm = this;
                    this.filteredUserData = this.filteredUserData.filter(function (user) {
                        return user.department_name.toLowerCase().indexOf(vm.filterData.department.toLowerCase()) >= 0;
                    });
                    this.filterState = true;

                }
            },
        }
    }
</script>

<style lang="css">
    @import "../../../assets/styles/datatable.css";

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
