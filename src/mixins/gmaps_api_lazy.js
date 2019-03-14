import * as VueGoogleMaps from 'vue2-google-maps';

class gmapApiPromiseLazy {
  constructor() {
    const service = VueGoogleMaps.create({});
    this.service = service;
    check_google();
  }

  check_google() {
    return this.service
      .request({
        method: 'LISTEN',
        resource: google,
        responseType: 'promise',
      })
      .then(response => callback(response.resolve));
  }
}

export default new Http();
