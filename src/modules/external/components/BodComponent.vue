<template lang="html">
  <div class="user-invite-body">
    <div class="container">
      <div class="content">
        <div class="panel-card">
          <form-panel-component />
        </div>
        <div
          v-if="getViewState != 4"
          class="help-card"
        >
          <help-panel-component />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import FormPanelComponent from './FormPanelComponent.vue';
import HelpPanelComponent from './HelpPanelComponent.vue';

export default {
  name: 'BodComponent',
  components: { FormPanelComponent, HelpPanelComponent },
  computed: {
    ...mapGetters({
      getViewState: '$_external/getViewState',
    }),
  },
};
</script>

<style lang="css">
.content
{
  display: flex;
  /* padding: 30px; */
  flex-direction: row !important;
}
.column
{
  display: flex;
  flex-direction: column;
}
.col-help
{
  flex: 1;
}
.col-form
{
  flex: 2;
  padding-right: 40px;
}
.panel-card{
  -webkit-box-flex: 2;
  flex: 2;
  padding-right: 40px;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
}
.help-card{
  -webkit-box-flex: 1;
  flex: 1;
  -webkit-box-orient: vertical;
  flex-direction: column;
  display: flex;
  -webkit-box-direction: normal;
  padding-top: 30px;

}
.user-invite-body{
  background-color: #fcfcfc;
}
</style>
