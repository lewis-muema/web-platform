/* eslint no-param-reassign: "error" */
/* eslint no-restricted-syntax: ["error","WithStatement"] */
import Vue from 'vue';

const setPage = (state, payload) => {
  state.page = payload;
};

const toggleOngoing = (state) => {
  if (state.ongoing_show === 0) {
    state.ongoing_show = 1;
  } else {
    state.ongoing_show = 0;
  }
};

const setOngoingOrders = (state, payload) => {
  state.ongoing_orders = payload;
};

const setMarkers = (state, payload) => {
  payload.forEach((value, i) => {
    let icon = value.waypoint_type ? value.waypoint_type.toLowerCase() : 'destination';
    if (i === 0) {
      icon = 'pickup';
    }
    const marker = {
      position: {
        lat: Number(value.coordinates.split(',')[0]),
        lng: Number(value.coordinates.split(',')[1]),
      },
      icon,
    };
    state.map.markers.push(marker);
  });
};

const setPolyline = (state, payload) => {
  state.map.polyline.path = payload;
};

const setVendorMarkers = (state, payload) => {
  /*
  TO DO re-enable when we start busing live locations on the home page

  if('busy' in payload){
    if(payload.busy == true){
      return false;
    }
  }
  */
  let visible = false;
  if ('page' in state) {
    // order placement
    if (state.page === 0) {
      visible = true;
    } else if ('overide_visible' in payload) {
      // tracking
      visible = true;
    }
  }
  const id = payload.rider_id;
  const value = {
    position: {
      lat: payload.lat,
      lng: payload.lng,
    },
    vendor_type: payload.vendor_type,
    rotation: payload.bearing,
    time: payload.time,
    speed: payload.speed,
    visible,
  };

  Vue.set(state.map.vendors, id, value);
};

const hideVendors = (state) => {
  for (const key in state.map.vendors) {
    if (Object.prototype.hasOwnProperty.call(!state.map.vendors, key)) {
      const obj = state.map.vendors[key];

      obj.visible = false;
    }
  }
};

const removeMarkers = (state) => {
  state.map.markers = [];
};

const removePolyline = (state) => {
  state.map.polyline.path = '';
};

const setLocationMarker = (state, payload) => {
  state.map.markers.splice(payload.index, 0, payload.marker);
};
const unsetLocationMarker = (state, index) => {
  state.map.markers.splice(index, 1);
};
// const unsetMap = (state) => {
//   state.map.markers.splice(0);
//   state.map.vendors.splice(0);
//   state.map.polyline.path = '';
// };
const setHomeLocations = (state, payload) => {
  state.home_locations = payload;
};
const clearHomeLocation = (state) => {
  state.home_locations = [];
};
const setStorePath = (state, val) => {
  state.location_path.splice(val.index, val.index === 0 ? 0 : 1, val.path);
};
const clearStorePath = (state) => {
  state.location_path = [];
};
const unsetStorePath = (state, index) => {
  state.location_path.splice(index, 1);
};
const setWaypointNotes = (state, val) => {
  state.location_path[val.index].notes = val.notes;
};
const setOuterPriceRequestObject = (state, payload) => {
  state.outer_price_request = payload;
};
const setActiveVendorTally = (state, payload) => {
  state.active_vendor_tally = payload;
};
const setExpandedActiveVendorTally = (state, payload) => {
  state.expanded_active_vendor_tally = payload;
};
const setPairedDriversTally = (state, payload) => {
  state.paired_drivers_tally = payload;
};
const clearOuterPriceRequestObject = (state) => {
  state.outer_price_request = {};
};
const setOuterActiveVendorDetails = (state, payload) => {
  state.outer_active_vendor_data = payload;
};
const clearOuterActiveVendorDetails = (state) => {
  state.outer_active_vendor_data = {};
};
const setOuterActivePackageClass = (state, payload) => {
  state.outer_active_package_data = payload;
};
const clearVendorMarkers = (state) => {
  state.map.vendors = {};
};
const setParentOrder = (state, payload) => {
  state.parent_order = payload;
};
const setSuggestions = (state, payload) => {
  state.suggestions = payload;
};
export default {
  setPage,
  toggleOngoing,
  setOngoingOrders,
  setMarkers,
  setPolyline,
  setVendorMarkers,
  hideVendors,
  removeMarkers,
  removePolyline,
  setLocationMarker,
  unsetLocationMarker,
  setHomeLocations,
  setStorePath,
  setOuterPriceRequestObject,
  setActiveVendorTally,
  setExpandedActiveVendorTally,
  setOuterActiveVendorDetails,
  setOuterActivePackageClass,
  clearHomeLocation,
  clearStorePath,
  clearOuterPriceRequestObject,
  clearOuterActiveVendorDetails,
  unsetStorePath,
  setWaypointNotes,
  clearVendorMarkers,
  setParentOrder,
  setSuggestions,
  setPairedDriversTally,
};
