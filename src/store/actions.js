import axios from 'axios'

export default {

    requestAxiosPost({state},payload)
    {
        let url = state.ENV[payload.app];
        
        return new Promise((resolve, reject) => {
            axios.post(url+payload.endpoint, payload.values)
                .then(response => {
                    resolve(response);
                })
                .catch(e => {
                    reject(e);
                })
        })
    },
};
