
export default {
    requestPriceQuote({commit,dispatch,rootGetters}, payload)
   {
     console.log('payload',payload);

     return new Promise((resolve, reject) => {
       dispatch("requestAxiosPost", payload, { root: true }).then(response => {
           console.log('in store dispatch to global store')
           if (response.data.status == true) {
               let price_request_object = response.data.values;
               console.log('price_request_object',price_request_object);
               commit('set_price_request_object',price_request_object);
               commit('$_orders/set_polyline',response.data.values.polyline[0], {root: true});
               console.log('set_polyline',response.data.values.polyline[0]);

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

      requestOrderCompletion({commit,dispatch,rootGetters}, payload)
     {
       console.log('payload',payload);

       return new Promise((resolve, reject) => {
         dispatch("requestAxiosPost", payload, { root: true }).then(response => {
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

    requestSavedCards({ commit, dispatch }, payload) {
      return new Promise((resolve, reject) => {
        dispatch("requestAxiosPost", payload, {root:true}).then(
          response => {
            console.log("in store dispatch to global store");
            if (response.data.status == true) {
                commit("$_orders/$_home/set_saved_cards",response.data.cards, {root:true});
                commit("$_orders/$_home/set_stripe_user_id",response.data.stripe_user_id, {root:true});
                resolve(response.data);
            } else {
                console.log('response not true')
              reject(response.data);
            }
          },
          error => {
            reject(error);
            console.log("failed to dispatch to global store");
          }
        );
      });
    },


};
