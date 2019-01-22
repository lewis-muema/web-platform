export default {
	requestPromoCodePayment({ dispatch, commit, getters, rootGetters }, payload) {
		return new Promise((resolve, reject) => {
			dispatch('requestAxiosPost', payload, {
				root: true,
			}).then(
				response => {
					resolve(response);
				},
				error => {
					reject(error);
				}
			);
		});
	},
	requestCardPayment({ dispatch, commit, getters, rootGetters }, payload) {
		commit('setCardLoadingStatus', true);

		return new Promise((resolve, reject) => {
			dispatch('requestAxiosPost', payload, {
				root: true,
			}).then(
				response => {
					commit('setCardLoadingStatus', false);
					if (response.length > 1) {
						response = response[0];
					}
					resolve(response);
				},
				error => {
					commit('setCardLoadingStatus', false);
					reject(error);
				}
			);
		});
	},
	completeCardPaymentRequest({ dispatch, commit, getters, rootGetters }, payload) {
		return new Promise((resolve, reject) => {
			dispatch('requestAxiosPost', payload, {
				root: true,
			}).then(
				response => {
					if (response.length > 1) {
						response = response[0];
					}
					resolve(response);
				},
				error => {
					reject(error);
				}
			);
		});
	},
	resetCardPaymentRequest({ dispatch, commit, getters, rootGetters }, payload) {
		return new Promise((resolve, reject) => {
			commit('setCardLoadingStatus', false);
			commit('setCardFailStatus', false);
			commit('setCardSuccessStatus', false);
			resolve(true);
		});
	},

	requestMpesaPayment({ dispatch, commit, getters, rootGetters }, payload) {
		return new Promise((resolve, reject) => {
			dispatch('requestAxiosPost', payload, { root: true }).then(
				response => {
					commit('setMpesaLoadingStatus', true);
					commit('setMpesaFailStatus', false);
					commit('setMpesaSuccessStatus', false);
					resolve(response);
				},
				error => {
					commit('setMpesaLoadingStatus', false);
					commit('setMpesaFailStatus', true);
					reject(error);
				}
			);
		});
	},

	completeMpesaPaymentRequest({ commit }, payload) {
		return new Promise((resolve, reject) => {
			commit('setMpesaLoadingStatus', false);
			commit('setMpesaSuccessStatus', true);
			commit('setMpesaFailStatus', false);
			resolve(true);
		});
	},
	resetMpesaPaymentRequest({ commit }, payload) {
		return new Promise((resolve, reject) => {
			commit('setMpesaLoadingStatus', false);
			commit('setMpesaFailStatus', false);
			commit('setMpesaSuccessStatus', false);
			resolve(true);
		});
	},

	terminateMpesaPaymentRequest({ commit }, payload) {
		return new Promise((resolve, reject) => {
			commit('setMpesaLoadingStatus', false);
			commit('setMpesaFailStatus', true);
			commit('setMpesaSuccessStatus', false);
			resolve(true);
		});
	},

	requestRunningBalance({ dispatch }, payload) {
		return new Promise((resolve, reject) => {
			dispatch('requestAxiosPost', payload, { root: true }).then(
				response => {
					if (response.status === 200) {
						const rb = response.data.running_balance;
						dispatch('updateRunningBalance', rb, { root: true });
					}
					resolve(response);
				},
				error => {
					reject(error);
				}
			);
		});
	},
	requestAddNewCard({ dispatch, commit }, payload) {
		commit('setCardLoadingStatus', true);

		return new Promise((resolve, reject) => {
			dispatch('requestAxiosPost', payload, {
				root: true,
			}).then(
				response => {
					commit('setCardLoadingStatus', false);
					if (response.length > 0) {
						response = response[0];
					}
					resolve(response);
				},
				error => {
					commit('setCardLoadingStatus', false);
					reject(error);
				}
			);
		});
	},
};
