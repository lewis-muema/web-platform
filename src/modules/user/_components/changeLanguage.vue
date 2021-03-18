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

        <button type="primary" class="button-primary home-view--place-order btn" >{{$t('general.save')}}</button>
        
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'changeLanguage',
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