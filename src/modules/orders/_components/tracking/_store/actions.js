import mqtt from 'mqtt';

const get_tracking_data = function({commit,dispatch,state}, data) {
	let payload = {
		app: 'NODE_PRIVATE_API',
		endpoint: 'pending_delivery',
		values: data,
	}

	return new Promise((resolve, reject) => {
		dispatch('requestAxiosPost', payload, {
				root: true
			})
			.then(response => {
				if (response.status) {
					if (state.tracked_order == data.order_no) {
						commit('set_tracking_data', response.data)
						commit('$_orders/set_polyline', response.data.polyline, {
							root: true
						});
						commit('$_orders/set_markers', response.data.path, {
							root: true
						})
					}
					resolve(true);
				}
				else {
					resolve(false);
				}
			}, error => {
				reject(error);
				// handle failure to dispatch to global store
			});
	})
}

const cancel_order = function({commit, dispatch}, data)
{
  let payload = {
    app: 'PRIVATE_API',
    endpoint: 'cancel_order',
    values: data,
  }

	return new Promise((resolve, reject) => {
		dispatch('requestAxiosPost', payload, {
				root: true
			})
			.then(response => {
				resolve(response.data);
			}, error => {
				reject(error);
				// handle failure to dispatch to global store
			});
	})
}

const trackMQTT = function({commit, state})
{
	if (!state.tracking_data.confirm_status > 0) {
		return false;
	}
	let tracking_no = state.tracking_data.rider.phone_no_1;
	let city_id = state.tracking_data.city_id;
	let city_code = '';

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

	let uri = `${city_code}/${tracking_no}`;

	let clientId = `mqttjs_wtp_${Math.random().toString(16).substr(2, 8)}_${Math.random()}_${new Date().getTime()}`;
	let host = 'wss://chat.sendyit.com:443';
	let options = {
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
		rejectUnauthorized: false,
	}
	let client = mqtt.connect(host, options);

	client.on('error', function(err) {
		// handle error
		client.end();
	})

	client.on('connect', function() {
		commit('setIsMQTTConnected', true);
	})

	client.subscribe(`partner_app_positions/${uri}`, {
		qos: 0,
	})

	client.on('message', function(topic, message, packet) {
		let vendor = JSON.parse(message.toString());
		vendor.overide_visible = true;
		commit('$_orders/set_vendor_markers', vendor, {root: true});
	})

	client.on('close', function() {
		// closed
	})
}

const running_balance = function({dispatch}, data)
{
  let payload = {
    app: 'PRIVATE_API',
    endpoint: 'running_balance',
    values: data,
  };

	return new Promise((resolve, reject) => {
		dispatch('requestAxiosPost', payload, {
				root: true
			})
			.then(response => {
				resolve(response.data);
			}, error => {
				reject(error);
				// handle failure to dispatch to global store'
			});
	})
}

export default {
	get_tracking_data,
	cancel_order,
	trackMQTT,
  running_balance,
};
