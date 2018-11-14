<template lang="html">
  <div class="">
    <div class="inv-container">
      <div class="end-header">
        Invites Sent
      </div>
      <div class="end-text">
        The invites have been sent successfully. They will show up on your users page when they accept the invite.
      </div>
      <div class="end-btn">
        <a v-on:click="back_btn" class="waves-effect waves-light btn blue">Back</a>
        <a v-bind:href="this.getBaseUrl + 'coporate/user/'" class="waves-effect waves-light btn blue">Return to Users</a>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'end-component',
  methods:
  {
      ...mapMutations(
          {
              updateViewState: '$_admin/setViewState',
              updateInvites: '$_admin/updateInvites',
              updateAddedStatus: '$_admin/updateAddedStatus',
              newAdds: '$_admin/newAdds',
          }
      ),
    back_btn: function() {
      this.updateViewState(1)
      this.updateInvites ([])
      this.updateAddedStatus ('')
      this.newAdds (3)
    }
  },
  computed: {
      ...mapGetters(
          {
              getBaseUrl: '$_admin/getBaseUrl',

          }
      ),
  },
}
</script>

<style lang="css">
.end-header
{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
}
.end-text
{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: large;
  padding: 5% 0px;
}
.end-btn
{
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
