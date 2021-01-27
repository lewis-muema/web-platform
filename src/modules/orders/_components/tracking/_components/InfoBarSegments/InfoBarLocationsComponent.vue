<template lang="html">
  <div class="">
    <el-col
      :span="4"
      class="inforbar_left_scrollable"
    >
      <div class="locations--item-scrollable">
        <ul class="timeline inforbar_route_timeline">
          <li>
            <p class="info-text-transform infor-top-bar-text">
              Pickup Location
            </p>
            <p>{{ trackingData.path[0].name }}</p>
          </li>

          <li
            v-for="(val, index) in trackingData.path"
            v-if="index > 0"
            :class="
              Object.prototype.hasOwnProperty.call(val, 'notes') && val.notes
                ? 'infor-top-bar-notes-section'
                : ''
            "
          >
            <p class="info-text-transform infor-top-bar-text">
              {{
                trackingData.path[index].waypoint_type
                  ? trackingData.path[index].waypoint_type
                  : `Destination`
              }}
            </p>
            <p>
              {{ val.name }}
            </p>
            <p
              v-if="Object.prototype.hasOwnProperty.call(val, 'notes') && val.notes"
              class="infor-top-bar-text-notes"
            >
              Notes: {{ val.notes }}
            </p>
          </li>
        </ul>
      </div>
    </el-col>
  </div>
</template>

<script>
import NotificationMxn from '../../../../../../mixins/notification_mixin';

export default {
  name: 'InfoBarLocationsComponent',
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
  computed: {},
  methods: {},
};
</script>

<style lang="css" scoped>
@import "../../../../../../assets/styles/info_window_component.css";
</style>
