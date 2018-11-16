
import axios from 'axios'

//TO DO: Get endpoint from configs
const path = "https://apitest.sendyit.com/parcel/api/v11/"
const url = "https://privateapitest.sendyit.com/v1/"


export default {

    requestOrderHistoryOrders({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            axios.post(url+"order_history/", payload)
              .then(response => {
                if (response.data.status == true) {
                   commit('setOrderHistoryOrders',response.data.data);
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

    requestCopUsers({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            axios.post(url+"/cop_users", payload)
            .then(response => {
                if(response.data.status == true){
                    commit('setCopUsers', response.data.data);
                    resolve(response.data);
                } else {
                    reject(response.data)
                }
            }).catch(e => {
                reject(e);
            })
        })
    }

};
