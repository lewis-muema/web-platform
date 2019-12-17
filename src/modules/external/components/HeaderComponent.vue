<template lang="html">
  <div class="user-invite-header">
    <external-header />
    <div class="progress">
      <div
        class="determinate"
        :style="progress_width"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ExternalHeader from '../../../components/headers/ExternalHeader.vue';

export default {
  name: 'HeaderComponent',
  components: { ExternalHeader },
  data() {
    return {
      styleObject: {
        width: this.progress_width,
      },
    };
  },
  computed: {
    ...mapGetters({
      getViewState: '$_external/getViewState',
    }),
    progress_width() {
      const real = `${(this.getViewState / 4) * 100}%`;
      return { width: real };
    },
  },
};
</script>

<style lang="css">
.header-logo {
  max-height: 50px;
}
.determinate {
  background-color: orange !important;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
}
.head {
  margin-bottom: 0px !important;
}
.progress {
  position: relative;
  height: 4px;
  display: block;
  width: 100%;
  background-color: #fff !important;
  border-radius: 2px;
  margin: 0 0 1rem 0;
  overflow: hidden;
}
</style>
