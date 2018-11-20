

export default {
    requestPriceQuote({commit}, payload)
   {
     console.log('payload',payload);

     return new Promise((resolve, reject) => {
       payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
           console.log('in store dispatch to global store')
           if (response.data.status == true) {
               let price_request_object = response.data.values;
               console.log('price_request_object',price_request_object);
               commit('set_price_request_object',price_request_object);
               resolve(response.data);
            }
            else {
                reject(response.data);
            }
        }, error => {
           reject(error);
           console.log('failed to dispatch to global store',error)
        });
   })
  },

      requestOrderCompletion({commit}, payload)
     {
       console.log('payload',payload);

       return new Promise((resolve, reject) => {
         payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
             console.log('in store dispatch to global store')
             if (response.data.status == true) {
                 resolve(response.data);
              }
              else {
                  reject(response.data);
              }
          }, error => {
             reject(error);
             console.log('failed to dispatch to global store',error)
          });
     })
    },

    
};
