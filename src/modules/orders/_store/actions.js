import axios from 'axios';
import mqtt from 'mqtt';

const positions = [];

const fetch_ongoing_orders = function ({
  state, commit, dispatch, rootState,
}) {
  const session = rootState.session;
  const data = { phone: `${session[session.default].user_phone}` };
  const payload = {
    app: 'NODE_PRIVATE_API',
    endpoint: 'ongoing_deliveries',
    values: data,
  };

  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, { root: true }).then(
      (response) => {
        commit('set_ongoing_orders', response.data);
        resolve(response.data);
      },
      (error) => {
        reject(error);
        console.log('failed to dispatch to global store');
      },
    );
  });
};

const connect_mqtt = function ({ commit }, payload) {
  for (let i = 0; i < positions.length; i++) {
    const vendor = positions[i];
    commit('set_vendor_markers', vendor);
  }
};

const intializeMqtt = function ({ commit }, payload) {
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
};

const get_order_data = function ({ commit, dispatch, state }, data) {
  const payload = {
    app: 'NODE_PRIVATE_API',
    endpoint: 'pending_delivery',
    values: data,
  };

  return new Promise((resolve, reject) => {
    dispatch('requestAxiosPost', payload, {
      root: true,
    }).then(
      (response) => {
        resolve(response);
      },
      (error) => {
        reject(error);
        // handle failure to dispatch to global store
      },
    );
  });
};

export default {
  fetch_ongoing_orders,
  connect_mqtt,
  intializeMqtt,
  get_order_data,
};
