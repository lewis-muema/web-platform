import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  waypoints: 1,
  active_package_class:'',
  active_vendor_name:'',
  active_order_option:'',
  price_request_object:{"economy_price_tiers":{"small":[{"vendor_name":"Express","eta":2700,"discountAmount":0,"best_option":true,"vendor_id":1,"return_cost":420,"tier_tag":"express_tier","status":true,"tier_sub_title":"Save time!","tier_description":"If available, you'll get your own designated Sendy Driver! He will pick up your order and immediately drop it off at its destination.","order_no":"AC315Q459-R8F","tier_name":"Direct","cost":390},{"vendor_name":"Runner","eta":2700,"discountAmount":0,"best_option":true,"vendor_id":21,"return_cost":230,"tier_tag":"express_tier","status":true,"tier_sub_title":"Save time!","tier_description":"If available, you'll get your own designated Sendy Driver! He will pick up your order and immediately drop it off at its destination.","order_no":"AC31N7459-J2C","tier_name":"Direct","cost":200},{"vendor_name":"Standard","eta":5400,"discountAmount":0,"best_option":true,"vendor_id":22,"return_cost":770,"tier_tag":"economy_tier","status":true,"tier_sub_title":"Save time!","tier_description":"If available, you'll get your own designated Sendy Driver! He will pick up your order and immediately drop it off at its destination.","order_no":"AC31G3459-F3M","tier_name":"Economy","cost":590}],"large":[{"vendor_name":"3 Ton Truck","eta":2700,"discountAmount":0,"best_option":true,"vendor_id":6,"return_cost":5750,"tier_tag":"express_tier","status":true,"tier_sub_title":"Save time!","tier_description":"If available, you'll get your own designated Sendy Driver! He will pick up your order and immediately drop it off at its destination.","order_no":"AC31MM459-MGL","tier_name":"Direct","cost":5700},{"vendor_name":"5 Ton Truck","eta":2700,"discountAmount":0,"best_option":true,"vendor_id":10,"return_cost":6360,"tier_tag":"express_tier","status":true,"tier_sub_title":"Save time!","tier_description":"If available, you'll get your own designated Sendy Driver! He will pick up your order and immediately drop it off at its destination.","order_no":"AC31LP459-NH7","tier_name":"Direct","cost":6300},{"vendor_name":"10 Ton Truck","eta":2700,"discountAmount":0,"best_option":true,"vendor_id":14,"return_cost":7270,"tier_tag":"express_tier","status":true,"tier_sub_title":"Save time!","tier_description":"If available, you'll get your own designated Sendy Driver! He will pick up your order and immediately drop it off at its destination.","order_no":"AC312W459-4D3","tier_name":"Direct","cost":7200}],"medium":[{"vendor_name":"Pickup","eta":2700,"discountAmount":0,"best_option":true,"vendor_id":2,"return_cost":1350,"tier_tag":"express_tier","status":true,"tier_sub_title":"Save time!","tier_description":"If available, you'll get your own designated Sendy Driver! He will pick up your order and immediately drop it off at its destination.","order_no":"AC313L459-BSV","tier_name":"Direct","cost":1300},{"vendor_name":"Van","eta":2700,"discountAmount":0,"best_option":true,"vendor_id":3,"return_cost":1350,"tier_tag":"express_tier","status":true,"tier_sub_title":"Save time!","tier_description":"If available, you'll get your own designated Sendy Driver! He will pick up your order and immediately drop it off at its destination.","order_no":"AC31UF459-CKM","tier_name":"Direct","cost":1300}]}},
  max_way_points: 9,
  order_locations:[],
  order_path:[],
  schedule_time:'',
  order_notes:''
}

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
