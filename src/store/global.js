import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const global_store = new Vuex.Store({
  modules: {
    $_global: {
      namespaced: true,

      // module assets
      state: {

          session_data:{},
      },
      getters: {
          getSessionData: state => {
            return state.session_data;
        },
         // -> getters['$_global/getSessionData']
      },
      actions: {
        //
      },
      mutations: {
          setSessionData (state,data) {
            state.session_data = data
          }
      }
    }
  }
})

export default global_store
