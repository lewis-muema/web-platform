<template lang="html">
  <div class="">
    <div class="inv-container">
      <div class="end-header">
        {{ $t('endComponent.invite_sent') }}
      </div>
      <div class="end-text">
        {{ $t('endComponent.invite_sent_successful') }}
      </div>
      <div class="end-btn">
        <a
          class="end--back-link"
          @click="back_btn"
        >{{ $t('endComponent.back') }}</a>
        <a
          :href="getBaseUrl + '/admin/users'"
          class="button-primary end--button-return"
        >{{ $t('endComponent.return_to_users') }}</a>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'EndComponent',
  computed: {
    ...mapGetters({
      getBaseUrl: '$_admin/getBaseUrl',
    }),
  },
  methods: {
    ...mapMutations({
      updateViewState: '$_admin/setViewState',
      updateInvites: '$_admin/updateInvites',
      updateAddedStatus: '$_admin/updateAddedStatus',
      newAdds: '$_admin/newAdds',
    }),
    back_btn() {
      this.updateViewState(1);
      this.updateInvites([]);
      this.updateAddedStatus('');
      this.newAdds(3);
    },
  },
};
</script>

<style lang="css">
.end--button-return
{
  text-align: center;
  margin-left: 35px;
  position: relative;
  line-height: 40px;
}
.end--back-link{
  line-height: 40px;
}
.end-header
{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}
.end-text
{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  padding: 5% 0px;
  color: #555;
}
.end-btn
{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
