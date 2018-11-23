<template lang="html">
    <div class="">
        <div class="section--filter-wrap">
            <div class="section--filter-input-wrap">
            </div>
            <div class="section--filter-action-wrap">

                <button v-if="registered" type="button" class="button-primary section--filter-action" name="update_api_text" v-model="update_api_text" v-on:click="updateApiKey">{{this.update_api_text}}</button>
                <button v-if="!registered" type="button" class="button-primary section--filter-action"name="generate_api_text" v-model="generate_api_text" v-on:click="generateAPIKey" >{{this.generate_api_text}}</button>
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
    import {mapGetters, mapActions} from 'vuex'

    export default {
        name: "API",
        mounted() {

            let session = this.$store.getters.getSession;
            let cop_id = 0;
            if(session.default == 'biz'){
                cop_id = session[session.default]['cop_id'];
            }
            let payload = {
                "cop_id": cop_id,
            }
            console.log(payload)
            let apikey_full_payload = {
                "values" : payload,
                "vm":this,
                "app":"NODE_PRIVATE_API",
                "endpoint":"get_api"
            }
            this.$store.dispatch("$_admin/requestKeysList", apikey_full_payload).then(response => {
                console.log(response);
            }, error => {
                console.log(error);
            });
        },
        data: function () {
            return {
                registered: false,
                empty_payments_state: "Fetching API Credentials",
                pagination_limit: 5,
                pagination_page: 1,
                update_api_text:'Update API Key',
                generate_api_text:'Generate API Key',
                button_name: "",
            }
        },
        computed: {
            ...mapGetters({
                fetchedData: '$_admin/getKeysList',
            }),
        },
        methods: {
            ...mapActions({
                requestKeysList: '$_admin/requestKeysList'
            }),
            updateApiKey() {

                let session = this.$store.getters.getSession;
                let cop_id = 0;
                this.update_api_text ='Updating..';
                if(session.default == 'biz'){
                    cop_id = session[session.default]['cop_id'];
                }
                let newKey_payload = {
                    "cop_id": cop_id,
                }
                let newKeyFull_payload = {
                    "values" : newKey_payload,
                    "vm":this,
                    "app":"NODE_PRIVATE_API",
                    "endpoint":"generate_api"
                }
                this.$store.dispatch("$_admin/generateAPIKey", newKeyFull_payload).then(response => {
                    console.log("updated");
                    this.update_api_text ='Update API Key';
                    console.log(response);
                    let level = 1; //success
                    this.message = "Key Updated!"
                    let notification = {"title":"API Key", "level":level, "message":this.message}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true); //activate notification

                }, error => {
                  this.update_api_text ='Update API Key';
                    console.log(error);
                    let level = 2;
                    this.message = "Something went wrong."
                    let notification = {"title":"API Key", "level":level, "message":this.message}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true); //activate notification

                });
            },
            generateAPIKey() {
                let session = this.$store.getters.getSession;
                this.generate_api_text ='Generating..';
                let cop_id = 0;
                if(session.default == 'biz'){
                    cop_id = session[session.default]['cop_id'];
                }
                let newKey_payload = {
                    "cop_id": cop_id,
                }
                let newKeyFull_payload = {
                    "values" : newKey_payload,
                    "vm":this,
                    "app":"NODE_PRIVATE_API",
                    "endpoint":"generate_api"
                }
                this.$store.dispatch("$_admin/generateAPIKey", newKeyFull_payload).then(response => {
                    console.log("generated");
                    console.log(response);
                    this.generate_api_text ='Generate API Key'
                }, error => {
                    console.log("NOT generated");
                    this.generate_api_text ='Generate API Key'
                    console.log(error);
                    let level = 2;
                    this.message = "Something went wrong."
                    let notification = {"title":"API Key", "level":level, "message":this.message}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true); //activate notification

                });
            },
            changeSize(val) {
                this.pagination_page = 1;
                this.pagination_limit = val;
            },
            changePage() {
                console.log('Page changed to', this.pagination_page);
                let from = (this.pagination_page - 1) * this.pagination_limit;
                let to = this.pagination_page * this.pagination_limit;
                this.fetchedData.slice(from, to);
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
                        this.registered =  true
                        // this.button_name = "Update API Key"
                    }
                    else {
                        resp = "Not Registered"
                        this.registered =  false
                        // this.button_name = "Generate API Key"
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
