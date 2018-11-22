import axios from 'axios'

const get_tracking_data = function({commit, dispatch}, data)
{
  var payload = {
    "app":"NODE_PRIVATE_API",
    "endpoint":"pending_delivery",
    "values":data
  }

  return new Promise((resolve, reject) => {
    dispatch("requestAxiosPost", payload, { root: true })
    .then(response => {
      commit('set_tracking_data', response.data)
      commit('$_orders/set_polyline',response.data.polyline, {root: true})
      commit('$_orders/set_markers',response.data.path, {root: true})
      setTimeout(function() {
        dispatch("get_tracking_data", data)
      }, 5000);
      resolve();
    }, error => {
      reject(error);
      console.log('failed to dispatch to global store')
    });
  })
}

const cancel_order = function({commit}, data)
{
  var payload = {
    "app":"PRIVATE_API",
    "endpoint":"cancel_order",
    "values":data
  }

  return new Promise((resolve, reject) => {
    dispatch("requestAxiosPost", payload, { root: true })
    .then(response => {
      commit('$_orders/remove_polyline',[], {root: true})
      commit('$_orders/remove_markers',[], {root: true})
      resolve(response.data);
    }, error => {
      reject(error);
      console.log('failed to dispatch to global store')
    });
  })
}

export default {
  get_tracking_data,
  cancel_order
};
