<template lang="html">
  <div class="">
    <div
      class="transporter-listing order-order-documents"
      @click="toggleRow(2)"
    >
      <div class="freight-documents-flex">
        <div class="documents-type-label">
          Assigned Vehicles & Loading Documents
        </div>
        <span
          v-if="doc_count > 0"
          class="notification-counter-highlight"
        >
          <i class="el-icon-warning" /> {{ doc_count }} docs not actioned
        </span>
        <div class="view-transporter-sub-documents documents-type-inner">
          <span
            v-if="opened.includes(2)"
            class=""
          >
            <i class="el-icon-minus" />
          </span>
          <span
            v-if="!opened.includes(2)"
            class=""
          >
            <i class="el-icon-plus" />
          </span>
        </div>
      </div>
      <div
        v-if="opened.includes(2)"
        class="documents-divider"
      />
    </div>
    <div
      v-if="opened.includes(2)"
      class="awarding-docs-subsection"
    >
      <div v-if="documentDetail.length > 0">
        <div
          v-for="(val, index) in documentDetail"
          v-if="index >= 0"
          class="freight-loading-documents--inner"
        >
          <div class="transporter-content documents-sub-highlight">
            <div class="documents-sub-highlight-label">
              Vehicle Reg
            </div>
            <div class="documents-sub-highlight-inner">
              {{ val.vehicle_registration !== null ? val.vehicle_registration : 'N/A' }}
            </div>
          </div>
          <div class="transporter-content documents-sub-highlight">
            <div class="documents-sub-highlight-label">
              Trailer Number
            </div>
            <div class="documents-sub-highlight-inner">
              {{ val.trailer_no !== null ? val.trailer_no : 'N/A' }}
            </div>
          </div>
          <div class="transporter-content documents-sub-highlight">
            <div class="documents-sub-highlight-label">
              Driver Name
            </div>
            <div class="documents-sub-highlight-inner">
              {{ val.driver_name !== null ? val.driver_name : 'N/A' }}
            </div>
          </div>
          <div class="transporter-content documents-sub-highlight">
            <div class="documents-sub-highlight-label">
              Driver Phone No.
            </div>
            <div class="documents-sub-highlight-inner">
              {{ val.driver_phone !== null ? val.driver_phone : 'N/A' }}
            </div>
          </div>
          <div class="transporter-content documents-sub-highlight">
            <div class="documents-sub-highlight-label">
              Driver ID
            </div>
            <div class="documents-sub-highlight-inner">
              {{ val.driver_id_no !== null ? val.driver_id_no : 'N/A' }}
            </div>
          </div>
          <div
            v-if="val.documents.length > 0"
            class="transporter-content documents-sub-highlight"
          >
            <div
              class="view-loading-docs"
              :class="getReuploadClass(val.documents)"
              @click="viewLoadingDocs(val.documents)"
            >
              View Document
            </div>
            <div
              v-if="checkValidReupload(val.documents)"
              class="re-upload-loading-docs"
              @click="reUploadloadingDoc(val.documents)"
            >
              Re-upload doc
            </div>
          </div>
          <div
            v-if="val.documents.length === 0 && checkActionableBtnState"
            class="freight-documents-approve transporter-content
            approve-freight-section documents-sub-highlight"
          >
            <div class="align-approval-btn upload-loading-doc-btn">
              <button
                type="button"
                class="button-primary approve-documents-action upload-loading-doc"
                name="create_order_text"
                @click="uploadLoadingDocs(freightOrderDetail, val)"
              >
                {{ upload_doc_text }}
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="transporter-content documents-sub-highlight">
            No document available
          </div>
        </div>
      </div>
      <div v-else>
        <div class="freight-documents--inner">
          <div class="transporter-content documents-sub-highlight">
            No document available
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'LoadingDocs',
  mixins: [NotificationMxn],
  props: {
    freightOrderDetail: {
      type: Object,
      required: true,
    },
    documentDetail: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      opened: [],
      upload_doc_text: 'Upload loading doc',
      state: true,
      doc_count: 0,
    };
  },
  watch: {
    documentDetail() {
      this.checkDocumentActionableCount();
    },
  },
  mounted() {
    this.fetchDocumentOptions();
    this.checkDocumentActionableCount();
  },
  methods: {
    ...mapActions({
      getDocumentOptions: '$_freight/getDocumentOptions',
    }),
    ...mapMutations({
      setLoadingDocumentOptions: '$_freight/setLoadingDocumentOptions',
      setLoadingDocs: '$_freight/setLoadingDocs',
      setLoadingDocumentDialog: '$_freight/setLoadingDocumentDialog',
      setShipmentDetail: '$_freight/setShipmentDetail',
      setUploadLoadingDocs: '$_freight/setUploadLoadingDocs',
      setVehicleId: '$_freight/setVehicleId',
      setReuploadDialog: '$_freight/setReuploadDialog',
      setReUploadData: '$_freight/setReUploadData',
    }),
    checkDocumentActionableCount() {
      this.doc_count = 0;
      if (this.documentDetail.length > 0) {
        const store = [];
        const details = this.documentDetail;
        for (let i = 0; i < details.length; i++) {
          if (details[i].documents.length > 0) {
            const filtered = details[i].documents.find(set => set.actionable === true);
            if (filtered !== undefined && filtered !== 'undefined') {
              if (filtered.created_by === 'OWNER') {
                store.push(filtered);
              }
            }
            if (store.length > 0) {
              this.updateStoreCount(store);
            }
          }
        }
      } else {
        this.doc_count = 0;
      }
    },
    updateStoreCount(store) {
      if (this.checkActionableBtnState) {
        this.doc_count = store.length;
      }
    },
    isDocumentActionable(val) {
      let resp = false;

      if (val.length > 0) {
        const filtered = val.find(set => set.actionable === true);
        if (filtered !== undefined && filtered !== 'undefined') {
          resp = filtered;
        }
      }

      return resp;
    },
    viewLoadingDocs(val) {
      this.setLoadingDocs(val);
      this.setLoadingDocumentDialog(true);
    },
    reUploadloadingDoc(val) {
      if (val.length > 0) {
        const store = [];
        const filtered = val.find(set => set.document_status === -1);
        if (filtered !== undefined && filtered !== 'undefined') {
          store.push(filtered);
        }
        this.setReuploadDialog(true);
        this.setReUploadData(store);
      }
    },
    uploadLoadingDocs(details, val) {
      this.setShipmentDetail(details);
      this.setVehicleId(val.vehicle_id);
      this.setUploadLoadingDocs(true);
    },
    fetchDocumentOptions() {
      const type = this.freightOrderDetail.cargo_type;
      const fullPayload = {
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: 'document_types/stages/2',
      };

      this.getDocumentOptions(fullPayload).then(
        (response) => {
          if (response.status) {
            const responseData = response.data;
            const filteredDocs = [];
            if (responseData.length > 0) {
              for (let i = 0; i < responseData.length; i++) {
                const filtered = responseData[i].cargo_types.find(
                  location => location.cargo_type === type,
                );
                if (filtered !== undefined && filtered !== 'undefined') {
                  filteredDocs.push(responseData[i]);
                }
              }
              this.setLoadingDocumentOptions(filteredDocs);
            } else {
              this.setLoadingDocumentOptions({});
            }
          } else {
            this.doNotification(
              2,
              'Failed to retrieve loading documents options',
              response.message,
            );
            this.$router.push('/freight/orders');
            this.setLoadingDocumentOptions({});
          }
        },
        (error) => {
          this.doNotification(
            2,
            'Loading document options retrival failure !',
            'Failed to fetch document options , Kindly retry again or contact customer support ',
          );
          this.$router.push('/freight/orders');
          this.setLoadingDocumentOptions({});
        },
      );
    },
    toggleRow(i) {
      if (this.opened.includes(i)) {
        const index = this.opened.indexOf(i);
        this.opened.splice(index, 1);
      } else {
        this.opened.push(i);
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
    checkValidReupload(val) {
      let resp = false;
      if (val.length > 0) {
        const filtered = val.find(set => set.document_status === -1);
        if (filtered !== undefined && filtered !== 'undefined') {
          resp = filtered;
        }
      }
      return resp;
    },
    getReuploadClass(val) {
      let resp = '';
      if (val.length > 0) {
        const filtered = val.find(set => set.document_status === -1);
        if (filtered === undefined || filtered === 'undefined') {
          resp = ['reupload-unavailable'];
        }
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
    doNotification(level, title, message) {
      const notification = { title, level, message };
      this.displayNotification(notification);
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../../../assets/styles/transporters_component.css';
@import '../../../../../assets/styles/transporters_documents.css';
</style>
