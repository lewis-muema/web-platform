
import axios from 'axios'

//TO DO: Get endpoint from configs
const path = "https://apitest.sendyit.com/parcel/api/v11/"
const url = "https://privateapitest.sendyit.com/v1/"


export default {

    requestUsersList({commit , dispatch}, payload)
    {
        return new Promise((resolve, reject) => {
             dispatch("requestAxiosPost", payload, {root: true}).then(response => {
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
    requestDepartmentsList({commit , dispatch}, payload)
    {
        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(response => {
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
    requestKeysList({commit , dispatch}, payload)
    {
        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(response => {
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
    generateAPIKey({commit, dispatch}, payload)
    {
        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(response => {
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
    addNewDepartment({commit, dispatch}, payload)
    {
        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(response => {
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
    editAdminDepartment({commit, dispatch}, payload)
    {
        return new Promise((resolve, reject) => {
            dispatch("requestAxiosPost", payload, {root: true}).then(response => {
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
    editAdminUser({commit, dispatch}, payload)
   {
       return new Promise((resolve, reject) => {
        dispatch("requestAxiosPost", payload, {root: true}).then(response => {
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

    inviteNewUsers({commit, dispatch}, payload)
   {
       return new Promise((resolve, reject) => {
           dispatch("requestAxiosPost", payload, {root: true}).then(response => {
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

    createInviteLink({commit, dispatch}, payload)
   {
       return new Promise((resolve, reject) => {
        dispatch("requestAxiosPost", payload, {root: true}).then(response => {
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

   requestCopInfo({commit, dispatch}, payload)
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
