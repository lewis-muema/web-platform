

export default {
    requestCardPayment({commit}, payload)
    {   

        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                console.log('in store dispatch to global store')
                if (response.data.status == true) {
                    
                    //not sure if we need to store anything here
                    //commit('setOrderHistoryOrders',response.data.data);
                    //check the reponse if true make another request to the backend to store the data

                    let session = this.$store.getters.getSession;
                    let reference = "";
                    let card_trans_id = "";

                    let card_payload = {
                    "amount": this.card_payment_data.amount,
                    "pay_method": 2,
                    "ref_no":'VISA-'.moment('dmyHis'),
                    "client_id": session.cop_id,
                    "account_no":"SENDY"+session.cop_id,
                    "phone":session.phone,
                    "email":session.email,
                    "name":session.name,
                    "bill_Ref_Number":reference,
                    "card_trans_id":card_trans_id
                    }

                    let full_payload = {
                        "values" : card_payload,
                        "vm":vm,
                        "app":"BACKEND_CUSTOMERS_APP",
                        "endpoint":"paymentapi"
                    }
                    
                    //resolve(response.data);
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
    requestPromoCodePayment({commit}, payload) {

        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                console.log('in store dispatch to global store')
                resolve(response);
             }, error => {
                reject(error);
                console.log('failed to dispatch to global store')
             });

        })
    },
    requestRunningBalance({commit}, payload) {
        return new Promise((resolve, reject) => {
            payload.vm.$store.dispatch("requestAxiosPost", payload).then(response => {
                resolve(response);
            }, error => {
                reject(error);
                console.log('failed to dispatch to global store')
             });
        })
    }

};
