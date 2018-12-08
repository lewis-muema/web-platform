
import axios from 'axios'

//TO DO: Get endpoint from configs
const path = "https://apitest.sendyit.com/parcel/api/v11/"
const url = "https://privateapitest.sendyit.com/v1/"


export default {
    requestOrder({commit, dispatch}, payload)
    {

        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(response => {
                console.log('in store dispatch to global store')
                if(response.length > 1){
                    response = response[0];
                }
                if (response.data) {
                    // commit('updateOrder',response.data.data);
                    resolve(response.data);
                }
                else {
                    reject(response.data);
                }
            }, error => {
                reject(error);
                console.log('failed to dispatch to global store')
            });

        })
    },

    requestRatingStatus({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                console.log('in store dispatch to global store')
                console.log(response)
                if (response.data.status == true) {
                    commit('setRatingStatus',response.data.data);
                    resolve(response.data);
                }
                else {
                    reject(response.data);
                }
            }, error => {
                reject(error);
                console.log('failed to dispatch to global store')
            });

        })
    },
    requestUpdateRating({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                console.log('in store dispatch to global store')
                console.log(response)
                if (response.data.status == true) {
                    commit('setRatingUpdate',response.data.data);
                    resolve(response.data);
                }
                else {
                    reject(response.data);
                }
            }, error => {
                reject(error);
                console.log('failed to dispatch to global store')
            });

        })
    },

};
