<template>
  <transition name="fade">
    <div class="homeview--childinfo-card" v-if="showing">
      <div class="homeview--childinfo-card-left">
        <div class="">
          <p class="homeview--childinfo-order-status">Order Status: In-transit</p>
        </div>
        <div class="">
          <table class="full-width">
            <tr>
              <td>
                <p class="homeview--childinfo-order-details">Order details</p>
              </td>
            </tr>
            <tr>
              <td valign="top" height="45">
                <p class="no-margin">Pick Up</p>
                <p class="no-margin homeview--field">ICD Nairobi</p>
              </td>
              <td valign="top" height="45">
                <p class="no-margin">Order type</p>
                <p class="no-margin homeview--field">Container order, <br>{{ truck_size }}ft Container, 22T</p>
              </td>
            </tr>
            <tr>
              <td valign="top" height="45">
                <p class="no-margin">Drop-off</p>
                <p class="no-margin homeview--field">Industrial Area</p>
              </td>
              <td valign="top" height="45">
                <p class="no-margin">Container number</p>
                <p class="no-margin homeview--field">{{ container_no }}</p>
              </td>
            </tr>
            <tr>
              <td valign="top" height="45">
                <p class="no-margin">Empty Container Destination</p>
                <p class="no-margin homeview--field">{{ container_destination }}</p>
              </td>
              <td valign="top" height="45">
                <p class="no-margin">Consignee</p>
                <p class="no-margin homeview--field">Alicia Bakers</p>
              </td>
            </tr>
          </table>
        </div>
        <div class="">
          <table class="full-width">
            <tr>
              <td>
                <img src="https://s3-eu-west-1.amazonaws.com/images.sendyit.com/web_platform/tracking/contact.png" class="homeview--childinfo-contact">
              </td>
              <td>
                <p class="no-margin">Trevor Noah</p>
                <p class="no-margin">0701234567</p>
              </td>
              <td>
                <p class="no-margin">NG 676Y</p>
                <p class="no-margin">Mercedes</p>
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="homeview--childinfo-card-right">
        <div class=""/>
        <div class="">
          <p class="homeview--childinfo-order-details">
            Order Timeline
          </p>
        </div>
        <div :key="action.actionText" class="homeview--childinfo-order-actions" v-for="action in actions">
          <i :class="action.actionClass" class="el-icon-success" />
          <p class="no-margin" :class="action.actionTextClass">{{ action.actionText }}</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      showing: false,
      actionCount: 0,
      actions: [
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'Your rider is on the way',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'Your truck has Gated-In',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'Your truck has Gate-Out',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'Your cargo is on the way to Industrial Area',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'Your cargo has been delivered and offloaded',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'The empty container is in-transit to Thika Depot ',
          actionTextClass: 'homeview--field-inactive',
        },
        {
          actionClass: 'homeview--icon-pending',
          actionText: 'The empty container has been delivered',
          actionTextClass: 'homeview--field-inactive',
        },
      ],
      container_no: '',
      truck_size: '',
      container_destination: '',
    };
  },
  created() {
    this.rootListener();
  },
  methods: {
    demo() {
      if (this.actionCount < this.actions.length) {
        if (this.actionCount > 0) {
          this.actions[this.actionCount - 1].actionClass = 'homeview--icon-success';
        }
        this.actions[this.actionCount].actionClass = 'homeview--icon-ongoing';
        this.actionCount++;
      } else {
        this.actions[this.actionCount - 1].actionClass = 'homeview--icon-success';
      }
    },
    rootListener() {
      this.$root.$on('FBU track bar', (arg1) => {
        this.container_no = arg1.container_no;
        this.truck_size = arg1.truck_size;
        this.container_destination = arg1.container_destination;
        this.showCard();
        this.actions.forEach((row, index) => {
          row.actionClass = 'homeview--icon-pending';
        });
        this.actionCount = 0;
        if (arg1.delivery_status > 0) {
          for (let i = 0; i < arg1.delivery_status; i++) {
            this.demo();
          }
        }
      });
    },
    showCard() {
      if (this.showing === true) {
        this.showing = false;
        setTimeout(() => {
          this.showing = true;
        }, 100);
      } else {
        this.showing = true;
      }
    },
  },
};

</script>

<style>

</style>