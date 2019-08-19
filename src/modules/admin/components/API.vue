<template lang="html">
  <div class="">
    <div class="section--filter-wrap">
      <div class="section--filter-input-wrap" />
      <div class="section--filter-action-wrap">
        <button
          v-if="registered"
          v-model="update_api_text"
          type="button"
          class="button-primary section--filter-action btn-api"
          name="update_api_text"
          @click="updateApiKey"
        >
          {{ this.update_api_text }}
        </button>
        <button
          v-if="!registered"
          v-model="generate_api_text"
          type="button"
          class="button-primary section--filter-action btn-api"
          name="generate_api_text"
          @click="generateAPIKey"
        >
          {{ this.generate_api_text }}
        </button>
      </div>
    </div>
    <el-table
      :data="fetchedData.sandbox"
      style="width: 100%"
      :border="true"
      :stripe="true"
    >
      <template slot="empty">
        {{ empty_payments_state }}
      </template>

      <el-table-column
        label="Username"
        prop="api_username"
      />
      <el-table-column
        label="API Key"
        prop="api_key"
      />
      <el-table-column
        label="Created or Last Updated"
        prop="api_date_created"
      />
      <el-table-column label="API Status">
        <template slot-scope="scope">
          <span>{{ get_api_status(scope.$index, 'sandbox') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Account Status">
        <template slot-scope="scope">
          <span>{{ get_account_status(scope.$index, 'sandbox') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="API Enviroment">
        <template slot-scope="scope">
          <span>Sandbox</span>
        </template>
      </el-table-column>
    </el-table>
    <el-table
      v-if="fetchedData.live"
      :data="fetchedData.live"
      style="width: 100%"
      :border="true"
      :stripe="true"
    >
      <template slot="empty">
        {{ empty_payments_state }}
      </template>

      <el-table-column
        label="Username"
        prop="api_username"
      />
      <el-table-column
        label="API Key"
        prop="api_key"
      />
      <el-table-column
        label="Created or Last Updated"
        prop="api_date_created"
      />
      <el-table-column label="API Status">
        <template slot-scope="scope">
          <span>{{ get_api_status(scope.$index, 'live') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Account Status">
        <template slot-scope="scope">
          <span>{{ get_account_status(scope.$index, 'live') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="API Enviroment">
        <template slot-scope="scope">
          <span>Live</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="api--help-content">
      <p>
        <span class="content--bold">
          Ready to start using the Sendy API?
        </span>
        Head over to the
        <a
          href="http://docs.sendypublicapi.apiary.io/#"
          target="_blank"
        > developer site </a>&nbsp;for complete documentation.
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'API',
  data() {
    return {
      registered: false,
      empty_payments_state: 'Fetching API Credentials',
      pagination_limit: 5,
      pagination_page: 1,
      update_api_text: 'Update API Key',
      generate_api_text: 'Generate API Key',
      button_name: '',
    };
  },
  computed: {
    ...mapGetters({
      fetchedData: '$_admin/getKeysList',
    }),
  },
  mounted() {
    const session = this.$store.getters.getSession;
    let cop_id = 0;
    if (String(session.default) === 'biz') {
      cop_id = session[session.default].cop_id;
    }
    const payload = {
      cop_id,
    };
    const apikeyFullPayload = {
      values: payload,
      vm: this,
      app: 'NODE_PRIVATE_API',
      endpoint: 'get_api',
    };
    this.$store
      .dispatch('$_admin/requestKeysList', apikeyFullPayload)
      .then((response) => {}, (error) => {});
  },
  computed: {
    ...mapGetters({
      fetchedData: '$_admin/getKeysList',
    }),
  },
  methods: {
    ...mapActions({
      requestKeysList: '$_admin/requestKeysList',
    }),
    updateApiKey() {
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      this.update_api_text = 'Updating..';
      if (String(session.default) === 'biz') {
        cop_id = session[session.default].cop_id;
      }
      const newKeyPayload = {
        cop_id,
      };
      const newKeyFullPayload = {
        values: newKeyPayload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'generate_api',
      };
      this.$store.dispatch('$_admin/generateAPIKey', newKeyFullPayload).then(
        (response) => {
          this.update_api_text = 'Update API Key';
          const level = 1; // success
          this.message = 'Key Updated!';
          const notification = { title: '', level, message: this.message }; // notification object
          this.$store.commit('setNotification', notification);
          this.$store.commit('setNotificationStatus', true); // activate notification
        },
        (error) => {
          this.update_api_text = 'Update API Key';
          const level = 3;
          this.message = 'Something went wrong.';
          const notification = { title: '', level, message: this.message }; // notification object
          this.$store.commit('setNotification', notification);
          this.$store.commit('setNotificationStatus', true); // activate notification
        },
      );
    },
    generateAPIKey() {
      const session = this.$store.getters.getSession;
      this.generate_api_text = 'Generating..';
      let cop_id = 0;
      if (String(session.default) === 'biz') {
        cop_id = session[session.default].cop_id;
      }
      const newKeyPayload = {
        cop_id,
      };
      const newKeyFullPayload = {
        values: newKeyPayload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'generate_api',
      };
      this.$store.dispatch('$_admin/generateAPIKey', newKeyFullPayload).then(
        (response) => {
          this.generate_api_text = 'Generate API Key';
          const level = 1; // success
          this.message = 'Key Generated!';
          const notification = { title: '', level, message: this.message }; // notification object
          this.$store.commit('setNotification', notification);
          this.$store.commit('setNotificationStatus', true); // activate notification
        },
        (error) => {
          this.generate_api_text = 'Generate API Key';
          const level = 3;
          this.message = 'Something went wrong.';
          const notification = { title: '', level, message: this.message }; // notification object
          this.$store.commit('setNotification', notification);
          this.$store.commit('setNotificationStatus', true); // activate notification
        },
      );
    },
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      this.fetchedData.slice(from, to);
    },
    get_account_status(index, env) {
      let resp = '';
      if (env === 'sandbox') {
        if (this.fetchedData.sandbox.length > 0) {
          resp = this.fetchedData.sandbox[index].account_status;
          if (resp === 1) {
            resp = 'Active';
          } else {
            resp = 'Deactivated';
          }
        }
      } else if (this.fetchedData.live.length > 0) {
        resp = this.fetchedData.live[index].account_status;
        if (resp === 1) {
          resp = 'Active';
        } else {
          resp = 'Deactivated';
        }
      }
      return resp;
    },
    get_api_status(index, env) {
      let resp = '';
      if (env === 'sandbox') {
        if (this.fetchedData.sandbox.length > 0) {
          resp = this.fetchedData.sandbox[index].api_status;
          if (resp === 1) {
            resp = 'Registered';
            this.registered = true;
          } else {
            resp = 'Not Registered';
            this.registered = false;
          }
        }
      } else if (this.fetchedData.live.length > 0) {
        resp = this.fetchedData.live[index].api_status;
        if (resp === 1) {
          resp = 'Registered';
          this.registered = true;
        } else {
          resp = 'Not Registered';
          this.registered = false;
        }
      }
      return resp;
    },
  },
};
</script>

<style lang="css">
.api--help-content {
  font-size: 14px;
  margin-top: 20px;
}
.api--help-content a {
  color: #2c82c5 !important;
}
.btn-api {
  border-width: 0px;
}
</style>
