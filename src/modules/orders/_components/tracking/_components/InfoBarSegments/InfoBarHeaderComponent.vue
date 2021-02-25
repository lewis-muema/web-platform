<template lang="html">
  <div class="">
    <el-row
      :gutter="20"
      class="infobar-content infobar--truck-item  infobar--item-truck-bordered infobar-truck-pstn "
    >
      <el-col :span="6">
        <div class="info-text-transform">
          <img
            src="https://images.sendyit.com/web_platform/tracking/checkmark.svg"
            alt=""
            class="infobar-truck-img"
          >
          <span class="infor-top-bar-text">
          {{$t('general.order_number')}}:
          </span>
          <span>
            {{ trackingData.order_no }}
          </span>
        </div>
      </el-col>
      <el-col
        :span="6"
        class="status-text"
      >
        <div class="info-text-transform">
          <img
            src="https://images.sendyit.com/web_platform/tracking/status.svg"
            alt=""
            class="top-bar-img infobar-truck-img"
          >
          <span class="infor-top-bar-text"> {{$t('general.status')}} :</span>
          <span> {{ getStatus }} </span>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="info-text-transform">
          <div class="topbar-text">
            <font-awesome-icon
              icon="wallet"
              class="top-bar-info infobar-truck-img"
            />
            <span v-if="getStatus === 'Pending'">
              <span
                v-if="
                  'customer_min_amount' in trackingData.package_details && !trackingData.fixed_cost
                "
              >
                <span class="infor-top-bar-text">
                  {{$t('general.minimum_cost')}} :
                </span>
                <span>
                  {{
                    trackingData.price_tier.currency
                      ? trackingData.price_tier.currency
                      : trackingData.currency
                  }}
                  {{ trackingData.package_details.customer_min_amount }}
                </span>
              </span>
              <span v-else>
                <span class="infor-top-bar-text">
                   {{$t('general.cost')}} :
                </span>
                <span>
                  {{
                    trackingData.price_tier.currency
                      ? trackingData.price_tier.currency
                      : trackingData.currency
                  }}
                  {{ trackingData.amount }}
                </span>
              </span>
            </span>
            <span v-else>
              <span class="infor-top-bar-text">
                {{$t('general.cost')}} :
              </span>
              <span>
                {{
                  trackingData.price_tier.currency
                    ? trackingData.price_tier.currency
                    : trackingData.currency
                }}
                {{ trackingData.amount }}
              </span>
            </span>
          </div>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="info-text-transform">
          <div class="topbar-text infor-top-bar-text">
            {{$t('general.order_timeline')}}
          </div>
        </div>
      </el-col>
      <el-col
        :span="1"
        class="minimise-icon"
      >
        <div
          v-if="getTrackMoreInfo"
          class="infobar--actions-hover"
          @click="minimiseInfoDetails()"
        >
          <div class="infobar--actions-icon">
            <i class="el-icon-remove-outline" />
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import NotificationMxn from '../../../../../../mixins/notification_mixin';

export default {
  name: 'InfoBarHeaderComponent',
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
  computed: {
    ...mapGetters({
      getTrackMoreInfo: '$_orders/$_tracking/getTrackMoreInfo',
    }),
    getStatus() {
      switch (this.trackingData.delivery_status) {
        case 3: {
          return this.$t('general.delivered');
        }
        case 2: {
          return this.$t('general.in_transit');
        }
        default: {
          switch (this.trackingData.confirm_status) {
            case 1: {
              return this.$t('general.confirmed');
            }
            default: {
              return this.$t('general.pending');
            }
          }
        }
      }
    },
  },
  methods: {
    ...mapMutations({
      setTrackMoreInfo: '$_orders/$_tracking/setTrackMoreInfo',
    }),
    minimiseInfoDetails() {
      this.setTrackMoreInfo(false);
    },
  },
};
</script>

<style lang="css" scoped>
@import "../../../../../../assets/styles/info_window_component.css";
</style>
