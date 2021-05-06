<template lang="html">
  <div
    v-if="Object.prototype.hasOwnProperty.call(freightOrderDetail, 'awarded_bids')"
    class=""
  >
    <div v-if="freightOrderDetail.awarded_bids.length > 0">
      <div class="order-info-header align-documents-data">
        Awarded Transporters
      </div>
      <div
        class=""
        style="display: flex;"
      >
        <div class="">
          <el-progress
            type="circle"
            :percentage="
              getTruckPercentage(
                freightOrderDetail.available_trucks,
                freightOrderDetail.total_trucks
              )
            "
          />
        </div>
        <div class="awarded-highlight">
          {{ freightOrderDetail.available_trucks }}/{{ freightOrderDetail.total_trucks }}
          Trucks confirmed

          <span class="align-awarded-total-sum">
            Total cost: {{ freightOrderDetail.currency }}
            {{ freightOrderDetail.awarded_amount.toLocaleString() }}
          </span>
        </div>
      </div>

      <div class="transporter-listing order-order-documents">
        <div
          v-for="(data, index) in freightOrderDetail.awarded_bids"
          :key="index"
          class="doc-detail"
          :class="getItemPosition(freightOrderDetail.awarded_bids, index)"
        >
          <div
            class="transporters-filters documents-highlight
            orders-freight-documents transporters-doc-align"
            @click="toggleRow(index)"
          >
            <div class="transporter-content freight-documents-title transporters-name-highlight">
              {{ data.name }}
            </div>
            <div class="transporter-content">
              {{ getAvailableTrucks(data.trucks_available) }}
            </div>
            <div class="transporter-content transporters-name-highlight">
              {{ freightOrderDetail.currency }} {{ data.price_per_truck }}/Truck
            </div>
            <div class="transporter-content view-transporter-documents">
              View document details
              <span
                v-if="opened.includes(index)"
                class=""
              >
                <i class="el-icon-arrow-up" />
              </span>
              <span
                v-if="!opened.includes(index)"
                class=""
              >
                <i class="el-icon-arrow-down" />
              </span>
            </div>
          </div>
          <div
            v-if="opened.includes(index)"
            class="documents-divider"
          />

          <div
            v-if="opened.includes(index)"
            class="freight-documents transporters-doc-align"
          >
            <awardingDocs
              :freight-order-detail="freightOrderDetail"
              :document-detail="data.awarding_documents.documents"
            />
            <div
              v-if="opened.includes(index)"
              class="documents-divider"
            />
            <loadingDocs
              :freight-order-detail="freightOrderDetail"
              :document-detail="data.loading_documents.vehicles"
            />
            <div
              v-if="opened.includes(index)"
              class="documents-divider"
            />

            <fulfillmentDocs
              :freight-order-detail="freightOrderDetail"
              :document-detail="data.fulfillment_documents.documents"
            />
          </div>
        </div>
      </div>
    </div>
    <transition
      name="fade"
      mode="out-in"
    >
      <div class="">
        <el-dialog
          :visible.sync="viewLoadingDocument"
          class="documentOptions"
        >
          <div
            v-for="(val, index) in loadingDocs"
            v-if="index >= 0"
          >
            <div class="document-text-option freight-documents">
              {{ val.document_name }} document
            </div>
            <div class="document-divider" />
            <div class="document-view-inner loading-docs-image">
              <iframe
                :src="val.document_url"
                frameBorder="0"
                width="100%"
                height="100%"
              />
            </div>
          </div>
        </el-dialog>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import NotificationMxn from '../../../../mixins/notification_mixin';
import awardingDocs from './components/awardingDocs.vue';
import fulfillmentDocs from './components/fulfillmentDocs.vue';
import loadingDocs from './components/loadingDocs.vue';

export default {
  name: 'Documents',
  components: { awardingDocs, fulfillmentDocs, loadingDocs },
  mixins: [NotificationMxn],
  props: {
    freightOrderDetail: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      opened: [],
      viewLoadingDocument: false,
      loadingDocs: [],
    };
  },
  computed: {
    ...mapGetters({
      getLoadingDocs: '$_freight/getLoadingDocs',
      getLoadingDocumentDialog: '$_freight/getLoadingDocumentDialog',
    }),
  },
  watch: {
    viewLoadingDocument(val) {
      if (!val) {
        this.setLoadingDocumentDialog(false);
        this.loadingDocs = [];
        this.setLoadingDocs([]);
      }
    },
    getLoadingDocumentDialog(value) {
      this.loadingDocs = this.getLoadingDocs;
      this.viewLoadingDocument = value;
    },
  },
  mounted() {},
  methods: {
    ...mapActions({}),
    ...mapMutations({
      setLoadingDocumentDialog: '$_freight/setLoadingDocumentDialog',
      setLoadingDocs: '$_freight/setLoadingDocs',
    }),
    toggleRow(i) {
      if (this.opened.includes(i)) {
        const index = this.opened.indexOf(i);
        this.opened.splice(index, 1);
      } else {
        this.opened.push(i);
      }
    },
    getTruckPercentage(availableTrucks, totalTrucks) {
      const resp = (availableTrucks / totalTrucks) * 100;

      return parseInt(resp, 10);
    },
    getItemPosition(data, index) {
      let name = '';

      if (index >= 0 && index < data.length - 1) {
        name = 'no-transporter-top-margin';
      }
      return name;
    },
    getAvailableTrucks(val) {
      let resp = `${val} Trucks`;
      if (val === 1) {
        resp = `${val} Truck`;
      }
      return resp;
    },
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../../assets/styles/transporters_component.css';
@import '../../../../assets/styles/transporters_documents.css';
</style>
