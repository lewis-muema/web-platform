<template lang="html">
  <div class="freight-vehicles-outer">
    <div class="freight-vehicles-inner">
      <span
        class="ongoing-trucks-label"
      >TRUCKS <a>{{ `(${vehicles.length})` }}</a>
      </span>
      <div
        v-for="val in vehicles"
        :key="val.vehicle_id"
        class="ongoing-trucks-card"
        :class="{ active: active_shipment(val.vehicle_id) }"
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
import { mapMutations, mapGetters } from 'vuex';

export default {
  name: 'ShipmentVehicles',
  data() {
    return {
      vehicles: [],
      set_truck_id: '',
    };
  },
  computed: {
    ...mapGetters({
      getAllocatedTrucks: '$_freight/getAllocatedTrucks',
    }),
  },
  watch: {
    getAllocatedTrucks(val) {
      this.vehicles = val;
    },
  },
  mounted() {
    this.vehicles = this.getAllocatedTrucks;
  },
  methods: {
    ...mapMutations({
      clearTruckMarkers: '$_freight/clearTruckMarkers',
      setTruckMarkers: '$_freight/setTruckMarkers',
      setTruckId: '$_freight/setTruckId',
      setTruckDetailsToStore: '$_freight/setTruckDetailsToStore',
    }),
    active_shipment(truckId) {
      if (this.set_truck_id === truckId) {
        return true;
      }
      return false;
    },
    trackShipment(shipment) {
      this.clearTruckMarkers();
      this.set_truck_id = shipment.vehicle_id;
      this.setTruckLastLocationToStore(shipment);
    },
    setTruckLastLocationToStore(shipment) {
      this.clearTruckMarkers();
      this.setTruckDetailsToStore(shipment);
      const partnerLocation = {
        lat: shipment.lat,
        lng: shipment.long,
        vendor_type: 25,
        vehicle_id: shipment.vehicle_id,
        rotation: 0,
        time: shipment.last_updated,
        speed: 0,
      };
      this.setTruckId(shipment.vehicle_id);
      this.setTruckMarkers(partnerLocation);
      // this.initiateMQTT(shipment);
    },
    // initiateMQTT(val){
    //
    // },
  },
};
</script>

<style lang="css" scoped>
@import '../../../../assets/styles/freight_tracking_component.css';
</style>
