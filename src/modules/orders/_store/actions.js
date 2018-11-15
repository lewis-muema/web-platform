import axios from 'axios'
const path = "https://privateapitest.sendyit.com/v1/ongoing_deliveries"

const fetch_ongoing_orders = function({commit}, payload)
{
  return new Promise((resolve, reject) => {
    axios.post(path, {"phone":"0778987789"})
    .then(response => {
      commit('set_ongoing_orders', response.data)
      resolve(response.data);
    })
    .catch(e => {
        reject(e);
    })
  })
}

export default {
  fetch_ongoing_orders
};
