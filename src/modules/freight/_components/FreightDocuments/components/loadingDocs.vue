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
        <span class="notification-counter-highlight">
          <i class="el-icon-warning" /> 2 docs not actioned
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
              KBC 123
            </div>
          </div>
          <div class="transporter-content documents-sub-highlight">
            <div class="documents-sub-highlight-label">
              Trailer Number
            </div>
            <div class="documents-sub-highlight-inner">
              ZC2682
            </div>
          </div>
          <div class="transporter-content documents-sub-highlight">
            <div class="documents-sub-highlight-label">
              Driver Name
            </div>
            <div class="documents-sub-highlight-inner">
              Peter Parker
            </div>
          </div>
          <div class="transporter-content documents-sub-highlight">
            <div class="documents-sub-highlight-label">
              Driver Phone No.
            </div>
            <div class="documents-sub-highlight-inner">
              +254 701 123456
            </div>
          </div>
          <div class="transporter-content documents-sub-highlight">
            <div class="documents-sub-highlight-label">
              Driver ID
            </div>
            <div class="documents-sub-highlight-inner">
              1234567
            </div>
          </div>
          <div
            v-if="!state"
            class="transporter-content documents-sub-highlight"
          >
            <div class="view-loading-docs">
              View Document
            </div>
            <div class="re-upload-loading-docs">
              Re-upload doc
            </div>
          </div>
          <div
            v-else
            class="freight-documents-approve transporter-content
            approve-freight-section documents-sub-highlight"
          >
            <div class="align-approval-btn upload-loading-doc-btn">
              <button
                type="button"
                class="button-primary approve-documents-action upload-loading-doc"
                name="create_order_text"
              >
                {{ approve_doc_text }}
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
      approve_doc_text: 'Upload loading doc',
      state: true,
    };
  },
  mounted() {
    this.fetchDocumentOptions();
  },
  methods: {
    ...mapActions({
      getDocumentOptions: '$_freight/getDocumentOptions',
    }),
    ...mapMutations({
      setLoadingDocumentOptions: '$_freight/setLoadingDocumentOptions',
    }),
    fetchDocumentOptions() {
      const fullPayload = {
        app: 'FREIGHT_APP',
        operator: '?',
        endpoint: 'document_types?stage=2',
      };

      this.getDocumentOptions(fullPayload).then(
        (response) => {
          if (response.status) {
            this.setLoadingDocumentOptions(response.data);
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
