<template lang="html">
  <div class="form-panel-outer">
    <screen-one-component v-if="this.getViewState == 1 "></screen-one-component>
    <screen-two-component v-if="this.getViewState == 2 "></screen-two-component>
    <screen-three-component v-if="this.getViewState == 3 "></screen-three-component>
    <complete-component v-if="this.getViewState == 4 "></complete-component>
  </div>
</template>

<script>
import {mapGetters,mapMutations} from 'vuex'
import ScreenOneComponent from './ScreenOneComponent.vue'
import ScreenTwoComponent from './ScreenTwoComponent.vue'
import ScreenThreeComponent from './ScreenThreeComponent.vue'
import CompleteComponent from './CompleteComponent.vue'

export default {
  name: 'form-panel-component',
  components: {ScreenOneComponent,ScreenTwoComponent,ScreenThreeComponent,CompleteComponent},
  computed: {
    ...mapGetters(
      {
        getViewState:'$_external/getViewState',
      }
    )
  },
  methods: {
    ...mapMutations(
      {
        setViewState:'$_external/setViewState',
      }
    )

  }
}
</script>

<style lang="css">
.onboarding-user-header
{
  font-size: 28px;
  color: #333;
  line-height: 36px;
  font-weight: 700;
}

.form-inputs
{
  padding: 24px 0 6px;
  padding-right: 15%;
  padding-bottom: 40px;
  padding-top: 0px;
}

.divide
{
  width: 65%;
  border-top: 1px solid hsla(0,0%,73%,0);
  box-shadow: 0 -1px 0 rgba(0,0,0,.08);
  padding: 12px;
}

.form-submits
{
  display: flex;
  justify-content: space-between;
  width: 60%;
}
</style>
