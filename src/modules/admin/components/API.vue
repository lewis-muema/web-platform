<template lang="html">
    <div class="">
        <div class="section--filter-wrap">
            <div class="section--filter-input-wrap">
            </div>
            <div class="section--filter-action-wrap">

                <button type="button" class="button-primary section--filter-action">{{button_name}}</button>
            </div>
        </div>
        <el-table
                :data="fetchedData"
                style="width: 100%"
                :border="true"
                :stripe="true"
        >
            <template slot="empty">
                {{empty_payments_state}}
            </template>

            <el-table-column
                    label="Username"
                    prop="api_username"
                    width="180"
            >
            </el-table-column>
            <el-table-column
                    label="API Key"
                    prop="api_key">
            </el-table-column>
            <el-table-column
                    label="Created"
                    prop="api_date_created"
            >
            </el-table-column>
            <el-table-column
                    label="API Status"
            >
                <template slot-scope="scope">
                    <span>{{ get_api_status(scope.$index) }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    label="Account Status"
            >
                <template slot-scope="scope">
                    <span>{{ get_account_status(scope.$index) }}</span>
                </template>
            </el-table-column>
        </el-table>

        <div class="api--help-content">
            <p><span class="content--bold">Ready to start using the Sendy API?</span> Head over to the <a
                    href="http://docs.sendypublicapi.apiary.io/#" target="_blank">developer site</a>&nbsp;for complete
                documentation.</p>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'

    export default {
        name: "API",
        mounted() {
            //TODO: Get this from session
            //TODO: also create payload depending on session

            let payload = {
                "cop_id": 669
            }
            this.$store.dispatch("$_admin/requestKeysList", payload).then(response => {
                console.log("Got some data, now lets show something in this component")
                console.log(response);
                this.empty_payments_state = "Keys List Not Found";
            }, error => {
                console.error("Got nothing from server. Prompt user to check internet connection and try again")
                console.log(error);
                this.empty_payments_state = "Keys List Failed to Fetch";
            });
        },
        data: function () {
            return {
                empty_payments_state: "Fetching API Credentials",
                pagination_limit: 5,
                pagination_page: 1,
                button_name: "",
            }
        },
        computed: {
            ...mapGetters({
                fetchedData: '$_admin/getKeysList',
            }),
        },
        methods: {
            updateApiKey() {
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
            get_account_status: function (index) {
                let resp = '';
                if (this.fetchedData.length > 0) {
                    resp = this.fetchedData[index].account_status;
                    if (resp === 1) {
                        resp = "Active"
                    }
                    else {
                        resp = "Deactivated"
                    }
                }
                return resp;
            },
            get_api_status: function (index) {
                let resp = '';
                if (this.fetchedData.length > 0) {
                    resp = this.fetchedData[index].api_status;
                    if (resp === 1) {
                        resp = "Registered"
                        this.button_name = "Update API Key"
                    }
                    else {
                        resp = "Not Registered"
                        this.button_name = "Generate API Key"
                    }
                }
                return resp;
            },

        }
    }
</script>

<style lang="css">
    .api--help-content {
        font-size: 14px;
        margin-top: 20px;
    }
    .api--help-content a {
        color: #2c82c5 !important;
    }
</style>
