/* eslint no-param-reassign: "error" */
/* eslint no-lonely-if: "error" */

import axios from 'axios';

export default {
  requestAxiosPost({ state }, payload) {
    const baseUrl = window.location.origin;
    const loginUrl = `${baseUrl}/sign_in`;
    const url = state.ENV[payload.app];
    const lang = localStorage.getItem('language');
    const countryCode = localStorage.getItem('countryCode');
    const timeLocale = localStorage.getItem('timeLocale');
    const freightLang = `${timeLocale}-${countryCode}`;
    // add api key - if request is going to the backend
    if (payload.app === 'BACKEND_CUSTOMERS_APP') {
      payload.endpoint = `${payload.endpoint}?apikey=${state.ENV.BACKEND_API_KEY}`;
    }

    let config = {};

    // check if payload is a string here and change the content type
    if ('params' in payload) {
      payload.values = payload.params;
      if (typeof payload.params === 'object') {
        payload.values = JSON.stringify(payload.params);
      }
    } else if (typeof payload.values === 'object') {
      // assume we used values
      payload.values = JSON.stringify(payload.values);
    }
    const jwtToken = localStorage.getItem('jwtToken');
    const requestedPayload = payload.endpoint;
    const externalEndpoints = [
      'sign_up_check',
      'sign_in',
      'onboard_user',
      'forgot_pass',
      'forgot_token',
      'sign_up_submit',
      'onboard_details',
      'update_pass',
      'pending_delivery',
      'verify_phone',
      'check_verification',
      'geocountry',
      'last_partner_position',
      'admin_bypass',
      'request_verification',
      'token',
      'auth/forgot-password',
      'auth/reset-password',
      'freight/login',
      'freight/sign-up',
      'freight/verification-link',
      'freight/verify-email',
      'freight/forgot-password',
      'freight/validate-token',
    ];
    if (
      /^[\],:{}\s]*$/.test(
        payload.values
          .replace(/\\["\\bfnrtu]/g, '@')
          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?/g, ']')
          .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
      )
    ) {
      // the json is ok
      // set content type to json
      if (externalEndpoints.includes(requestedPayload)) {
        config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
      } else if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
        config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwtToken,
          },
        };
      } else {
        localStorage.removeItem('_sessionSnack');
        localStorage.removeItem('jwtToken');
        window.location.href = loginUrl;
        return true;
      }
    } else {
      // the json is not ok
      // assume it is just a string
      // add quotes to the string
      payload.values = `"${payload.values}"`;

      if (externalEndpoints.includes(requestedPayload)) {
        config = {
          headers: {
            'Content-Type': 'text/plain',
          },
        };
      } else if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
        config = {
          headers: {
            'Content-Type': 'text/plain',
            Authorization: jwtToken,
          },
        };
      } else {
        localStorage.removeItem('_sessionSnack');
        localStorage.removeItem('jwtToken');
        window.location.href = loginUrl;
        return true;
      }
    }

    config.headers['Accept-Language'] = payload.app === 'FREIGHT_APP' ? freightLang : lang;
    return new Promise((resolve, reject) => {
      axios
        .post(`${url}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (error.response.status === 403 || error.response.status === 401) {
            const data = {
              access_token: localStorage.getItem('jwtToken'),
              refresh_token: localStorage.getItem('refreshToken'),
            };
            axios
              .post(`${state.ENV.AUTH}token`, data)
              .then((response) => {
                if (response.status === 200) {
                  localStorage.setItem('jwtToken', response.data);
                } else {
                  localStorage.removeItem('_sessionSnack');
                  localStorage.removeItem('jwtToken');
                  window.location.href = loginUrl;
                }
              })
              .catch(() => {
                localStorage.removeItem('_sessionSnack');
                localStorage.removeItem('jwtToken');
                window.location.href = loginUrl;
              });
            return true;
          }
          reject(error);
          return false;
        });
    });
  },

  requestAxiosPatch({ state }, payload) {
    const baseUrl = window.location.origin;
    const loginUrl = `${baseUrl}/sign_in`;
    const url = state.ENV[payload.app];
    const lang = localStorage.getItem('language');
    const countryCode = localStorage.getItem('countryCode');
    const timeLocale = localStorage.getItem('timeLocale');
    const freightLang = `${timeLocale}-${countryCode}`;

    // add api key - if request is going to the backend
    if (payload.app === 'BACKEND_CUSTOMERS_APP') {
      payload.endpoint = `${payload.endpoint}?apikey=${state.ENV.BACKEND_API_KEY}`;
    }

    let config = {};

    // check if payload is a string here and change the content type
    if ('params' in payload) {
      payload.values = payload.params;
      if (typeof payload.params === 'object') {
        payload.values = JSON.stringify(payload.params);
      }
    } else if (typeof payload.values === 'object') {
      // assume we used values
      payload.values = JSON.stringify(payload.values);
    }
    const jwtToken = localStorage.getItem('jwtToken');
    const requestedPayload = payload.endpoint;
    const externalEndpoints = [
      'sign_up_check',
      'sign_in',
      'onboard_user',
      'forgot_pass',
      'forgot_token',
      'sign_up_submit',
      'onboard_details',
      'update_pass',
      'pending_delivery',
      'verify_phone',
      'check_verification',
      'geocountry',
      'last_partner_position',
      'admin_bypass',
      'request_verification',
      'token',
      'auth/forgot-password',
      'auth/reset-password',
      'freight/login',
      'freight/sign-up',
      'freight/verification-link',
      'freight/verify-email',
      'freight/forgot-password',
      'freight/validate-token',
    ];
    if (
      /^[\],:{}\s]*$/.test(
        payload.values
          .replace(/\\["\\bfnrtu]/g, '@')
          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?/g, ']')
          .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
      )
    ) {
      if (externalEndpoints.includes(requestedPayload)) {
        config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
      } else if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
        config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwtToken,
          },
        };
      } else {
        localStorage.removeItem('_sessionSnack');
        localStorage.removeItem('jwtToken');
        window.location.href = loginUrl;
        return true;
      }
    } else {
      payload.values = `"${payload.values}"`;

      if (externalEndpoints.includes(requestedPayload)) {
        config = {
          headers: {
            'Content-Type': 'text/plain',
          },
        };
      } else if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
        config = {
          headers: {
            'Content-Type': 'text/plain',
            Authorization: jwtToken,
          },
        };
      } else {
        localStorage.removeItem('_sessionSnack');
        localStorage.removeItem('jwtToken');
        window.location.href = loginUrl;
        return true;
      }
    }

    config.headers['Accept-Language'] = payload.app === 'FREIGHT_APP' ? freightLang : lang;
    return new Promise((resolve, reject) => {
      axios
        .patch(`${url}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (error.response.status === 403 || error.response.status === 401) {
            const data = {
              access_token: localStorage.getItem('jwtToken'),
              refresh_token: localStorage.getItem('refreshToken'),
            };
            axios
              .post(`${state.ENV.AUTH}token`, data)
              .then((response) => {
                if (response.status === 200) {
                  localStorage.setItem('jwtToken', response.data);
                } else {
                  localStorage.removeItem('_sessionSnack');
                  localStorage.removeItem('jwtToken');
                  window.location.href = loginUrl;
                }
              })
              .catch(() => {
                localStorage.removeItem('_sessionSnack');
                localStorage.removeItem('jwtToken');
                window.location.href = loginUrl;
              });
            return true;
          }
          reject(error);
          return false;
        });
    });
  },

  requestAxiosGet({ state }, payload) {
    let baseUrl = '';
    let jwtToken = '';
    if (process.browser) {
      baseUrl = window.location.origin;
      jwtToken = localStorage.getItem('jwtToken');
    }
    const loginUrl = `${baseUrl}/sign_in`;
    const url = state.ENV[payload.app];
    const lang = localStorage.getItem('language');
    const countryCode = localStorage.getItem('countryCode');
    const timeLocale = localStorage.getItem('timeLocale');
    const freightLang = `${timeLocale}-${countryCode}`;

    // add api key - if request is going to the backend
    if (payload.app === 'BACKEND_CUSTOMERS_APP') {
      payload.endpoint = `${payload.endpoint}?apikey=${state.ENV.BACKEND_API_KEY}`;
    }

    let config = {};

    // check if payload is a string here and change the content type
    const requestedPayload = payload.endpoint;
    const externalEndpoints = [
      'sign_up_check',
      'sign_in',
      'onboard_user',
      'forgot_pass',
      'forgot_token',
      'sign_up_submit',
      'onboard_details',
      'update_pass',
      'pending_delivery',
      'verify_phone',
      'check_verification',
      'geocountry',
      'last_partner_position',
      'admin_bypass',
      'request_verification',
      'token',
      'currency/get_supported_countries',
      'auth/forgot-password',
      'auth/reset-password',
      'freight/login',
      'freight/sign-up',
      'freight/verification-link',
      'freight/verify-email',
      'freight/forgot-password',
      'freight/validate-token',
    ];
    if (externalEndpoints.includes(requestedPayload)) {
      config = {
        headers: {
          'Content-Type': 'text/plain',
        },
      };
    } else if (typeof jwtToken !== 'undefined' || jwtToken !== null) {
      config = {
        headers: {
          'Content-Type': 'text/plain',
          Authorization: jwtToken,
        },
      };
    } else {
      setTimeout(() => {
        if (process.browser) {
          localStorage.removeItem('_sessionSnack');
          localStorage.removeItem('jwtToken');
          window.location.href = loginUrl;
        }
      }, 5000);
      return true;
    }

    config.headers['Accept-Language'] = payload.app === 'FREIGHT_APP' ? freightLang : lang;
    return new Promise((resolve, reject) => {
      axios
        .get(`${url}${payload.endpoint}`, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (error.response.status === 403 || error.response.status === 401) {
            const data = {
              access_token: localStorage.getItem('jwtToken'),
              refresh_token: localStorage.getItem('refreshToken'),
            };
            axios
              .post(`${state.ENV.AUTH}token`, data)
              .then((response) => {
                if (response.status === 200) {
                  localStorage.setItem('jwtToken', response.data);
                } else {
                  localStorage.removeItem('_sessionSnack');
                  localStorage.removeItem('jwtToken');
                  window.location.href = loginUrl;
                }
              })
              .catch(() => {
                localStorage.removeItem('_sessionSnack');
                localStorage.removeItem('jwtToken');
                window.location.href = loginUrl;
              });
            return true;
          }
          reject(error);
          return false;
        });
    });
  },

  requestAxiosPut({ state }, payload) {
    const baseUrl = window.location.origin;
    const loginUrl = `${baseUrl}/sign_in`;
    const url = state.ENV[payload.app];
    const lang = localStorage.getItem('language');
    const countryCode = localStorage.getItem('countryCode');
    const timeLocale = localStorage.getItem('timeLocale');
    const freightLang = `${timeLocale}-${countryCode}`;

    // add api key - if request is going to the backend
    if (payload.app === 'BACKEND_CUSTOMERS_APP') {
      payload.endpoint = `${payload.endpoint}?apikey=${state.ENV.BACKEND_API_KEY}`;
    }

    let config = {};

    // check if payload is a string here and change the content type
    if ('params' in payload) {
      payload.values = payload.params;
      if (typeof payload.params === 'object') {
        payload.values = JSON.stringify(payload.params);
      }
    } else if (typeof payload.values === 'object') {
      // assume we used values
      payload.values = JSON.stringify(payload.values);
    }
    const jwtToken = localStorage.getItem('jwtToken');
    const requestedPayload = payload.endpoint;
    const externalEndpoints = [
      'sign_up_check',
      'sign_in',
      'onboard_user',
      'forgot_pass',
      'forgot_token',
      'sign_up_submit',
      'onboard_details',
      'update_pass',
      'pending_delivery',
      'verify_phone',
      'check_verification',
      'geocountry',
      'last_partner_position',
      'admin_bypass',
      'request_verification',
      'token',
      'auth/forgot-password',
      'auth/reset-password',
      'freight/login',
      'freight/sign-up',
      'freight/verification-link',
      'freight/verify-email',
      'freight/forgot-password',
      'freight/validate-token',
    ];
    if (
      /^[\],:{}\s]*$/.test(
        payload.values
          .replace(/\\["\\bfnrtu]/g, '@')
          .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?/g, ']')
          .replace(/(?:^|:|,)(?:\s*\[)+/g, ''),
      )
    ) {
      if (externalEndpoints.includes(requestedPayload)) {
        config = {
          headers: {
            'Content-Type': 'application/json',
          },
        };
      } else if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
        config = {
          headers: {
            'Content-Type': 'application/json',
            Authorization: jwtToken,
          },
        };
      } else {
        localStorage.removeItem('_sessionSnack');
        localStorage.removeItem('jwtToken');
        window.location.href = loginUrl;
        return true;
      }
    } else {
      payload.values = `"${payload.values}"`;

      if (externalEndpoints.includes(requestedPayload)) {
        config = {
          headers: {
            'Content-Type': 'text/plain',
          },
        };
      } else if (typeof jwtToken !== 'undefined' && jwtToken !== null) {
        config = {
          headers: {
            'Content-Type': 'text/plain',
            Authorization: jwtToken,
          },
        };
      } else {
        localStorage.removeItem('_sessionSnack');
        localStorage.removeItem('jwtToken');
        window.location.href = loginUrl;
        return true;
      }
    }

    config.headers['Accept-Language'] = payload.app === 'FREIGHT_APP' ? freightLang : lang;
    return new Promise((resolve, reject) => {
      axios
        .put(`${url}${payload.endpoint}`, payload.values, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          if (error.response.status === 403 || error.response.status === 401) {
            const data = {
              access_token: localStorage.getItem('jwtToken'),
              refresh_token: localStorage.getItem('refreshToken'),
            };
            axios
              .post(`${state.ENV.AUTH}token`, data)
              .then((response) => {
                if (response.status === 200) {
                  localStorage.setItem('jwtToken', response.data);
                } else {
                  localStorage.removeItem('_sessionSnack');
                  localStorage.removeItem('jwtToken');
                  window.location.href = loginUrl;
                }
              })
              .catch(() => {
                localStorage.removeItem('_sessionSnack');
                localStorage.removeItem('jwtToken');
                window.location.href = loginUrl;
              });
            return true;
          }
          reject(error);
          return false;
        });
    });
  },
  requestAxiosGetPublicApi({ state }, payload) {
    let config = {};
    const url = payload.environment ? `https://api${payload.environment === 'Sandbox' ? 'test' : ''}.sendyit.com/v2/${payload.endpoint}` : `${state.ENV[payload.app]}${payload.endpoint}`;
    if (process.browser && localStorage.api_token) {
      config = {
        headers: {
          Authorization: `Bearer ${localStorage.api_token}`,
        },
      };
    }
    return new Promise((resolve) => {
      axios
        .get(url, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
          return false;
        });
    });
  },
  requestAxiosPostPublicApi({ state }, payload) {
    let config = {};
    const url = payload.environment ? `https://api${payload.environment === 'Sandbox' ? 'test' : ''}.sendyit.com/v2/${payload.endpoint}` : `${state.ENV[payload.app]}${payload.endpoint}`;
    if (process.browser && localStorage.api_token) {
      config = {
        headers: {
          Authorization: `Bearer ${localStorage.api_token}`,
        },
      };
    }
    return new Promise((resolve) => {
      axios
        .post(url, payload.payload, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
          return false;
        });
    });
  },
  requestAxiosPatchPublicApi({ state }, payload) {
    let config = {};
    const url = payload.environment ? `https://api${payload.environment === 'Sandbox' ? 'test' : ''}.sendyit.com/v2/${payload.endpoint}` : `${state.ENV[payload.app]}${payload.endpoint}`;
    if (process.browser && localStorage.api_token) {
      config = {
        headers: {
          Authorization: `Bearer ${localStorage.api_token}`,
        },
      };
    }
    return new Promise((resolve) => {
      axios
        .patch(url, payload.payload, config)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          resolve(error.response);
          return false;
        });
    });
  },
  show_notification({ commit }, payload) {
    commit('setNotification', payload);
    commit('setNotificationStatus', true);
    return true;
  },
  updateRunningBalance({ commit }, rb) {
    commit('setRunningBalance', rb);
    return true;
  },
  verifyNpsUser({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  storeNpsSurvey({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  requestRunningBalance({ dispatch, commit }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, { root: true }).then(
        (response) => {
          if (response.status === 200) {
            let rb = response.data.running_balance;
            if (payload.app === 'PRIVATE_API' && rb !== 0) {
              rb = response.data.running_balance * -1;
            }
            commit('setRunningBalance', rb);
          }
          resolve(response);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
  requestPromoCodePayment({ dispatch }, payload) {
    return new Promise((resolve, reject) => {
      dispatch('requestAxiosPost', payload, {
        root: true,
      }).then(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        },
      );
    });
  },
};
