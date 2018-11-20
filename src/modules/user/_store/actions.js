import axios from 'axios'

const endpoint = "https://privateapitest.sendyit.com/v1/"

export default {
  requestPersonalInfo(context, payload)
 {
   console.log('payload',payload);
   console.log('context',context);
   return new Promise((resolve, reject) => {

       payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
           console.log('in store dispatch to global store')
             console.log(response);
               resolve(response.data);
        }, error => {
           reject(error);
           console.log('failed to dispatch to global store')
        });
   })
 },
 requestChangePassword(context, payload)
{
  console.log('payload',payload);
  console.log('context',context);
  return new Promise((resolve, reject) => {

  payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
      console.log('in store dispatch to global store')
          resolve(response.data);

   }, error => {
      reject(error);
      console.log('failed to dispatch to global store')
   });
})
},
};
