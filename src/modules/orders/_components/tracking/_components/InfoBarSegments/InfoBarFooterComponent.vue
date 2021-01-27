<template lang="html">
  <div class="">
    <div class="rider-info infobar--item-truck-bordered-top">
      <el-row
        :gutter="20"
        class="infobar-content infobar--truck-item   infobar--item-truck-options"
      >
        <el-col :span="8">
          <div class="">
            <img
              class="rimg rimg-disp"
              :src="trackingData.rider.rider_photo"
            >
            <span> {{ trackingData.rider.rider_name }} {{ trackingData.rider.rider_phone }} </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="share-option">
            <span>
              {{ trackingData.rider.vehicle_name }} {{ trackingData.rider.number_plate }}
            </span>
          </div>
        </el-col>
        <el-col :span="6">
          <div
            class="share-option"
            @click="sharedialog()"
          >
            <i class="el-icon-share top-bar-info" />
            {{$t('general.share')}}
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import NotificationMxn from '../../../../../../mixins/notification_mixin';

export default {
  name: 'InfoBarFooterComponent',
  mixins: [NotificationMxn],
  props: {
    trackingData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations({
      setShareOption: '$_orders/$_tracking/setShareOption',
    }),
    sharedialog() {
      this.setShareOption(true);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../../assets/styles/info_window_component.css";
</style>
