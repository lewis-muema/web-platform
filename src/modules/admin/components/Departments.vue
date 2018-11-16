<template lang="html">
    <div class="departments_container" id="departments_container">
        <div class="section--filter-wrap">
            <div class="section--filter-input-wrap">
            </div>
            <div class="section--filter-action-wrap">
                <button class="button-primary section--filter-action" @click="addDepartment">Add Department</button>
            </div>
        </div>
        <!--{{fetchedData}}-->
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
                    prop="department_name"
                    width="250"
            >
            </el-table-column>
            <el-table-column
                    label="Approver"
                    prop="department_admin">
            </el-table-column>
            <el-table-column
                    label="Action">
                <template slot-scope="scope">
                    <a>Edit</a>
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
        name: "Departments",
        mounted() {
            //TODO: Get this from session
            //TODO: also create payload depending on session

            let payload = {
                "cop_id": 1083
            }
            this.$store.dispatch("$_admin/requestDepartmentsList", payload).then(response => {
                console.log("Got some data, now lets show something in this component")
                console.log(response);
                this.empty_orders_state = "Users List Not Found";
            }, error => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
                console.log(error);
                this.empty_orders_state = "Users List Failed to Fetch";
            });
        },
        data: function () {
            return {
                empty_orders_state: 'Fetching Departments',
                pagination_limit: 5,
                pagination_page: 1,

                tableData: [
                    {
                        "name": "CASH-AC29TZ828-T4W",
                        "approver": "Computer Architecture",
                    },
                    {
                        "name": "CASH-AC29TZ828-T4W",
                        "approver": "Asp.Net 4 Blue Book",
                    },
                    {
                        "name": "CASH-AC29TZ828-T4W",
                        "approver": "Popular Science",
                    }
                ]
            }
        },
        computed: {
            ...mapGetters({
                fetchedData: '$_admin/getDepartmentsList',
            }),
        },
        methods: {
            addDepartment() {
                //TODO:route to add department
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
