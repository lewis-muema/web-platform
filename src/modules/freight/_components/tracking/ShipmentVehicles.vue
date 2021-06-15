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
          reg_no: 'KCY 233G',
        },
      ],
    };
  },
};
</script>

<style lang="css" scoped>
@import '../../../../assets/styles/freight_tracking_component.css';
</style>
