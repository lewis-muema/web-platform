<template lang="html">
  <div class="inv-container">
    <div class="show-out">
      <div class="show-txt">
        <label class="inviteUser--text">{{ $t('linkComponent.invite_link', {bizName: bizName}) }}</label>
        <input
          id="in_link"
          readonly
          :value="getInviteLink"
          type="text"
          class="form-control show--input"
        >
      </div>
      <div class="inviteUser--button">
        <button
          class="button-primary"
          @click="copy_link"
        >
          {{ button }}
        </button>
      </div>
      <div class="inviteUser--button show-button-justify">
        <a
          class="show-link-justify"
          @click="back"
        >{{ $t('linkComponent.back') }}</a>
      </div>
    </div>
    <div class="show-in">
      {{ $t('linkComponent.use_link_to_join', {getBizName: getBizName}) }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'LinkShowComponent',
  data() {
    return {
      button: this.$t('linkComponent.copy_to_clipboard'),
      bizName: '',
    };
  },
  computed: {
    ...mapGetters({
      getState: '$_admin/getViewState',
      getBizName: '$_admin/getBizName',
      getInviteLink: '$_admin/getInviteLink',
    }),
  },
  mounted() {
    const session = this.$store.getters.getSession;
    if (session.default === 'biz') {
      this.bizName = session[session.default].cop_name;
    }
  },
  methods: {
    ...mapMutations({
      updateViewState: '$_admin/updateViewState',
    }),

    copy_link() {
      const copyText = document.getElementById('in_link');
      copyText.select();
      document.execCommand('Copy');
      this.button = this.$t('linkComponent.copied');
    },
    back() {
      this.updateViewState(1);
    },
  },
};
</script>

<style lang="css">
.inviteUser--text {
    padding: 0 0 15px;
    color: #555;
    font-size: 14px;
}

.btn-submit {
    padding: 10px !important;
}

.inviteUser--button {
    margin-top: 48px;
    margin-left: 20px;
}

.show-txt {
    display: flex;
    flex-direction: column;
    flex: 3;
}

.show-out {
    display: flex;
    flex-direction: row;
    padding: 40px;
}

.show-in {
    font-size: 14px !important;
    padding: 0px 40px;
    text-align: left;
    color: #555 !important;
}

.show--input {
    margin-top: 17px !important;
}

.show-button-justify {
    padding-top: 10px !important;
    color: #555 !important;
}

.show-link-justify {
    color: #555 !important;
    text-align: right !important;
    padding-top: 10px !important;
}
</style>
