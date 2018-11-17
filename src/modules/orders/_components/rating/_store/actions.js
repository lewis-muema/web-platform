
import axios from 'axios'

//TO DO: Get endpoint from configs
const path = "https://apitest.sendyit.com/parcel/api/v11/"
const url = "https://privateapitest.sendyit.com/v1/"


export default {

    requestRatingStatus({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            axios.post(url+"Rate/insertRate/", payload)
                .then(response => {
                    if (response.data.status === true) {
                        commit('setRatingStatus',response.data.data);
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
    requestUpdateRating({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            axios.post(url+"Rate/updateRate/", payload)
                .then(response => {
                    if (response.data.status === true) {
                        commit('setRatingUpdate',response.data.data);
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
