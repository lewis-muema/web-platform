<template lang="html">
  <div class="freight-vehicles-outer">
    <div class="freight-vehicles-inner">
      <span
        class="ongoing-trucks-label"
      >TRUCKS <a>{{ `(${vehicles.length})` }}</a>
      </span>
      <div
        v-for="val in vehicles"
        :key="val.id"
        class="ongoing-trucks-card"
        :class="{ active: active_shipment(val.id) }"
        @click="trackShipment(val)"
      >
        <div class="ongoing-trucks-details-container">
          <img
            src="../../../../assets/img/freight/shipment_truck.png"
            class="truck-details-image"
          >
          <span class="truck-registration-number">{{ val.reg_no }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShipmentVehicles',
  data() {
    return {
      vehicles: [
        {
          id: 1,
          reg_no: 'KBY 453H',
        },
        {
          id: 2,
          reg_no: 'KAY 747E',
        },
        {
          id: 3,
          reg_no: 'KCY 233G',
        },
        {
          id: 4,
          reg_no: 'KCY 234G',
        },
        {
          id: 5,
          reg_no: 'KCY 235G',
        },
        {
          id: 6,
          reg_no: 'KCY 236G',
        },
        {
          id: 7,
          reg_no: 'KCY 237G',
        },
        {
          id: 8,
          reg_no: 'KCY 238G',
        },
        {
          id: 9,
          reg_no: 'KCY 240G',
        },
        {
          id: 10,
          reg_no: 'KCY 241G',
        },
      ],
      set_shipemnt_id: '',
    };
  },
  methods: {
    active_shipment(shipmentNo) {
      if (this.set_shipemnt_id === shipmentNo) {
        return true;
      }
      return false;
    },
    trackShipment(shipment) {
      this.set_shipemnt_id = shipment.id;
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../../assets/styles/freight_tracking_component.css';
</style>
