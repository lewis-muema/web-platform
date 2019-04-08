/* eslint no-restricted-syntax: ["error","WithStatement", "BinaryExpression[operator='in']"] */
import axios from 'axios';
import store from '@/data/state';

class Http {
  constructor() {
    const service = axios.create({});
    service.interceptors.request.use((config) => {
      const resolved = config;
      resolved.headers.common['x-access-token'] = store.state.token;
      return resolved;
    });
    this.service = service;
  }

  redirectTo = (document, path) => {
    const data = document;
    data.location = path;
  };

  get(path) {
    return this.service.get(path);
  }

  patch(path, payload, callback) {
    return this.service
      .request({
        method: 'PATCH',
        url: path,
        responseType: 'json',
        data: payload,
      })
      .then(response => callback(response.status, response.data));
  }

  post(path, payload) {
    return this.service.request({
      method: 'POST',
      url: path,
      responseType: 'json',
      data: payload,
    });
  }
}

export default new Http();
