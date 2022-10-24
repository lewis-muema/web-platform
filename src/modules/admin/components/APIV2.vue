<template lang="html">
  <div>
    <div
      v-if="generate_password > 0"
      class="section--new-api-banner-container"
    >
      <div class="section--new-api-banner">
        <p
          v-if="generate_password === 1"
          class="section--new-api-banner-title"
        >
          {{ $t('api.set_api_password') }}
        </p>
        <p
          v-if="generate_password === 2"
          class="section--new-api-banner-title"
        >
          {{ $t('api.api_password') }}
        </p>
        <div class="section--filter-input-password">
          <p class="section--filter-input-label">
            {{ $t('api.password') }}
          </p>
          <el-input
            v-model="password"
            :placeholder="$t('api.enter_password')"
          />
        </div>
        <div
          v-if="generate_password === 1"
          class="section--filter-input-password"
        >
          <p class="section--filter-input-label">
            {{ $t('api.confirm_password') }}
          </p>
          <el-input
            v-model="passwordConfirm"
            :placeholder="$t('api.enter_password')"
          />
        </div>
        <div class="section--filter-generate">
          <button
            class="section--filter-generate-button"
            :disabled="loading"
            @click="generate_password === 1 ? generatePassword() : generateTokens()"
          >
            {{ $t('api.generate') }}
            <i
              v-if="loading"
              class="el-icon-loading"
            />
          </button>
        </div>
        <p class="section--filter-password-toggle">
          <span
            v-if="generate_password === 1"
            class="section--filter-password-toggle-left"
          >
            {{ $t('api.already_set_password') }}
          </span>
          <span
            v-if="generate_password === 2"
            class="section--filter-password-toggle-left"
          >
            {{ $t('api.dont_have_a_password') }}
          </span>
          <span
            v-if="generate_password === 1"
            class="section--filter-password-toggle-right"
            @click="generate_password = 2"
          >
            {{ $t('api.enter_password') }}
          </span>
          <span
            v-if="generate_password === 2"
            class="section--filter-password-toggle-right"
            @click="generate_password = 1"
          >
            {{ $t('api.set_password') }}
          </span>
        </p>
        <div
          v-if="envmnt.APIENV === 'live'"
          class="sandbox-info"
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
      class="section--new-api-banner-container"
    >
      <div class="section--new-api-banner banner-override">
        <i class="el-icon-warning section--new-api-banner-icon" />
        <p
          class="section--new-api-banner-title"
        >
          {{ newApiKeys ? $t('api.generate_new_keys') : $t('api.store_keys') }}
        </p>
        <p class="">
          {{ $t('api.store_your_keys_safely') }}
        </p>
        <div class="section--filter-api-data">
          <div class="section--filter-api-data-section">
            <p>{{ $t('api.api_username') }}</p>
            <p>{{ $t('api.api_token') }}</p>
            <p>{{ $t('api.date_created') }}</p>
            <p>{{ $t('api.api_status') }}</p>
            <p>{{ $t('api.account_status') }}</p>
            <p>{{ $t('api.api_env') }}</p>
          </div>
          <div class="section--filter-api-data-section">
            <p>{{ userName }}</p>
            <p>{{ apiToken }}</p>
            <p>{{ apiDateCreated }}</p>
            <p>{{ $t('api.registered') }}</p>
            <p>{{ $t('api.active') }}</p>
            <p>{{ apiEnvironment }}</p>
          </div>
        </div>
        <div class="section--filter-generate">
          <button
            class="section--filter-generate-button"
            :disabled="loading"
            @click="createAPIDetailsTxt()"
          >
            {{ $t('api.save_api') }}
            <i
              v-if="loading"
              class="el-icon-loading"
            />
          </button>
        </div>
      </div>
    </div>
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';
import { saveAs } from 'file-saver';
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
      generate_password: 1,
      password: '',
      passwordConfirm: '',
      loading: false,
      newApiKeys: true,
      userName: '',
      envs: [this.$t('api.sandbox'), this.$t('api.live')],
      environment: '',
      apiToken: '',
      apiDateCreated: '',
      apiEnvironment: '',
    };
  },
  computed: {
    ...mapGetters({
      fetchedData: '$_admin/getKeysList',
      envmnt: 'getENV',
    }),
  },
  mounted() {
    const session = this.$store.getters.getSession;
    this.userName = session[session.default].user_name;
    this.generate_password = process.browser && localStorage.api_password ? 2 : 1;
    this.apiEnvironment = this.$store.state.ENV.ENVIRONMENT === 'production' ? 'Live' : 'Sandbox';
    this.environment = this.apiEnvironment;
  },
  methods: {
    ...mapActions({
      requestKeysList: '$_admin/requestKeysList',
      generateAPIPassword: '$_admin/generateAPIPassword',
      generateAPITokens: '$_admin/generateAPITokens',
    }),
    generatePassword() {
      if (!this.password || !this.passwordConfirm) {
        const level = 2;
        const message = this.$t('api.enter_details');
        const title = this.$t('api.generate_password_error');
        const notification = { title, level, message }; // notification object
        this.displayNotification(notification);
      } else if (this.password !== this.passwordConfirm) {
        const level = 2;
        const message = this.$t('api.ensure_passwords_match');
        const title = this.$t('api.generate_password_error');
        const notification = { title, level, message }; // notification object
        this.displayNotification(notification);
      } else {
        const session = this.$store.getters.getSession;
        const payload = {
          cop_id: session[session.default].cop_id,
          cop_user_id: session[session.default].user_id,
          password: this.password,
          password_confirmation: this.passwordConfirm,
        };
        this.loading = true;
        this.generateAPIPassword(payload).then((response) => {
          this.loading = false;
          if (response.status === 200) {
            const level = 1;
            const { message } = response.data;
            const notification = { title: '', level, message }; // notification object
            this.displayNotification(notification);
            localStorage.api_password = payload.password;
            this.generateTokens();
          } else {
            const level = 2;
            const { message } = response.data;
            const title = this.$t('api.generate_password_token');
            const notification = { title, level, message }; // notification object
            this.displayNotification(notification);
            localStorage.removeItem('api_password');
          }
        });
      }
    },
    generateTokens() {
      if (!this.password) {
        const level = 2;
        const message = this.$t('api.enter_details');
        const title = this.$t('api.generate_password_token');
        const notification = { title, level, message }; // notification object
        this.displayNotification(notification);
      } else {
        const session = this.$store.getters.getSession;
        const payload = {
          email: session[session.default].user_email,
          password: this.password,
          // environment: this.environment,
        };
        this.apiEnvironment = this.environment;
        this.loading = true;
        this.generateAPITokens(payload).then((response) => {
          this.loading = false;
          this.password = '';
          this.passwordConfirm = '';
          this.environment = '';
          if (response.status === 200) {
            const level = 1;
            const { message } = response.data;
            const notification = { title: '', level, message }; // notification object
            this.displayNotification(notification);
            localStorage.api_token = response.data.data.token;
            localStorage.token_type = response.data.data.type;
            localStorage.api_date_created = moment().format('MMMM Do, YYYY');
            localStorage.api_environment = this.apiEnvironment;
            this.apiToken = response.data.data.token;
            this.apiDateCreated = moment().format('MMMM Do, YYYY');
            this.generate_password = 0;
          } else {
            const level = 2;
            const { message } = response.data;
            const title = this.$t('api.generate_password_token');
            const notification = { title, level, message }; // notification object
            this.displayNotification(notification);
            localStorage.removeItem('api_token');
            localStorage.removeItem('token_type');
            localStorage.removeItem('api_date_created');
            localStorage.removeItem('api_password');
            this.generate_password = 1;
          }
        });
      }
    },
    createAPIDetailsTxt() {
      const session = this.$store.getters.getSession;
      const blob = new Blob(
        [`SENDY TOKEN\r\n\r\nAPI Token: ${this.apiToken}\r\nDate Created: ${this.apiDateCreated}\r\nEnvironment: ${this.apiEnvironment}\r\nCop Id: ${session[session.default].cop_id}\r\nCop User Id: ${session[session.default].user_id}`],
        { type: 'text/plain;charset=utf-8' },
      );
      // eslint-disable-next-line no-undef
      saveAs(blob, 'Sendy_API_token.txt');
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
.sandbox-info {
  width: 300px;
  text-align: center;
  font-size: 14px;
  color: #BDBDBD;
}
</style>
