import axios from 'axios';
import mqtt from 'mqtt';

const positions = [{"sim_card_sn":"89254021004075720312","lat":-1.2367241,"lng":36.750363,"speed":0,"time":"2018-12-12 20:51:37","course":0,"altitude":0,"accuracy":1336,"bearing":0,"busy":false,"vendor_type":3,"phone_no":"0720433521","rider_id":2373,"name":"Daniel","deviceId":0,"active":true,"carrier_type":0,"rating":5,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0},
{"sim_card_sn":"89254028041006003650","lat":-1.3337749,"lng":36.6763554,"speed":0,"time":"2018-12-12 20:51:36","course":0,"altitude":0,"accuracy":1549,"bearing":0,"busy":false,"vendor_type":1,"phone_no":"0710625786","rider_id":2016,"name":"Job","deviceId":0,"active":true,"carrier_type":0,"rating":4,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0},
{"sim_card_sn":"89254021074139332909","lat":-1.1701982,"lng":36.8393247,"speed":0,"time":"2018-12-12 20:51:42","course":0,"altitude":0,"accuracy":1799.999,"bearing":0,"busy":false,"vendor_type":10,"phone_no":"0723831127","rider_id":2172,"name":"Edward","deviceId":0,"active":true,"carrier_type":1,"rating":5,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0},
{"sim_card_sn":"89254021094108887337","lat":-1.1505124,"lng":36.9462797,"speed":0,"time":"2018-12-12 20:51:38","course":0,"altitude":0,"accuracy":1650,"bearing":0,"busy":false,"vendor_type":10,"phone_no":"0728646317","rider_id":1890,"name":"Mose","deviceId":0,"active":true,"carrier_type":1,"rating":0,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0},
{"sim_card_sn":"89254031521059560180","lat":-0.0994871,"lng":34.7534709,"speed":0,"time":"2018-12-12 20:52:16","course":0,"altitude":0,"accuracy":1824,"bearing":0,"busy":false,"vendor_type":1,"phone_no":"0780005551","rider_id":693,"name":"Benjamin","deviceId":0,"active":true,"carrier_type":1,"rating":4,"partner_level":1,"exclusive_status":0,"city_id":5,"license_status":0},
{"sim_card_sn":"89254021064151546379","lat":-1.3314168,"lng":36.8660127,"speed":2.07,"time":"2018-12-12 20:51:48","course":0,"altitude":1627.7783203125,"accuracy":7.928,"bearing":61,"busy":false,"vendor_type":1,"phone_no":"0715096654","rider_id":2428,"name":"Levy","deviceId":0,"active":true,"carrier_type":1,"rating":5,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0},
{"sim_card_sn":"89254028041006003650","lat":-1.3337749,"lng":36.6763554,"speed":0,"time":"2018-12-12 20:51:46","course":0,"altitude":0,"accuracy":1549,"bearing":0,"busy":false,"vendor_type":1,"phone_no":"0710625786","rider_id":2016,"name":"Job","deviceId":0,"active":true,"carrier_type":0,"rating":4,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0},
{"sim_card_sn":"89254070000255887327","lat":-1.2982859,"lng":36.7750044,"speed":0,"time":"2018-12-12 20:51:49","course":0,"altitude":1777.4,"accuracy":3,"bearing":211,"busy":false,"vendor_type":1,"phone_no":"0727457624","rider_id":1463,"name":"Joseph","deviceId":0,"active":true,"carrier_type":1,"rating":4,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0},
{"sim_card_sn":"89254070000255887327","lat":-4.005733,"lng":39.608925,"speed":0,"time":"2018-12-12 20:51:49","course":0,"altitude":1777.4,"accuracy":3,"bearing":211,"busy":false,"vendor_type":1,"phone_no":"0727457625","rider_id":103,"name":"Jose","deviceId":0,"active":true,"carrier_type":1,"rating":4,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0},
{"sim_card_sn":"892540700002558873271","lat":-4.047469,"lng":39.656341,"speed":0,"time":"2018-12-12 20:51:49","course":0,"altitude":1777.4,"accuracy":3,"bearing":211,"busy":false,"vendor_type":12,"phone_no":"07274576261","rider_id":203,"name":"Peter","deviceId":0,"active":true,"carrier_type":1,"rating":4,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0},
{"sim_card_sn":"892540700002558873272","lat":-4.039158,"lng":39.633169,"speed":0,"time":"2018-12-12 20:51:49","course":0,"altitude":174,"accuracy":3,"bearing":211,"busy":false,"vendor_type":10,"phone_no":"07274576262","rider_id":204,"name":"Peter","deviceId":0,"active":true,"carrier_type":1,"rating":4,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0},
{"sim_card_sn":"89254021004075720312","lat":-1.2441614,"lng":36.7522913,"speed":0,"time":"2018-12-12 20:51:48","course":0,"altitude":0,"accuracy":1336,"bearing":0,"busy":false,"vendor_type":3,"phone_no":"0720433521","rider_id":2373,"name":"Daniel","deviceId":0,"active":true,"carrier_type":0,"rating":5,"partner_level":3,"exclusive_status":0,"city_id":1,"license_status":0}];

const fetch_ongoing_orders = function({state, commit, dispatch, rootState})
{
  let session = rootState.session;
  let data = {phone:`${session[session.default]['user_phone']}`};
  let payload = {
    app: 'NODE_PRIVATE_API',
    endpoint: 'ongoing_deliveries',
    values: data,
  }

  return new Promise((resolve, reject) => {
    dispatch("requestAxiosPost", payload, { root: true })
    .then(response => {
      commit('set_ongoing_orders', response.data)
      resolve(response.data);
    }, error => {
      reject(error);
      console.log('failed to dispatch to global store')
    });
  })
}

const connect_mqtt = function({commit}, payload)
{
  for (let i = 0; i < positions.length; i++) {
    let vendor = positions[i];
    commit('set_vendor_markers', vendor);

  }
}

const intializeMqtt = function({commit}, payload)
{
  return false;
  // const CLIENTID = `mqttjs_wp_${Math.random().toString(16).substr(2, 8)}_${Math.random()}_${new Date().getTime()}`;
  // const HOST = 'wss://chat.sendyit.com:443';
  // const OPTIONS = {
  //   keepalive: 10,
  //   clientId: CLIENTID,
  //   protocolId: 'MQTT',
  //   protocolVersion: 4,
  //   clean: true,
  //   reconnectPeriod: 1000,
  //   connectTimeout: 30 * 1000,
  //   will: {
  //     topic: 'WillMsg',
  //     payload: 'Connection Closed abnormally..!',
  //     qos: 0,
  //     retain: false,
  //   },
  //   username: 'sendy',
  //   password: '93a3a43dbac9ddd362702fb525b42a2d',
  //   rejectUnauthorized: false,
  // }

  // let client = mqtt.connect(HOST, OPTIONS)

  // client.on('error', function (err) {
  //   console.log(err);
  //   client.end();
  // })

  // client.on('connect', function () {
  //   console.log(`client connected: ${CLIENTID}`);
  // })

  // // client.subscribe('partner_app_positions/#', { qos: 0 })

  // let i = 0;
  // let interval = setInterval(function(){ i = i % 5 + 1} , 1000);

  // client.on('message', function (topic, message, packet) {
  //   console.log('on message');
  //   if ( i === 1) {
  //     let vendor = JSON.parse(message.toString());
  //     console.log('vendor', vendor);
  //     commit('set_vendor_markers', vendor)
  //   }
  // })
}

export default {
  fetch_ongoing_orders,
  connect_mqtt,
  intializeMqtt,
};
