import axios from 'axios'

const endpoint = "https://privateapitest.sendyit.com/v1/"

export default {
   requestSignIn(context, payload)
  {
    console.log('payload',payload);
    console.log('context',context);
    return new Promise((resolve, reject) => {
        axios.post(endpoint+"sign_in", payload)
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
  requestForgotPassword(context, payload)
 {
   console.log('payload',payload);
   console.log('context',context);
   return new Promise((resolve, reject) => {
       axios.post(endpoint+"", payload)
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
 requestResetPassword(context, payload)
{
  console.log('payload',payload);
  console.log('context',context);
  return new Promise((resolve, reject) => {
      axios.post(endpoint+"", payload)
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
