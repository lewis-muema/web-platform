<template lang="html">
  <div class="help-panel-outer">
    <div class="row">
      <div
        class="col s9 m11"
        style="padding-top:35%;"
      >
        <div class="card-panel">
          <p class="card-head">
            <img
              src="https://s3-eu-west-1.amazonaws.com/sendy-promo-images/frontend_apps/bulb_blue.png"
              alt="Help"
              style="width:25px;"
            >
          </p>
          <p class="card-title">
            {{ current_help[0] }}
          </p>
          <p class="card-text">
            {{ current_help[1] }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'HelpPanelComponent',
  computed: {
    ...mapGetters({
      getViewState: '$_external/getViewState',
      getViewStep: '$_external/getViewStep',
      getHelpPanel: '$_external/getHelpPanel',
      getBizName: '$_external/getBizName',
    }),
    current_help() {
      const state = this.getViewState;
      const step = this.getViewStep;
      const helpa = this.getHelpPanel(this.getBizName);
      return helpa[state][step];
    },
  },
};
</script>

<style lang="css">
.card-text
{
  line-height: 200%;
}
.card-title
{
  color: #333;
}
.card-panel{
  transition: box-shadow .25s, -webkit-box-shadow .25s;
  padding: 24px;
  margin: .5rem 0 1rem 0;
  border-radius: 2px;
  background-color: #fff;
  border: 1px solid #D8DFF0;
}
</style>
