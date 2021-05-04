<template lang="html">
  <div class="">
    <div
      class="transporter-listing order-order-documents"
      @click="toggleRow(2)"
    >
      <div class="freight-documents-flex">
        <div class="documents-type-label">
          Fulfillment Document
        </div>
        <div class="view-transporter-documents documents-type-inner">
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
      <div class="freight-documents--inner">
        <div class="transporter-content documents-sub-highlight">
          Documents will be displayed here
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapMutations, mapActions } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'FulfillmentDocs',
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
    ...mapActions({}),
    ...mapMutations({}),
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
