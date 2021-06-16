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
import { mapMutations } from 'vuex';

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
    ...mapMutations({
      clearTruckMarkers: '$_freight/clearTruckMarkers',
      setTruckMarkers: '$_freight/setTruckMarkers',
      setTruckId: '$_freight/setTruckId',
    }),
    active_shipment(shipmentNo) {
      if (this.set_shipemnt_id === shipmentNo) {
        return true;
      }
      return false;
    },
    trackShipment(shipment) {
      this.clearTruckMarkers();
      this.set_shipemnt_id = shipment.id;
      this.setTruckLocationToStore();
    },
    setTruckLocationToStore() {
      const partnerLocation = [
        {
          partner_city_id: 1,
          altitude: 1628.0931158127214,
          phone_no: '+254707941365',
          lng: 36.8520796,
          device_id: 0,
          county_code: 'ke',
          bearing: 0,
          rating: 4,
          partner_level: 3,
          exclusive_status: 0,
          license_status: 0,
          speed: 0.0433949,
          busy_state: true,
          sim_card_sn: '89254021054194521174',
          carrier_type: 0,
          partner_id: 4838,
          active_state: true,
          course: 0,
          currency: 'KES',
          time: '2021-06-16 09:40:45',
          rider_id: 4838,
          lat: -1.2804102,
          vendor_type: 3,
        },
      ];
      this.setTruckMarkers(partnerLocation[0]);
      this.setTruckId(partnerLocation[0].rider_id);
    },
  },
};
</script>

<style lang="css" scoped>
@import '../../../../assets/styles/freight_tracking_component.css';
</style>
