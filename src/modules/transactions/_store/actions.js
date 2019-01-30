
import axios from 'axios'

//TO DO: Get endpoint from configs
const path = "https://apitest.sendyit.com/parcel/api/v11/"
const url = "https://privateapitest.sendyit.com/v1/"


export default {

    requestOrderHistoryOrders({commit, dispatch}, payload)
    {

        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(response => {
                console.log('in store dispatch to global store')
                if(response.length > 1){
                    response = response[0];
                }
                if (response.data.status == true) {
                    commit('setOrderHistoryOrders',response.data.data);
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

    requestCopUsers({commit, dispatch}, payload)
    {
        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(response => {
                console.log('in store dispatch to global store')
                if(response.length > 1){
                    response = response[0];
                }
                if (response.data.status == true) {
                    commit('setCopUsers',response.data.data);
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
    requestPayments({commit, dispatch}, payload){
        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(response => {
                console.log('in store dispatch to global store')
                if (response.data.status == true) {
                    commit('setPayments',response.data.data);
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
    requestStatement({commit, dispatch}, payload){
        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(response => {
                console.log('in store dispatch to global store')
                if (response.data.status == true) {
                    commit('setStatement',response.data.data);
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
    requestDisputeDeliveryDocs({commit, dispatch}, payload)
   {
     return new Promise((resolve, reject) => {
        dispatch('requestAxiosPost', payload, {root: true}).then(response => {
             console.log('in store dispatch to global store')
               console.log(response);
                 resolve(response.data);
          }, error => {
             reject(error);
             console.log('failed to dispatch to global store')
          });
     })
   },
};
