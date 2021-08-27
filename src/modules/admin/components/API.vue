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
          {{ update_api_text }}
        </button>
        <button
          v-if="!registered"
          v-model="generate_api_text"
          type="button"
          class="button-primary section--filter-action btn-api"
          name="generate_api_text"
          @click="generateAPIKey"
        >
          {{ generate_api_text }}
        </button>
      </div>
    </div>
    <el-table
      :data="fetchedData.sandbox"
      :border="true"
      :stripe="true"
      class="fetchedDataLayout"
    >
      <template slot="empty">
        {{ empty_payments_state }}
      </template>

      <el-table-column
        :label="$t('api.username')"
        prop="api_username"
      />
      <el-table-column
        :label="$t('api.api_key')"
        prop="api_key"
      />
      <el-table-column
        :label="$t('api.created_updated')"
        prop="api_date_created"
      />
      <el-table-column :label="$t('api.api_status')">
        <template slot-scope="scope">
          <span>{{ get_api_status(scope.$index, 'sandbox') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('api.account_status')">
        <template slot-scope="scope">
          <span>{{ get_account_status(scope.$index, 'sandbox') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('api.api_environment')">
        <template slot-scope="scope">
          <span>{{$t('api.sandbox')}}</span>
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
        :label="$t('api.username')"
        prop="api_username"
      />
      <el-table-column
        :label="$t('api.api_key')"
        prop="api_key"
      />
      <el-table-column
        :label="$t('api.created_updated')"
        prop="api_date_created"
      />
      <el-table-column :label="$t('api.api_status')">
        <template slot-scope="scope">
          <span>{{ get_api_status(scope.$index, 'live') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('api.account_status')">
        <template slot-scope="scope">
          <span>{{ get_account_status(scope.$index, 'live') }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('api.api_environment')">
        <template slot-scope="scope">
          <span>{{$t('api.live')}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="api--help-content">
      <p>
        <span class="content--bold">
         {{$t('api.ready_to_start')}}
        </span>
        {{$t('api.head_over')}}
        <a
          href="https://api.sendyit.com/v2/documentation"
          target="_blank"
        > {{$t('api.developer_site')}} </a>&nbsp;{{$t('api.complete_doc')}}
      </p>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  name: 'API',
  mixins: [NotificationMxn],
  data() {
    return {
      registered: false,
      empty_payments_state: this.$t('api.api_credentials'),
      pagination_limit: 5,
      pagination_page: 1,
      update_api_text: this.$t('api.update_key'),
      generate_api_text: this.$t('api.generate_api_key'),
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
  methods: {
    ...mapActions({
      requestKeysList: '$_admin/requestKeysList',
    }),
    updateApiKey() {
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      this.update_api_text =  this.$t('api.updating');
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
          this.update_api_text = this.$t('api.update_key');
          const level = 1; // success
          this.message = this.$t('api.key_updated');
          const notification = { title: '', level, message: this.message }; // notification object
          this.displayNotification(notification);
        },
        (error) => {
          this.update_api_text = this.$t('api.update_key');
          const level = 3;
          this.message = this.$t('api.something_went_wrong');
          const notification = { title: '', level, message: this.message }; // notification object
          this.displayNotification(notification);
        },
      );
    },
    generateAPIKey() {
      const session = this.$store.getters.getSession;
      this.generate_api_text = this.$t('api.generating');
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
          this.generate_api_text = this.$t('api.generate_api_key');
          const level = 1; // success
          this.message = this.$t('api.key_generated');
          const notification = { title: '', level, message: this.message }; // notification object
          this.displayNotification(notification);
        },
        (error) => {
          this.generate_api_text = this.$t('api.generate_api_key');
          const level = 3;
          this.message = this.$t('api.something_went_wrong');
          const notification = { title: '', level, message: this.message }; // notification object
          this.displayNotification(notification);
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
            resp = this.$t('api.active');
          } else {
            resp = this.$t('api.deactivated');
          }
        }
      } else if (this.fetchedData.live.length > 0) {
        resp = this.fetchedData.live[index].account_status;
        if (resp === 1) {
          resp = this.$t('api.active');
        } else {
          resp = this.$t('api.deactivated');
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
            resp = this.$t('api.registered');
            this.registered = true;
          } else {
            resp = this.$t('api.not_registered');
            this.registered = false;
          }
        }
        this.empty_payments_state = this.$t('api.no_api_cred');
      } else if (this.fetchedData.live.length > 0) {
        resp = this.fetchedData.live[index].api_status;
        if (resp === 1) {
          resp = this.$t('api.registered');
          this.registered = true;
        } else {
          resp = this.$t('api.not_registered');
          this.registered = false;
        }
      }
      this.empty_payments_state = this.$t('api.no_api_cred');
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
.fetchedDataLayout{
  width: 100%;
  margin-bottom: 2%;
}
</style>
