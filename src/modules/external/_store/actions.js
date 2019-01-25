import axios from 'axios'

const endpoint = "https://privateapitest.sendyit.com/v1/"

export default {
  requestInvitation(context, payload)
 {
   console.log("payload", payload);

   return new Promise((resolve, reject) => {
     payload.vm.$store.dispatch("requestAxiosPost", payload).then(
       response => {
         console.log("in store dispatch to global store");
           resolve(response.data);
       },
       error => {
         reject(error);
         console.log("failed to dispatch to global store");
       }
     );
   });
 },
 requestTokenValidation(context, payload) {
   console.log("payload", payload);

   return new Promise((resolve, reject) => {
     payload.vm.$store.dispatch("requestAxiosPost", payload).then(
       response => {
         console.log("in store dispatch to global store");
           resolve(response.data);
       },
       error => {
         reject(error);
         console.log("failed to dispatch to global store");
       }
     );
   });
 },
 requestOnboardingPhoneVerification({ commit, dispatch, rootGetters }, payload) {
   // console.log("payload", payload);

   return new Promise((resolve, reject) => {
       dispatch('requestAxiosPost', payload, {root: true}).then(
           response => {
               console.log('in store dispatch to global store');
               resolve(response.data);
           },
           error => {
               reject(error);
               console.log('failed to dispatch to global store');
           }
       );
   });
 },
 requestOnboardingVerificationVerify({ commit, dispatch, rootGetters }, payload) {
   // console.log("payload", payload);

   return new Promise((resolve, reject) => {
       dispatch('requestAxiosPost', payload, {root: true}).then(
           response => {
               console.log('in store dispatch to global store');
               resolve(response.data);
           },
           error => {
               reject(error);
               console.log('failed to dispatch to global store');
           }
       );
   });
 },
};
