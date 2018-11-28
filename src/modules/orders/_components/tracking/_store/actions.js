import mqtt from 'mqtt'

const get_tracking_data = function({commit,dispatch,state}, data) {
	var payload = {
		"app": "NODE_PRIVATE_API",
		"endpoint": "pending_delivery",
		"values": data
	}

	return new Promise((resolve, reject) => {
		dispatch("requestAxiosPost", payload, {
				root: true
			})
			.then(response => {
				if (state.tracked_order == data.order_no) {
					commit('set_tracking_data', response.data)
					commit('$_orders/set_polyline', response.data.polyline, {
						root: true
					})
					commit('$_orders/set_markers', response.data.path, {
						root: true
					})
					setTimeout(function() {
						dispatch("get_tracking_data", data)
					}, 600000);
				}
				resolve();
			}, error => {
				reject(error);
				console.log('failed to dispatch to global store')
			});
	})
}

const cancel_order = function({commit, dispatch}, data)
{
  var payload = {
    "app":"PRIVATE_API",
    "endpoint":"cancel_order",
    "values":data
  }

	return new Promise((resolve, reject) => {
		dispatch("requestAxiosPost", payload, {
				root: true
			})
			.then(response => {
				resolve(response.data);
			}, error => {
				reject(error);
				console.log('failed to dispatch to global store')
			});
	})
}

const track_mqtt = function({commit, state})
{
	var tracking_no = state.tracking_data.rider.phone_no_1;
	var city_id = state.tracking_data.city_id;
	var city_code = '';

	switch (city_id) {
		case 1:
			city_code = 'ke-nairobi';
			break;
		case 2:
			city_code = 'ke-mombasa';
			break;
		case 3:
			city_code = 'ke-thika';
			break;
		case 4:
			city_code = 'ke-nakuru';
			break;
		case 5:
			city_code = 'ke-kisumu';
			break;
		default:
			city_code = 'ke-nairobi';
	}

	var uri = city_code + '/' + tracking_no;

	var clientId = 'mqttjs_wtp_' + Math.random().toString(16).substr(2, 8) + '_' + Math.random() + '_' + new Date().getTime()
	var host = 'wss://chat.sendyit.com:443'
	var options = {
		keepalive: 10,
		clientId: clientId,
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
	var client = mqtt.connect(host, options)

	client.on('error', function(err) {
		console.log(err)
		client.end()
	})

	client.on('connect', function() {
		console.log('client connected:' + clientId)
	})

	client.subscribe('partner_app_positions/' + uri, {
		qos: 0
	})

	client.on('message', function(topic, message, packet) {
		var vendor = JSON.parse(message.toString());
		console.log(vendor)
		commit('$_orders/set_vendor_markers', vendor)
	})

	client.on('close', function() {
		console.log(clientId + ' disconnected')
	})
}

export default {
	get_tracking_data,
	cancel_order,
	track_mqtt
};
