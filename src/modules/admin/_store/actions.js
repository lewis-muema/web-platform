export default {
  requestUsersList({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('updateUsersList', response.data.data);
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  requestDepartmentsList({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('updateDepartmentsList', response.data.data);
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  requestKeysList({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('updateKeysList', response.data.data);
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  addWebHooks({ dispatch }, payload) {
    return new Promise((resolve) => {
      const fullpayload = {
        app: 'PUBLICAPI',
        endpoint: 'webhooks',
        payload,
      };
      dispatch('requestAxiosPostPublicApi', fullpayload, { root: true }).then(
        (response) => {
          resolve(response.data);
        },
        (error) => {
          resolve(error.resonse);
        },
      );
    });
  },
  updateWebHooks({ dispatch }, payload) {
    return new Promise((resolve) => {
      const fullpayload = {
        app: 'PUBLICAPI',
        endpoint: `webhooks/${payload.webhook_id}`,
        payload,
      };
      dispatch('requestAxiosPatchPublicApi', fullpayload, { root: true }).then(
        (response) => {
          resolve(response.data);
        },
        (error) => {
          resolve(error.resonse);
        },
      );
    });
  },
  getWebHooks({ commit, dispatch }) {
    return new Promise((resolve) => {
      const fullpayload = {
        app: 'PUBLICAPI',
        endpoint: 'webhook-events',
        environment: localStorage.api_environment,
      };
      dispatch('requestAxiosGetPublicApi', fullpayload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('setWebHookEvents', response.data);
          }
          resolve(response.data);
        },
        (error) => {
          resolve(error.response);
        },
      );
    });
  },
  getUserWebHooks({ commit, dispatch }) {
    return new Promise((resolve) => {
      const fullpayload = {
        app: 'PUBLICAPI',
        endpoint: 'webhooks',
        environment: localStorage.api_environment,
      };
      dispatch('requestAxiosGetPublicApi', fullpayload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('setWebHookEvents', response.data);
          }
          resolve(response.data);
        },
        (error) => {
          resolve(error.response);
        },
      );
    });
  },
  generateAPIPassword({ dispatch }, payload) {
    return new Promise((resolve) => {
      const fullpayload = {
        app: 'PUBLICAPI',
        endpoint: 'passwords/generate',
        payload,
      };
      dispatch('requestAxiosPostPublicApi', fullpayload, { root: true }).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          resolve(error.resonse);
        },
      );
    });
  },
  generateAPITokens({ commit, dispatch }, payload) {
    return new Promise((resolve) => {
      const fullpayload = {
        app: 'PUBLICAPI',
        endpoint: 'tokens/generate',
        payload,
      };
      dispatch('requestAxiosPostPublicApi', fullpayload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('setAPIToken', response.data.data.token);
          }
          resolve(response);
        },
        (error) => {
          resolve(error.response);
        },
      );
    });
  },
  generateAPIKey({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('updateKeysList', response.data.data);
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  addNewDepartment({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('updateDepartmentsList', response.data.data);
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  editAdminDepartment({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('updateDepartmentsList', response.data.data);
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  editAdminUser({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('updateUsersList', response.data.data);
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  },

  inviteNewUsers({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('updateUsersList', response.data.data);
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  },

  createInviteLink({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.data.status) {
            commit('updateInviteLink', response.data.data);
            resolve(response.data);
          } else {
            reject(response.data);
          }
        },
        (error) => {
          reject(error);
        },
      );
    });
  },

  requestCopInfo({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          resolve(response.data);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
};
