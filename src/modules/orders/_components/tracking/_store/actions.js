import axios from 'axios'
const path = "https://privateapitest.sendyit.com/v1/pending_delivery"

const get_tracking_data = function({commit}, payload)
{
  return new Promise((resolve, reject) => {
    axios.post(path, {"order_no": "AC31Q5345-IMV"})
    .then(response => {
      commit('set_tracking_data', response.data)
    })
    .catch(e => {
        reject(e);
    })
  })
}

export default {
  get_tracking_data
};
