<template lang="html">
  <div class="inv-container">
    <div class="show-out">
      <div class="show-txt">
        <label class="inviteUser--text">Invite link for {{this.getBizName}}</label>
        <input readonly :value="this.getInviteLink" id="in_link" type="text" class="form-control">
      </div>
      <div class="inviteUser--button">
        <a v-on:click="copy_link" class="btn-submit">Copy to clipboard</a>
        <a v-on:click="back" class="waves-effect waves-teal btn-flat">Back</a>
      </div>
    </div>
    <div class="show-in">
      Anyone can use this link to join {{this.getBizName}} on Sendy
    </div>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

export default {
  name: 'link-show-component',
  computed: {
      ...mapGetters(
          {
              getState: '$_admin/getViewState',
              getBizName: '$_admin/getBizName',
              getInviteLink: '$_admin/getInviteLink'
          }
      )
  },
  methods: {
      ...mapMutations(
          {
              updateViewState: '$_admin/setViewState'
          }
      ),
    copy_link: function() {
      var copyText = document.getElementById("in_link");
      copyText.select();
      document.execCommand("Copy")
    },
    back: function() {
        this.updateViewState(2);
        // this.$store.commit('updateViewState', 2)
    }
  }
}
</script>

<style lang="css">
.inviteUser--text{
    padding: 0 0 15px;
    color: #9e9e9e;
    font-size: 14px;
}
.btn-submit{
    padding: 10px !important;
}
.inviteUser--button{
    margin-top: 35px;
    margin-left: 20px;
}
.show-txt
{
  display: flex;
  flex-direction: column;
  flex: 3;
}
.show-out
{
  display: flex;
  flex-direction: row;
  padding: 40px;
}
.show-in
{
  font-size: 14px !important;
  padding: 0px 40px;
  text-align: center;
  color: #9e9e9e !important;
}
</style>
