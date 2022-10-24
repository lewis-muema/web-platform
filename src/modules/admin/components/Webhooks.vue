<template lang="html">
  <div>
    <div
      v-if="!api_token"
      class="section--new-api-banner-container"
    >
      <div class="section--new-api-banner">
        <p
          class="section--new-api-banner-title"
        >
          {{ $t('api.web_hooks') }}
        </p>
        <div class="section--filter-input-password">
          <p class="section--filter-input-label">
            {{ $t('api.api_token') }}
          </p>
          <el-input
            v-model="token"
            :placeholder="$t('api.enter_token')"
          />
        </div>
        <div class="section--filter-generate">
          <button
            class="section--filter-generate-button"
            :disabled="loading"
            @click="requestWebhooks()"
          >
            {{ $t('api.proceed') }}
            <i
              v-if="loading"
              class="el-icon-loading"
            />
          </button>
        </div>
        <div
          v-if="envmnt.APIENV === 'live'"
          class="sandbox-inf"
        >
          {{ $t('api.access_sandbox_1') }}
          <a
            href="https://webapptest.sendyit.com/auth/sign_up"
            target="_blank"
          >
            {{ $t('api.here') }}
          </a>
          {{ $t('api.access_sandbox_2') }}
        </div>
      </div>
    </div>
    <div
      v-else
      class=""
    >
      <div class="section--filter-wrap">
        <div class="section--filter-input-wrap" />
        <div class="section--filter-action-wrap">
          <button
            type="button"
            class="button-primary section--filter-action btn-api"
            name="update_api_text"
            @click="addWebhookDetailsDialog = true"
          >
            {{ $t('api.add_web_hook') }}
          </button>
        </div>
      </div>
      <p
        class="section--table-title"
      >
        {{ capitalize(envmnt.APIENV) }} {{ $t('api.api_env') }}
      </p>
      <el-table
        :data="webhooks"
        :border="true"
        :stripe="true"
        class="fetchedDataLayout"
      >
        <template slot="empty">
          {{ empty_payments_state }}
        </template>

        <el-table-column
          :label="$t('api.events')"
          prop="webhook_event.name"
        />
        <el-table-column
          :label="$t('api.url')"
          prop="webhook_url"
        />
        <el-table-column
          :label="$t('api.authorization')"
          prop="token"
        >
          <template slot-scope="scope">
            <i
              class="el-icon-edit webhook-edit-icon"
              @click="editWebHook(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div class="api--help-content">
        <p>
          <span class="content--bold">
            {{ $t('api.ready_to_start') }}
          </span>
          {{ $t('api.head_over') }}
          <a
            href="https://api.sendyit.com/v2/documentation"
            target="_blank"
          > {{ $t('api.developer_site') }} </a>&nbsp;{{ $t('api.complete_doc') }}
        </p>
      </div>
      <el-dialog
        :visible.sync="addWebhooksDialog"
        width="30%"
      >
        <div class="add-webhooks-container">
          <p class="add-webhooks-title">
            {{ $t('api.add_web_hooks') }}
          </p>
          <p
            class="add-webhooks-description"
          >
            {{ $t('api.select_env') }}
          </p>
          <div class="add-webhooks-environments">
            <el-radio
              v-model="env"
              label="1"
              class="add-webhooks-envs"
            >
              {{ $t('api.staging_env') }}
            </el-radio>
            <el-radio
              v-model="env"
              label="2"
              class="add-webhooks-envs"
            >
              {{ $t('api.live_env') }}
            </el-radio>
          </div>
          <button
            :class="env > 0 ? 'add-webhooks-button-active' : 'add-webhooks-button-inactive'"
            @click="addWebhooksDialog = false; addWebhookDetailsDialog = true"
          >
            {{ $t('api.add_web_hook') }}
          </button>
        </div>
      </el-dialog>
      <el-dialog
        :visible.sync="addWebhookDetailsDialog"
        width="30%"
      >
        <div class="add-webhooks-container">
          <p class="add-webhooks-title">
            {{ $t('api.add_web_hooks') }}
          </p>
          <div class="add-webhooks-inputs-container">
            <p>{{ $t('api.events') }}</p>
            <el-select
              v-model="events"
              placeholder="Select"
              class="add-webhooks-inputs-events"
            >
              <el-option
                v-for="item in eventData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
            <p>{{ $t('api.url') }}</p>
            <el-input
              v-model="url"
            />
            <p>{{ $t('api.authorization') }}</p>
            <el-input
              v-model="authorization"
            />
          </div>
          <button
            :class="url && events ? 'add-webhooks-button-active' : 'add-webhooks-button-inactive'"
            @click=" action === 'add' ? addWebHook() : editWebHooks()"
          >
            {{ $t('api.add_web_hook') }}
            <i
              v-if="loading"
              class="el-icon-loading"
            />
          </button>
        </div>
      </el-dialog>
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
      addWebhooksDialog: false,
      addWebhookDetailsDialog: false,
      env: 0,
      eventData: [],
      webhooks: [],
      envs: [this.$t('api.sandbox'), this.$t('api.live')],
      environment: '',
      events: '',
      url: '',
      authorization: '',
      token: '',
      api_token: '',
      loading: false,
      action: 'add',
      index: '',
    };
  },
  computed: {
    ...mapGetters({
      fetchedData: '$_admin/getKeysList',
      envmnt: 'getENV',
    }),
  },
  mounted() {
    this.apiEnvironment = this.$store.state.ENV.ENVIRONMENT === 'production' ? 'Live' : 'Sandbox';
  },
  methods: {
    ...mapActions({
      requestKeysList: '$_admin/requestKeysList',
      getWebHooks: '$_admin/getWebHooks',
      getUserWebHooks: '$_admin/getUserWebHooks',
      addWebHooks: '$_admin/addWebHooks',
      updateWebHooks: '$_admin/updateWebHooks',
    }),
    capitalize(env) {
      return env.charAt(0).toUpperCase() + env.slice(1);
    },
    requestWebhooks() {
      if (!this.token) {
        const level = 2;
        const message = this.$t('api.enter_details');
        const notification = { title: '', level, message }; // notification object
        this.displayNotification(notification);
      } else {
        this.loading = true;
        localStorage.api_environment = this.environment;
        this.getWebHooks().then((response) => {
          let level;
          if (response.status) {
            this.eventData = response.data;
            this.getUserWebHooks().then((res) => {
              this.loading = false;
              this.webhooks = res.status ? res.data : [];
              this.empty_payments_state = this.webhooks.length === 0 ? this.$t('api.no_data') : this.$t('api.api_credentials');
              this.api_token = this.token;
            });
          } else {
            level = 2;
            const { message } = response;
            const notification = { title: '', level, message }; // notification object
            this.displayNotification(notification);
          }
        });
      }
    },
    editWebHook(i) {
      this.action = 'edit';
      this.addWebhookDetailsDialog = true;
      this.url = this.webhooks[i].webhook_url;
      this.events = this.webhooks[i].webhook_event.id;
      this.index = i;
    },
    editWebHooks() {
      const i = this.index;
      if (!this.url || !this.events) {
        const level = 2;
        const message = this.$t('api.enter_details');
        const notification = { title: '', level, message }; // notification object
        this.displayNotification(notification);
      } else {
        this.loading = true;
        localStorage.api_environment = this.environment;
        const payload = {
          webhook_log_url: this.url,
          webhook_event_id: this.events,
          webhook_id: this.webhooks[i].id,
          status: true,
        };
        this.updateWebHooks(payload).then((response) => {
          let level;
          if (response.status) {
            level = 1;
            const { message } = response;
            const notification = { title: '', level, message }; // notification object
            this.displayNotification(notification);
            this.addWebhookDetailsDialog = false;
            this.getUserWebHooks().then((res) => {
              this.loading = false;
              this.webhooks = res.status ? res.data : [];
              this.api_token = this.token;
            });
          } else {
            level = 2;
            const { message } = response;
            const notification = { title: '', level, message }; // notification object
            this.displayNotification(notification);
          }
        });
      }
    },
    addWebHook() {
      this.action = 'add';
      if (!this.url || !this.events) {
        const level = 2;
        const message = this.$t('api.enter_details');
        const notification = { title: '', level, message }; // notification object
        this.displayNotification(notification);
      } else {
        this.loading = true;
        localStorage.api_environment = this.environment;
        const payload = {
          webhook_log_url: this.url,
          webhook_event_id: this.events,
        };
        this.addWebHooks(payload).then((response) => {
          let level;
          if (response.status) {
            level = 1;
            const { message } = response;
            const notification = { title: '', level, message }; // notification object
            this.displayNotification(notification);
            this.addWebhookDetailsDialog = false;
            this.getUserWebHooks().then((res) => {
              this.loading = false;
              this.webhooks = res.status ? res.data : [];
              this.api_token = this.token;
            });
          } else {
            level = 2;
            const { message } = response;
            const notification = { title: '', level, message }; // notification object
            this.displayNotification(notification);
          }
        });
      }
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
.sandbox-inf {
  margin: 25px 0px;
  width: 300px;
  text-align: center;
  font-size: 14px;
}
</style>
