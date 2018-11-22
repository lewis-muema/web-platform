import axios from 'axios'

const get_tracking_data = function({commit}, payload)
{
  const path = "https://privateapitest.sendyit.com/v1/pending_delivery"
  commit('$_orders/remove_polyline',[], {root: true})
  commit('$_orders/remove_markers',[], {root: true})
  return new Promise((resolve, reject) => {
    axios.post(path, payload)
    .then(response => {
      commit('set_tracking_data', response.data)
      commit('$_orders/set_polyline',response.data.polyline, {root: true})
      commit('$_orders/set_markers',response.data.path, {root: true})
      resolve(response.data);
    })
    .catch(e => {
        reject(e);
    })
  })
}

const cancel_order = function({commit}, payload)
{
  const path = "https://apitest.sendyit.com/parcel/index.php/api/v10/cancel_order"
  commit('$_orders/remove_polyline',[], {root: true})
  commit('$_orders/remove_markers',[], {root: true})

  return new Promise((resolve, reject) => {
    axios.post(path, payload)
    .then(response => {
      resolve(response.data);
    })
    .catch(e => {
        reject(e);
    })
  })
}

export default {
  get_tracking_data,
  cancel_order
};
