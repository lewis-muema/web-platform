import axios from 'axios'
import mqtt from 'mqtt'
const path = "https://privateapitest.sendyit.com/v1/ongoing_deliveries"

const fetch_ongoing_orders = function({state, commit, rootState}, payload)
{
  var session = rootState.session
  return new Promise((resolve, reject) => {
    axios.post(path, {"phone":""+session[session.default]["user_phone"]+""})
    .then(response => {
      commit('set_ongoing_orders', response.data)
      resolve(response.data);
    })
    .catch(e => {
        reject(e);
    })
  })
}

const connect_mqtt = function({commit}, payload)
{
  const CLIENTID = 'mqttjs_wp_' + Math.random().toString(16).substr(2, 8) + '_' +Math.random() +'_'+ new Date().getTime()
  const HOST = 'wss://chat.sendyit.com:443'
  const OPTIONS = {
    keepalive: 10,
    clientId: CLIENTID,
    protocolId: 'MQTT',
    protocolVersion: 4,
    clean: true,
    reconnectPeriod: 1000,
    connectTimeout: 30 * 1000,
    will: {
      topic: 'WillMsg',
      payload: 'Connection Closed abnormally..!',
      qos: 0,
      retain: false
    },
    username: 'sendy',
    password: '93a3a43dbac9ddd362702fb525b42a2d',
    rejectUnauthorized: false
  }

  var client = mqtt.connect(HOST, OPTIONS)

  client.on('error', function (err) {
    console.log(err)
    client.end()
  })

  client.on('connect', function () {
    console.log('client connected:' + CLIENTID)
  })

  client.subscribe('partner_app_positions/#', { qos: 0 })

  var i = 0;
  var interval = setInterval(function(){ i = i % 5 + 1} , 1000);

  client.on('message', function (topic, message, packet) {
    if ( i == 1) {
      var vendor = JSON.parse(message.toString());
      commit('set_vendor_markers', vendor)
    }
  })
}

export default {
  fetch_ongoing_orders,
  connect_mqtt
};
