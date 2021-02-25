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
              {{$t('general.pickup_location')}}
            </p>
            <p>{{ trackingData.path[0].name }}</p>
            <p
              v-if="checkEditOption()"
              class="infor-top-change-details"
              @click="showEditLocationsDialog()"
            >
              <i class="el-icon-edit-outline" />
              {{$t('general.add_change_locations')}}
            </p>
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
              {{$t('general.notes')}}: {{ val.notes }}
            </p>
          </li>
        </ul>
      </div>
    </el-col>
  </div>
</template>

<script>
import { mapMutations, mapGetters } from 'vuex';
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
    return {
      user_state: false,
    };
  },
  computed: {
    ...mapGetters({
      getSession: 'getSession',
    }),
  },
  watch: {
    getSession: {
      handler() {
        if (Object.keys(this.$store.getters.getSession).length > 0) {
          this.confirmUser();
        }
      },
      deep: true,
    },
  },
  mounted() {
    this.confirmUser();
  },
  methods: {
    ...mapMutations({
      setEditLocationDialog: '$_orders/$_tracking/setEditLocationDialog',
    }),
    confirmUser() {
      const session = this.$store.getters.getSession;
      if (
        Object.keys(session).length > 0
        && Object.prototype.hasOwnProperty.call(session, 'default')
      ) {
        const sessionUserEmail = session[session.default].user_email;
        const orderUserEmail = this.trackingData.user.email;

        if (sessionUserEmail === orderUserEmail) {
          this.user_state = true;
        } else {
          this.user_state = false;
        }
      }
    },
    showEditLocationsDialog() {
      this.setEditLocationDialog(true);
    },
    checkEditOption() {
      let show = false;
      if (
        Object.prototype.hasOwnProperty.call(this.trackingData, 'edit_config')
        && this.user_state
      ) {
        if (this.trackingData.edit_config !== null) {
          show = this.trackingData.edit_config.add_drop_off;
        }
      }
      return show;
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../../assets/styles/info_window_component.css";
</style>
