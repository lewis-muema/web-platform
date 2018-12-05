export default {
  requestPersonalInfo({commit, dispatch}, payload)
 {
   return new Promise((resolve, reject) => {

    dispatch("requestAxiosPost", payload, {root: true}).then(response => {
           console.log('in store dispatch to global store')
             console.log(response);
               resolve(response.data);
        }, error => {
           reject(error);
           console.log('failed to dispatch to global store')
        });
   })
 },
 requestChangePassword({commit, dispatch}, payload)
{
  return new Promise((resolve, reject) => {
    dispatch("requestAxiosPost", payload, {root: true}).then(response => {
      console.log('in store dispatch to global store')
          resolve(response.data);

   }, error => {
      reject(error);
      console.log('failed to dispatch to global store')
   });
})
},
};
