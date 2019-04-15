<template lang="html">
  <div class="">
    <div class="inv-container">
      <div class="end-header">
        Invites Sent
      </div>
      <div class="end-text">
        The invites have been sent successfully. They will show up on your users page when they
        accept the invite.
      </div>
      <div class="end-btn">
        <a v-on:click="back_btn" class="end--back-link">Back</a>
        <a v-bind:href="this.getBaseUrl + '/admin/users'" class="button-primary end--button-return"
          >Return to Users</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'end-component',
  methods: {
    ...mapMutations({
      updateViewState: '$_admin/setViewState',
      updateInvites: '$_admin/updateInvites',
      updateAddedStatus: '$_admin/updateAddedStatus',
      newAdds: '$_admin/newAdds',
    }),
    back_btn: function() {
      this.updateViewState(1);
      this.updateInvites([]);
      this.updateAddedStatus('');
      this.newAdds(3);
    },
  },
  computed: {
    ...mapGetters({
      getBaseUrl: '$_admin/getBaseUrl',
    }),
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
