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
            <div class="transporter-content freight-documents-title">
              {{ data.name }}
            </div>
            <div class="transporter-content">
              {{ getAvailableTrucks(data.trucks_available) }}
            </div>
            <div class="transporter-content">
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
            class="documents-highlight orders-freight-documents transporters-doc-align"
          >
            <div class="transporters-documents">
              Documents
            </div>
            <div v-if="data.documents.length > 0">
              <div
                v-for="(val, index) in data.documents"
                v-if="index >= 0"
                class="freight-documents--inner"
              >
                <div class="transporter-content">
                  {{ val.document_name }}
                </div>
                <div class="transporter-content">
                  {{ val.date_created }}
                </div>
                <div
                  class="transporter-content view-transporter-documents"
                  @click="viewDocument(val.document_url, val.document_name)"
                >
                  View Document <i class="el-icon-arrow-right view-transporter-info" />
                </div>
                <div
                  class="freight-documents-approve flex-div transporter-content approve-freight-section"
                >
                  <div
                    v-if="
                      checkActionableBtnState &&
                        val.created_by === 'OWNER' &&
                        val.document_status === 0
                    "
                    class="align-approval-btn"
                  >
                    <button
                      type="button"
                      class="button-primary approve-documents-action freight-approve-doc"
                      name="create_order_text"
                      @click="approveDoc(val)"
                    >
                      {{ approve_doc_text }}
                    </button>
                    <button
                      type="button"
                      class="approve-documents-action freight-decline-doc"
                      name="create_order_text"
                      @click="declineDialog(val)"
                    >
                      {{ decline_doc_text }}
                    </button>
                  </div>
                  <div
                    v-if="
                      checkActionableBtnState &&
                        val.created_by === 'OWNER' &&
                        val.document_status === -1
                    "
                    class="decline-document-reason"
                  >
                    Decline reason : {{ val.message }}
                  </div>
                  <div
                    v-if="
                      checkActionableBtnState &&
                        val.created_by === 'OWNER' &&
                        val.document_status === 1
                    "
                    class="approved-document-reason"
                  >
                    Document has been approved
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="no-document-content">
                  No document available
                </div>
              </div>
            </div>
            <div v-else>
              No document available
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import NotificationMxn from '../../../../mixins/notification_mixin';

export default {
  name: 'Documents',
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
    };
  },
  mounted() {},
  methods: {
    ...mapActions({
      approveDocument: '$_freight/approveDocument',
    }),
    ...mapMutations({
      setDocumentUrl: '$_freight/setDocumentUrl',
      setDocumentName: '$_freight/setDocumentName',
      setDocumentDialog: '$_freight/setDocumentDialog',
      setOrderDetail: '$_freight/setOrderDetail',
      setDeclineDocument: '$_freight/setDeclineDocument',
      setDocumentDialogDocument: '$_freight/setDocumentDialogDocument',
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
    checkActionableBtnState() {
      const session = this.$store.getters.getSession;
      let resp = false;
      if (session.default === 'biz') {
        if (session[session.default].freight_approver === 1) {
          resp = true;
        }
      }
      return resp;
    },
    viewDocument(url, name) {
      this.setDocumentUrl(url);
      this.setDocumentName(name);
      this.setDocumentDialog(true);
      if (this.isValidHttpUrl(url)) {
        this.setDocumentUrl(url);
      } else {
        this.setDocumentUrl('');
      }
    },
    isValidHttpUrl(string) {
      let url;

      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }

      return url.protocol === 'http:' || url.protocol === 'https:';
    },
    declineDialog(val) {
      this.setDeclineDocument(val);
      this.setDocumentDialogDocument(true);
    },
    approveDoc(val) {
      let acc = {};
      const session = this.$store.getters.getSession;
      if ('default' in session) {
        acc = session[session.default];
      }

      const payload = {
        document_id: val.document_id,
        status: 2,
      };

      if (session.default === 'biz') {
        payload.cop_id = acc.cop_id;
        payload.cop_user_id = acc.user_id;
      } else {
        payload.peer_id = acc.user_id;
      }

      const fullPayload = {
        values: payload,
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: 'shipments/quotations/documents/approve',
      };

      this.approveDocument(fullPayload).then(
        (response) => {
          let workingResponse = response;
          if (response.length > 1) {
            workingResponse = response[0];
          }

          if (workingResponse.status) {
            this.doNotification(1, 'Document approval!', 'Document approved successfully');
            this.setOrderDetail(this.$route.params.id);
          } else if (Object.prototype.hasOwnProperty.call(workingResponse, 'message')) {
            this.doNotification(2, 'Failed to approve document!', workingResponse.message);
          } else {
            this.doNotification(2, 'Failed to approve document!', workingResponse.reason);
          }
        },
        (error) => {
          if (Object.prototype.hasOwnProperty.call(error.response.data, 'reason')) {
            this.doNotification(2, 'Failed to approve document!', error.response.data.reason);
          } else {
            this.doNotification(
              2,
              'Failed to approve document!',
              'Failed to approve document, Kindly retry again or contact customer support ',
            );
          }
        },
      );
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
