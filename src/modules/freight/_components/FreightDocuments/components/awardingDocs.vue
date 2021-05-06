<template lang="html">
  <div class="">
    <div
      class="transporter-listing order-order-documents"
      @click="toggleRow(1)"
    >
      <div class="freight-documents-flex">
        <div class="documents-type-label">
          Awarding Documents
        </div>
        <span
          v-if="doc_count > 0"
          class="notification-counter-highlight"
        >
          <i class="el-icon-warning" /> {{ doc_count }} docs not actioned
        </span>
        <div class="view-transporter-sub-documents">
          <span
            v-if="opened.includes(1)"
            class=""
          >
            <i class="el-icon-minus" />
          </span>
          <span
            v-if="!opened.includes(1)"
            class=""
          >
            <i class="el-icon-plus" />
          </span>
        </div>
      </div>
      <div
        v-if="opened.includes(1)"
        class="documents-divider"
      />
    </div>
    <div
      v-if="opened.includes(1)"
      class="awarding-docs-subsection"
    >
      <div v-if="documentDetail.length > 0">
        <div
          v-for="(val, index) in documentDetail"
          v-if="index >= 0"
          class="freight-documents--inner"
        >
          <div class="transporter-content documents-sub-highlight">
            {{ val.document_name }}
          </div>
          <div class="transporter-content documents-sub-highlight">
            {{ val.date_created }}
          </div>
          <div
            class="transporter-content view-transporter-documents documents-sub-highlight"
            @click="viewDocument(val.document_url, val.document_name)"
          >
            View Document <i class="el-icon-arrow-right view-transporter-info" />
          </div>
          <div
            class="freight-documents-approve flex-div transporter-content approve-freight-section documents-sub-highlight"
          >
            <div
              v-if="
                checkActionableBtnState && val.created_by === 'OWNER' && val.document_status === 0
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
                checkActionableBtnState && val.created_by === 'OWNER' && val.document_status === -1
              "
              class="decline-document-reason"
            >
              Decline reason : {{ val.message }}
            </div>
            <div
              v-if="
                checkActionableBtnState && val.created_by === 'OWNER' && val.document_status === 1
              "
              class="approved-document-reason"
            >
              Document has been approved
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
  name: 'AwardingDocs',
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
      approve_doc_text: 'Approve',
      decline_doc_text: 'Decline',
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
      approveDocument: '$_freight/approveDocument',
      getDocumentOptions: '$_freight/getDocumentOptions',
    }),
    ...mapMutations({
      setDocumentUrl: '$_freight/setDocumentUrl',
      setDocumentName: '$_freight/setDocumentName',
      setDocumentDialog: '$_freight/setDocumentDialog',
      setOrderDetail: '$_freight/setOrderDetail',
      setDeclineDocument: '$_freight/setDeclineDocument',
      setDocumentDialogDocument: '$_freight/setDocumentDialogDocument',
      setAwardingDocumentOptions: '$_freight/setAwardingDocumentOptions',
    }),
    checkDocumentActionableCount() {
      this.doc_count = 0;
      if (this.documentDetail.length > 0) {
        const store = [];
        const details = this.documentDetail;
        const filtered = details.find(set => set.actionable === true);
        if (filtered !== undefined && filtered !== 'undefined') {
          if (filtered.created_by === 'OWNER') {
            store.push(filtered);
          }
        }
        if (store.length > 0) {
          this.updateStoreCount(store);
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
    fetchDocumentOptions() {
      const type = this.freightOrderDetail.cargo_type;
      const fullPayload = {
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: 'document_types?stage=1',
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
              this.setAwardingDocumentOptions(filteredDocs);
            } else {
              this.setAwardingDocumentOptions({});
            }
          } else {
            this.doNotification(
              2,
              'Failed to retrieve awarding documents options',
              response.message,
            );
            this.$router.push('/freight/orders');
            this.setAwardingDocumentOptions({});
          }
        },
        (error) => {
          this.doNotification(
            2,
            'Awarding document options retrival failure !',
            'Failed to fetch document options , Kindly retry again or contact customer support ',
          );
          this.$router.push('/freight/orders');
          this.setAwardingDocumentOptions({});
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
    declineDialog(val) {
      this.setDeclineDocument(val);
      this.setDocumentDialogDocument(true);
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
