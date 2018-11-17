import Vue from 'vue'

const set_page = (state, payload) => {
  state.page = payload;
};

const toggle_ongoing = (state) => {
  if (state.ongoing_show == 0) {
    state.ongoing_show = 1;
  }
  else {
    state.ongoing_show = 0;
  }

};

const set_ongoing_orders = (state, payload) => {
  state.ongoing_orders = payload;
};

const set_markers = (state, payload) => {
  state.map.markers.push(payload);
};

const set_polyline = (state, payload) => {
  state.map.polyline.path = payload;
};

const set_vendor_markers = (state, payload) => {

  if('busy' in payload){
    if(payload.busy == true){
      return
    }
  }

  var visible = false
  if (state.page == 0) {
    visible = true
  }
  var id = payload.rider_id
  var value= {
    position: {
      lat: payload.lat,
      lng: payload.lng
    },
    vendor_type: payload.vendor_type,
    rotation: payload.bearing,
    visible: visible
  }

  Vue.set(state.map.vendors, id, value)
};

const hide_markers = (state, payload) => {
  for (var key in state.map.vendors) {
    if (!state.map.vendors.hasOwnProperty(key)) continue;
    var obj = state.map.vendors[key];

    obj.visible = false
  }
};

export default {
  set_page,
  toggle_ongoing,
  set_ongoing_orders,
  set_markers,
  set_polyline,
  set_vendor_markers,
  hide_markers
};
