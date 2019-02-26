import Vue from 'vue';

const set_page = (state, payload) => {
  state.page = payload;
};

const toggle_ongoing = (state) => {
  if (state.ongoing_show === 0) {
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
  payload.forEach(function (value, i) {

    let icon = 'destination';
    if (i === 0) {
      icon = 'pickup';
    }
    let marker = {
      position: {
        lat: Number(value.coordinates.split(',')[0]),
        lng: Number(value.coordinates.split(',')[1]),
      },
      icon: icon
    };
    state.map.markers.push(marker);
  })
};

const set_polyline = (state, payload) => {
  state.map.polyline.path = payload;
};

const set_vendor_markers = (state, payload) => {

  /* 
  TO DO re-enable when we start busing live locations on the home page
  
  if('busy' in payload){
    if(payload.busy == true){
      return false;
    }
  }
  */

  let visible = false;
  if('page' in state){
    // order placement 
    if (state.page === 0) {
      visible = true;
    }
    // tracking
    else{
      if ('overide_visible' in payload){
        visible = true;
      }
    }
  }

 
 
  let id = payload.rider_id;
  let value = {
    position: {
      lat: payload.lat,
      lng: payload.lng,
    },
    vendor_type: payload.vendor_type,
    rotation: payload.bearing,
    visible: visible,
  }

  Vue.set(state.map.vendors, id, value);
};

const hide_vendors = (state, payload) => {
  for (let key in state.map.vendors) {
    if (!state.map.vendors.hasOwnProperty(key)) continue;
    let obj = state.map.vendors[key];

    obj.visible = false;
  }
};

const remove_markers = (state) => {
  state.map.markers = [];
}

const remove_polyline = (state) => {
  state.map.polyline.path = '';
}

const set_location_marker = (state,payload) => {
    state.map.markers.splice(payload.index,0,payload.marker);
}
const unset_location_marker = (state,index) => {
    state.map.markers.splice(index,1);
}
const unsetMap = (state) => {
    state.map.markers.splice(0);
    state.map.vendors.splice(0);
    state.map.polyline.path = '';
}

export default {
  set_page,
  toggle_ongoing,
  set_ongoing_orders,
  set_markers,
  set_polyline,
  set_vendor_markers,
  hide_vendors,
  remove_markers,
  remove_polyline,
  set_location_marker,
  unset_location_marker,
};
