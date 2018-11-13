
import axios from 'axios'

//TO DO: Get endpoint from configs
const path = "https://apitest.sendyit.com/parcel/api/v11/"


export default {

    requestOrderHistoryOrders({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            axios.post(path+"complete_orders", payload)
              .then(response => {
                if (response.data.status == true) {
                   commit('setOrderHistoryOrders',response.data.values);
                   resolve(response.data);
                }
                else {
                    reject(response.data);
                }
              })
              .catch(e => {
                  reject(e);
              })
        })
    },

};
