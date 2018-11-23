
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
                    commit('updateUsersList',response.data.data);
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
                    commit('updateDepartmentsList',response.data.data);
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
                    commit('updateKeysList',response.data.data);
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
    generateAPIKey({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                console.log('in store dispatch to global store')
                console.log(response)
                if (response.data.status == true) {
                    console.log('key generated')
                    commit('updateKeysList',response.data.data);
                    resolve(response.data);
                }
                else {
                    console.log('Failed')
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
                    commit('updateDepartmentsList',response.data.data);
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
    editAdminDepartment({commit}, payload)
    {
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                console.log('in store dispatch to global store')
                console.log(response)
                if (response.data.status == true) {
                    commit('updateDepartmentsList',response.data.data);
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
    editAdminUser({commit}, payload)
   {
       return new Promise((resolve, reject) => {
           payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
               console.log('in store dispatch to global store')
               console.log(response)
               if (response.data.status == true) {
                   commit('updateUsersList',response.data.data);
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

    inviteNewUsers({commit}, payload)
   {
       return new Promise((resolve, reject) => {
           payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
               console.log('in store dispatch to global store')
               console.log(response)
               if (response.data.status == true) {
                   commit('updateUsersList',response.data.data);
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

    createInviteLink({commit}, payload)
   {
       return new Promise((resolve, reject) => {
           payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
               console.log('in store dispatch to global store')
               console.log(response)
               if (response.data.status == true) {
                   commit('updateInviteLink',response.data.data);
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
