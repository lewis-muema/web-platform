
import axios from 'axios'

//TO DO: Get endpoint from configs
const path = "https://apitest.sendyit.com/parcel/api/v11/"
const url = "https://privateapitest.sendyit.com/v1/"


export default {

    requestUsersList({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            axios.post(url+"cop_users/", payload)
                .then(response => {
                    if (response.data.status === true) {
                        commit('setUsersList',response.data.data);
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
    requestDepartmentsList({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            axios.post(url+"cop_departments/", payload)
                .then(response => {
                    if (response.data.status === true) {
                        commit('setDepartmentsList',response.data.data);
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
    requestKeysList({commit}, payload) {
        return new Promise((resolve, reject) => {
            axios.post(url + "get_api/", payload)
                .then(response => {
                    if (response.data.status === true) {
                        commit('setKeysList', response.data.data);
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
    requestEditUserAdmin(context, payload)
   {
     console.log('payload',payload);
     console.log('context',context);
     return new Promise((resolve, reject) => {
         axios.post(url+"update_user", payload)
           .then(response => {
             if (response.data.status == true) {
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
