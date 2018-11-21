
import axios from 'axios'

//TO DO: Get endpoint from configs
const path = "https://apitest.sendyit.com/parcel/api/v11/"
const url = "https://privateapitest.sendyit.com/v1/"


export default {

    requestOrderHistoryOrders({commit}, payload)
    {

        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
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

    requestCopUsers({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
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
    requestPayments({commit}, payload){
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
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
    requestStatement({commit}, payload){
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
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
    }

};
