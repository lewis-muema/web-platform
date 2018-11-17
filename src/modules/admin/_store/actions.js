
import axios from 'axios'

//TO DO: Get endpoint from configs
const path = "https://apitest.sendyit.com/parcel/api/v11/"
const url = "https://privateapitest.sendyit.com/v1/"


export default {

    requestUsersList({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                console.log('in store dispatch to global store')
                console.log(response)
                if (response.data.status == true) {
                    commit('setUsersList',response.data.data);
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
    requestDepartmentsList({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                console.log('in store dispatch to global store')
                console.log(response)
                if (response.data.status == true) {
                    commit('setDepartmentsList',response.data.data);
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
    requestKeysList({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                console.log('in store dispatch to global store')
                console.log(response)
                if (response.data.status == true) {
                    commit('setKeysList',response.data.data);
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
    addNewDepartment({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                console.log('in store dispatch to global store')
                console.log(response)
                if (response.data.status == true) {
                    commit('setDepartmentsList',response.data.data);
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
