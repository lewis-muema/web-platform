import axios from 'axios'

const endpoint = "https://privateapitest.sendyit.com/v1/"

export default {
  requestPersonalInfo(context, payload)
 {
   console.log('payload',payload);
   console.log('context',context);
   return new Promise((resolve, reject) => {
       axios.post(endpoint+"update_user", payload)
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
 requestChangePassword(context, payload)
{
  console.log('payload',payload);
  console.log('context',context);
  return new Promise((resolve, reject) => {
      axios.post(endpoint+"update_user", payload)
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
