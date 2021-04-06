<template lang="html">
  <div class="new-card2">
    <div class="help-card" >
        <p> {{$t('general.choose_preffered_language')}}</p>
        <el-select v-model="locale" placeholder="Select" class="select">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <button type="primary" class="button-primary home-view--place-order btn" @click="changeLanguage" >{{$t('general.save')}}</button>
        
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  name: 'changeLanguage',
  mixins: [NotificationMxn],
  data() {
    return {
      options: [
        {
          value: 'en',
          label: 'English (EN)'
        },
        {
        value: 'fr',
        label: 'Francais (FR)'
        }, 
      ],
      locale: 'en',
    }
  },
  computed: {
    ...mapGetters(['getSession', 'getENV'])
  },
  watch: {
    locale(val) {
      this.$i18n.locale = val;
      const countryCode = localStorage.getItem('countryCode');
      const acceptLanguage = `${val}-${countryCode}`;
      localStorage.setItem('timeLocale', val);
      localStorage.setItem('language', acceptLanguage);
      this.setLanguage(val);
    },
  },
  mounted() {
    this.locale = localStorage.getItem('timeLocale');
  }, 
  methods: {
    ...mapMutations(['setLanguage']),
    ...mapActions({
      requestChangeLanguage: '$_user/requestChangeLanguage',
    }),
    changeLanguage() {
      const session = this.getSession;
      const payload = {
        preferred_language: this.locale,
      }
      switch (session.default) {
        case 'biz': {
          if (session[session.default].user_type === 2) {
            payload.cop_user_id = session[session.default].user_id;
          }
          else {
            payload.user_id = session[session.default].user_id; 
          }
          break;
        }
        default:{
          payload.user_id = session[session.default].user_id;
          break;
        }
      }
      const fullPayload = {
        values: payload,
        vm: this,
        app: 'ADONIS_PRIVATE_API',
        endpoint: 'user-preferences',
      };

      this.requestChangeLanguage(fullPayload).then((response) => {
        const level = response.status ? 1 : 3 ;
        this.message = response.status ? this.$t('general.language_changed') : this.$t('general.something_went_wrong');
        const notification = { title: '', level, message: this.message };
        this.displayNotification(notification);
      },
      (error) => {
        const level = 3;
        this.message = this.$t('general.something_went_wrong');
        const notification = { title: '', level, message: this.message };
        this.displayNotification(notification);
      });
    }

  }

}
</script>

<style scoped>
.help-card {
  -webkit-box-flex: 1;
  flex: 1;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  padding-top: 30px;
  width:400px;
  margin-left:30%;
  margin-top:30px;
}

.new-card2 {
  -webkit-box-flex: 1;
  flex: 1;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  padding-top: 3px ! important;

}
.select {
  width: 240px;
  height: 32px;
  background: #F7F9FC;
  border-radius: 4px;
}
.btn {
  width: 156px;
  height: 44px;
  margin-top: 60px;
}
</style>