<template lang="html">
    <div class="">
        <div class="admin_invite_outer" v-if = ' 1== 1'>
           <invite-component></invite-component>
         </div>
         <div class="admin_invite_outer" v-else-if = 'this.getViewState == 2'>
           <link-component></link-component>
         </div>
         <div class="admin_invite_outer" v-else-if = 'this.getViewState == 3'>
           <many-component></many-component>
         </div>
         <div class="admin_invite_outer" v-else-if = 'this.getViewState == 4'>
           <end-component></end-component>
         </div>
         <div class="admin_invite_outer" v-else-if = 'this.getViewState == 5'>
           <link-show-component></link-show-component>
         </div>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import ManyComponent from './invite_users/ManyComponent.vue'
import EndComponent from './invite_users/EndComponent.vue'
import InviteComponent from './invite_users/InviteComponent.vue'
import LinkComponent from './invite_users/LinkComponent.vue'
import LinkShowComponent from './invite_users/LinkShowComponent.vue'

export default {
    name:'AddUser',
    components: {InviteComponent,ManyComponent,LinkComponent,EndComponent,LinkShowComponent},
    computed: {
       ...mapGetters(
         [
           'getBizName',
           'getViewState'
         ]
       )
     },
     mounted() {
        let materialize_script = document.createElement('script')
        materialize_script.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-alpha.4/js/materialize.min.js')
        document.head.appendChild(materialize_script)
      },
}
</script>
<style scoped">
    @import "https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0-alpha.4/css/materialize.min.css";

</style>
<style lang="css">
@import "https://fonts.googleapis.com/icon?family=Material+Icons";
.cancel-btn
{
  background-color: transparent;
  color: #333;
}

.cancel-btn:hover
{
  background-color: transparent;
}

.inv-container
{
  width: 1080px;
  margin: 0 auto;
}

.side-flex
{
  padding: 10px;
  display: flex;
}

.up-flex
{
  flex-direction: column;
}

.column-flex
{
  display: flex;
  flex-direction: column;
  flex: 1.5;
}

.space-right
{
  margin-right: 10%;
}

.pad-flex
{
  padding-left: 5%;
  padding-right: 5%;
}

.dropdown-content li>a, .dropdown-content li>span
{
  color: #1782c5;
  font-size: 14px;
}

.blue
{
  background-color: #1782c5 !important;
}

.select-wrapper input.select-dropdown
{
  font-size: 14px !important;
}

input:not([type]), input[type=text]:not(.browser-default), input[type=password]:not(.browser-default), input[type=email]:not(.browser-default), input[type=url]:not(.browser-default), input[type=time]:not(.browser-default), input[type=date]:not(.browser-default), input[type=datetime]:not(.browser-default), input[type=datetime-local]:not(.browser-default), input[type=tel]:not(.browser-default), input[type=number]:not(.browser-default), input[type=search]:not(.browser-default), textarea.materialize-textarea
{
  font-size: 14px;
}

input:not([type]):focus:not([readonly]), input[type=text]:not(.browser-default):focus:not([readonly]), input[type=password]:not(.browser-default):focus:not([readonly]), input[type=email]:not(.browser-default):focus:not([readonly]), input[type=url]:not(.browser-default):focus:not([readonly]), input[type=time]:not(.browser-default):focus:not([readonly]), input[type=date]:not(.browser-default):focus:not([readonly]), input[type=datetime]:not(.browser-default):focus:not([readonly]), input[type=datetime-local]:not(.browser-default):focus:not([readonly]), input[type=tel]:not(.browser-default):focus:not([readonly]), input[type=number]:not(.browser-default):focus:not([readonly]), input[type=search]:not(.browser-default):focus:not([readonly]), textarea.materialize-textarea:focus:not([readonly])
{
  border-bottom: 1px solid #1782c5;
  -webkit-box-shadow: 0 1px 0 0 #1782c5;
  box-shadow: 0 1px 0 0 #1782c5;
}
</style>
