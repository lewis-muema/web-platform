/* eslint-disable */
import Vue from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
 faUserSecret, faStar, faChartBar, faMoneyBillAlt, faUniversity, faCoins, faMobile, faGasPump, faCalendarWeek,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

library.add(faUserSecret, faStar, faChartBar, faMoneyBillAlt, faUniversity, faCoins, faMobile, faGasPump, faCalendarWeek);

Vue.component('font-awesome-icon', FontAwesomeIcon);

global.localStorage = {
  getItem(key) {
    return localStorage[key];
  },
  setItem(key, value) {
    localStorage[key] = value;
  },
  removeItem(key) {
    delete localStorage[key];
  },
};
localStorage.jwtToken = 'eyJhbGciOiJIUzI1NiIsInR5cGUiOiJKV1QifQ.eyJwYXlsb2FkIjp7InN0YXRlIjoiMSIsImRlZmF1bHRfY3VycmVuY3kiOiJLRVMiLCJkYXRlX2FkZGVkIjoiMjAxOC0wMS0yOSAwOTo0MTozMSIsInN0YXR1cyI6IjEiLCJlbWFpbCI6InBzYW1vZWlAc2VuZHkuY28ua2UiLCJyZWZlcmVyIjpudWxsLCJrcmFfcGluX2NlcnQiOm51bGwsIm5va19uYW1lIjpudWxsLCJpZF9ubyI6IjI1NDE3MDE0Iiwibm9rX3Bob25lIjpudWxsLCJwb3J0YWxfcGFzc3dvcmQiOiJmMmQ4ZDUyMzZhNzY2Yzg0NTEzYzU4YWRjMDg3M2Q3OTg4NmQ0MTBhIiwibmFtZSI6IlBoaWwgU2Ftb2VpIiwib3duZXJfdHlwZSI6IjAiLCJzdGFnZSI6IjEiLCJpZCI6IjExOTgiLCJrcmFfcGluIjpudWxsLCJkYXRlX3RpbWUiOiIwMDAwLTAwLTAwIDAwOjAwOjAwIiwidG9rZW4iOiJqZnRyYzR5VHVYIiwicGhvbmUiOiIrMjU0NzIyNTExMDQ2IiwiY291bnRyeV9jb2RlIjoiS0UiLCJpZF9jYXJkIjoiMTUwNTM4MTA2NjcxOWltYWdlLmpwZyJ9LCJzdGF0dXMiOnRydWUsImV4cGlyeSI6Ijg2NDAwIn0.XqMz4M_s0c_aCi4UBJZKQHJ4Wdjt-cwQ_EszESAErWY';
localStorage.countryCode = 'KE';
localStorage.language = 'en-US,en;q=0.9';
localStorage.timeLocale = 'en';
localStorage.refreshToken = 'ljaf5i0kI8bZJfjaKVGEk1u2obB0VWjrqxEcxC4QXxYWq3nHmQ';
localStorage.tourViewStatus = true;
localStorage._sessionSnack = {"peer":{},"biz":{"pay_option":2,"default_currency":"KES","default_carrier_type":1,"user_name":"Faithshopy","status":true,"user_phone":"+254709779779","industry_id":2,"freight_status":2,"tax_authority_pin":"A758577545P","cop_biz_email":"faithshop@gmail.com","verified_social_media_business":1,"cop_id":669,"user_email":"faithshop@gmail.com","company_reg_no":"testreg","cop_biz_phone":"+254778987789","social_media_business_approval_status":0,"user_promo":"9ALEEM","user_id":1,"freight_approver":1,"preferred_language":null,"cop_contact_person":"Faith mungai","cop_name":"Faith shop","user_type":2,"primary_business_unit":1,"pay_method":2,"country_code":"KE","cop_user_type":2},"test_account":true,"customer_care_number":"+254 709 779 779","default":"biz","first_time":false};
localStorage.reloaded = 1;
localStorage.tracking_data = {
  path: [
    {
      coordinates: '-1.2789845,36.7358726',
      country_code: 'KE',
      more: {
        Address: 'Not Indicated',
        Estate: '',
        FlatName: '',
        HouseDoor: '',
        Label: '',
        Otherdescription: '',
        Road: '',
        Typed: '',
        Vicinity: 'Not Indicated',
        landmark: '',
        place_idcustom: 'ChIJ7w7g_n4ZLxgRT57b1bzmRW0',
        viewport: {
          northeast: {
            lat: 0,
            lng: 0,
          },
          southwest: {
            lat: 0,
            lng: 0,
          },
        },
      },
      name: 'Ndwaru Road',
      notes: null,
      notify: false,
      recipient_name: null,
      recipient_phone: null,
      reference_number: null,
      waypoint_details_status: true,
      waypoint_type: 'PICKUP',
      visited: false,
    },
    {
      coordinates: '-1.285549,36.826400',
      country_code: 'KE',
      more: {
        Address: '',
        Estate: '',
        FlatName: '',
        HouseDoor: '',
        Label: '',
        Otherdescription: '',
        Road: '',
        Typed: '',
        Vicinity: '',
        landmark: '',
        place_idcustom: '',
        viewport: {
          northeast: {
            lat: 0,
            lng: 0,
          },
          southwest: {
            lat: 0,
            lng: 0,
          },
        },
      },
      name: 'RNG Plaza',
      notes: null,
      notify: false,
      recipient_name: null,
      recipient_phone: null,
      reference_number: null,
      waypoint_details_status: false,
      waypoint_type: 'DELIVERY',
      visited: false,
    },
  ],
  description_head: 'We are matching your order with a rider',
  marketing_message: 'A rider will be allocated to your order',
  sliding_message: [
    'Your order has been received. ',
    'We are dispatching to Drivers in the area. ',
    "The driver's details will appear here once confirmed.",
  ],
  slide_time_milliseconds: 5000,
  price_type: 1,
  main_status: 1,
  amount: 616,
  city_id: 1,
  order_no: 'AC94BX839-KXN',
  parent_order_no: 'AC94LH842-USH',
  confirm_status: 0,
  delivery_status: 0,
  rate_status: 0,
  date_time: '2021-05-21 05:31:09',
  user: {
    name: 'Faithshopy',
    email: 'faithshop@gmail.com',
    phone: '+254709779779',
  },
  rider: {
    rider_id: 1,
    rider_name: 'Sendy Rider',
    rider_phone: '0709779779',
    number_plate: ' WER 565t',
    vehicle_name: null,
    phone_no_1: '0709779779',
    rider_rating: '4.0',
    rider_photo: 'https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png',
    vendor_id: 1,
    vendor_description: null,
    vendor_name: 'Bike',
  },
  delivery_log: [
    {
      description: 'Order AC94BX839-KXN created',
      log_type: 1,
      text_json: '{"client_mode":669,"delivery_id":1359919,"duration":42,"order_no":"AC94BX839-KXN","rider_id":1,"rider_name":"Sendy Driver","_push_description":"Order AC94BX839-KXN created","_push_description_id":1,"_push_type":6,"description":"New delivery request","log_type":1,"pickupduration":34}',
      log_time: '2021-05-21T02:31:09.000Z',
    },
  ],
  order_notes: [
    {
      msg: 'none',
    },
  ],
  price_tier: {},
  package_details: {
    additional_loader: false,
    customer_min_amount: 0,
    delivery_item: '',
    load_units: 'tonnes',
    load_weight: 0,
    max_temperature: 4,
    no_of_loaders: 1,
  },
  tier_name: '',
  polyline: 'rxxFk~e_F}BB}@@q@@{@Fm@Ng@VUPa@d@eA|As@rAg@x@_@b@{@l@aEbBmDjAy@\\g@b@k@`@]j@Sh@e@jCU~ASt@a@`A]j@Y`@gC`DiAzA_@d@aAfAcBxBg@z@i@dAmAtCiBzC{@hBUZY^cAlAsCbDyAnBqAzA_A`AKDKTO`@I^?RE\\MTOL[Lm@?e@SSYEKKEMGmAC}@@y@EsCWqBUaAOoCk@cDo@uA_@[Im@Ae@?m@Ju@ZQ\\I^Cl@Hf@LXRX`@Lz@HXCTGHEb@]Zg@Ro@Lq@F_ALaCXaBt@uCjAmD~@uB`@}@lDwGhAuBrAiDx@_Dl@mCb@uD^wFz@kLLwFBiBCmRS_PIkH?aGOkKKaCGqHG}F?oCBmEFoCBgAA}FO{HGyCSuEYcGQkESwDMcBi@aFWyBa@yEYyAY_Ae@gA[m@oAyBgDcGc@eAg@qByA{K[gCs@{Fq@qFS}ASkAa@iAOs@Io@Au@FiCCs@QwB]aEIiDAiDDuA`@gGx@eNr@wMPaGR{FXuDf@qELm@Ru@Z_BPgBNkC@eATaF`@iGNsBD{@LqAPeAx@wD^}Ap@{BXk@f@w@\\a@jCyBdA{@p@a@nAu@r@m@TYFOTUHAl@Il@[bAy@t@o@vAqApA}An@u@T[rE_EdCsBtBiBtFsEhFiE`BuAlBoBbAsA`@}@vA{Ct@}At@qAp@s@p@s@hAcA~ByA`Am@^O~@a@lAc@xAWnD]vD[dBQbB[rA[lAe@`Bs@VU@EDILGPEPBFDB@^M|DsAbFqBzIoDdAg@NM@KHSLIVGPBHBVAnA[zB{@n@WxEgBpBw@`GaClBw@~CwAb@WBKHG@I?MGk@gBuEiEmKkHoQ_@q@OOWOI?QGOUBYFQi@sAyGhCQRy@ZeA^sDxAq@V',
  eta_data: {
    order_no: 'AC94BX839-KXN',
    reason: 'The order does not exist.',
    status: false,
    cancelled: false,
    cancelled_message: '',
  },
  fixed_cost: true,
  status: true,
  to_details: {
    to_name: 'RNG Plaza',
    to_cord: '-1.285549,36.826400',
    to_lat: '-1.285549',
    to_long: '36.826400',
  },
  from_details: {
    from_name: 'Ndwaru Road',
    from_cord: '-1.2789845,36.7358726',
    to_lat: '-1.2789845',
    to_long: '36.7358726',
  },
  city_code: 'ke-nairobi',
  customer_care_number: '+254 709 779 779',
  currency: 'KES',
  edit_config: {
    add_drop_off: false,
    add_pickup: false,
    change_drop_off: false,
    change_notes: false,
    change_pickup: false,
  },
  payment_method: 12,
  payment_option: 1,
};
localStorage.tracking = {
  '$_tracking': {
    tracked_order: "",
    tracking_data: {},
    isMQTTConnected: false,
    date_time: "",
    share_option: false,
    track_more_info: false,
    track_vendor_name: "",
    track_partner_name: "",
    track_package_name: "",
    confirm_eta: "",
    pickup_eta: "",
    delivery_eta: "",
    edit_location: false,
    edit_scheduled_time: false,
    pick_up_time: "",
    pick_up_filled_status: false,
    pickup_filled: false,
    order_path: [],
    location_names: [],
    location_path: [],
    extra_destinations: 0,
    max_destinations: 24,
    edit_notes: false,
    stored_notes: {},
    amount_due: 0,
  },
};
localStorage.map = {
  markers: [],
  polyline: {
    path: "",
    options: {
      strokeColor: "#1782c5",
      strokeOpacity: 1,
      strokeWeight: 2
    }
  },
  vendors: {},
};
localStorage.intercounty_tracking_data = {
  "path": [
    {
      "coordinates": "-1.285554,36.826400",
      "country_code": "KE",
      "more": {
        "Address": "",
        "Estate": "",
        "FlatName": "",
        "HouseDoor": "",
        "Label": "",
        "Otherdescription": "",
        "Road": "",
        "Typed": "",
        "Vicinity": "",
        "landmark": "",
        "place_idcustom": "",
        "viewport": {
          "northeast": {
            "lat": 0,
            "lng": 0
          },
          "southwest": {
            "lat": 0,
            "lng": 0
          }
        }
      },
      "name": "RNG Plaza",
      "notes": null,
      "notify": false,
      "recipient_name": null,
      "recipient_phone": null,
      "waypoint_details_status": false,
      "waypoint_type": "PICKUP",
      "visited": false
    },
    {
      "coordinates": "0.244244,35.066684",
      "country_code": "KE",
      "more": {
        "Address": "",
        "Estate": "",
        "FlatName": "",
        "HouseDoor": "",
        "Label": "",
        "Otherdescription": "",
        "Road": "",
        "Typed": "",
        "Vicinity": "",
        "landmark": "",
        "place_idcustom": "",
        "viewport": {
          "northeast": {
            "lat": 0,
            "lng": 0
          },
          "southwest": {
            "lat": 0,
            "lng": 0
          }
        }
      },
      "name": "Baraton Plaza",
      "notes": null,
      "notify": false,
      "recipient_name": null,
      "recipient_phone": null,
      "waypoint_details_status": false,
      "waypoint_type": "DELIVERY",
      "visited": false
    }
  ],
  "description_head": "We are matching your order with a driver",
  "marketing_message": "A driver will be allocated to your order",
  "sliding_message": [
    "Your order has been received. ",
    "We are dispatching to Drivers in the area. ",
    "The driver's details will appear here once confirmed."
  ],
  "slide_time_milliseconds": 5000,
  "price_type": 1,
  "main_status": 1,
  "amount": 229,
  "city_id": 1,
  "order_no": "AD74ED615-TKM",
  "parent_order_no": "AD74ED615-TKM",
  "confirm_status": 0,
  "delivery_status": 0,
  "rate_status": 0,
  "date_time": "2020-09-26 13:15:16",
  "user": {
    "name": "Faithshopy",
    "email": "faithshop@gmail.com",
    "phone": "+254709779779"
  },
  "rider": {
    "rider_id": 1,
    "rider_name": "Sendy Rider",
    "rider_phone": "0709779779",
    "number_plate": " WER 565t",
    "vehicle_name": null,
    "phone_no_1": "0709779779",
    "rider_rating": "4.0",
    "rider_photo": "https://s3-eu-west-1.amazonaws.com/sendy-partner-docs/photo/1533214131993profile_picture_placeholder.png",
    "vendor_id": 26,
    "vendor_description": "Inter-county",
    "vendor_name": "Inter-county"
  },
  "delivery_log": [
    {
      "description": "Order AD74ED615-TKM created",
      "log_type": 1,
      "text_json": "{\"_push_description\":\"Order AD74ED615-TKM created\",\"_push_description_id\":1,\"_push_type\":6,\"client_mode\":669,\"delivery_id\":1354358,\"description\":\"New delivery request\",\"duration\":363,\"log_type\":1,\"order_no\":\"AD74ED615-TKM\",\"pickupduration\":355,\"rider_id\":1,\"rider_name\":\"Sendy Driver\"}",
      "log_time": "2020-09-26T10:15:16.000Z"
    }
  ],
  "order_notes": [
    {
      "msg": "none"
    }
  ],
  "price_tier": {},
  "package_details": {
    "additional_loader": false,
    "customer_min_amount": 0,
    "delivery_item": "",
    "load_units": "tonnes",
    "load_weight": 0,
    "max_temperature": 4,
    "no_of_loaders": 0
  },
  "tier_name": "",
  "polyline": "pazFgtw_Foc@z_@eg@cJe[bN{h@a^o`@uCiKzOwQ`e@m@UaF_NuEM_FhVqUdIkXnIwVhb@yUnYy^gIiVtBcM`P{PgAwP|O}Sdi@_d@`g@wp@rH{c@tj@sm@hfAe|@fg@eb@nLa`@hm@o{@~kAsRfGXhMyEnj@m`@fk@~CpXyJlP}u@bm@iS~q@os@ppBbQlsAyUttAWrm@iv@bGof@nKcMfi@jPl^}JaEop@mAai@aCgw@r@ir@dR{rAgD{g@{Gy{@~C_o@jS_uAz[wxB_^giAkVkvAbUil@lKm{AyUip@~KewAjq@wnAvj@wbAbSms@dm@yvA~tAeTfu@uk@vmAeEpVym@tn@{l@pa@idA|DgjA}Tya@@om@rXg|@~o@_sAbz@ydAvz@meA`g@oo@pi@qLh\\wQhv@coAb_Ck{Ar}AwtAng@ecBbpAanAdcAml@bwAu`BniC{x@b[saBr@cyAmD{pBnWciBbe@aq@fOq|CntBibBrt@}v@bx@u`CveAq_CxiAyl@nu@eo@nXg}BjqBsmBhdA}jCliAcmChcAkfBhiAyuAxhBkoAflBydAzhDsoCptCkk@z{@mm@`Sm{@dDif@|sAigAj{DxK|pA}Nl_@lAtMtWnhA|S|z@gbBrfFcOvu@y`Anr@unAzrFmW|lEuzEx_M_z@jjCpDjkAdYleBObk@xKjW{C|]aBtVhh@`L|e@dO`RrXbV|n@~HnbAig@|p@tB~r@iQvm@}RxW_\\bYsrAt[cv@to@s`AjUcxBbkBy[xMk_@rMw^l_@o^x]ms@Iaw@^{bAgYaqA|d@cy@tOgVxWsM~Zh@de@Rjl@mc@rRy_Bpc@kw@Bka@|Sug@nWaTtMqG`c@_]~k@ik@r\\_Tdx@wgAnzAfA~xBwM~d@tHl~@~Rxx@qf@~j@{p@bp@k_@~Le^cIsdBp@_cAyn@kO{Kk^tB_}@jE_\\sEad@_Uq|@lPgg@xWbLpYjIfaAr@zXiPnPs~@nj@c^zbA`B|{@uYrz@{f@~`@yv@v[ax@lXyo@uOu`@}DnBb\\lUve@_h@jvAuIjd@gi@xWk|@dtAg^f~A}a@xtAqw@d_BwTzh@iGt|@qYx`AdA`t@zJ`^kj@bz@yYlIgG`s@yX`s@x@|m@fMlmAvx@pY``Bnk@`Z|pCp@`s@@fQiRjQ_uAtd@qQjb@eb@||Am^hj@aKpw@m@zaCyYtv@iA`g@`TjkAcSnf@kPaAwMiIoh@sUwh@vD{NrZcG~e@aCl^hQ~a@k@dzBc_BjnA_r@|bAdv@ldAcAhF",
  "eta_data": {
    "order_no": "AD74ED615-TKM",
    "reason": "The order does not exist.",
    "status": false,
    "cancelled": false,
    "cancelled_message": ""
  },
  "fixed_cost": true,
  "status": true,
  "to_details": {
    "to_name": "Baraton Plaza",
    "to_cord": "0.244244,35.066684",
    "to_lat": "0.244244",
    "to_long": "35.066684"
  },
  "from_details": {
    "from_name": "RNG Plaza",
    "from_cord": "-1.285554,36.826400",
    "to_lat": "-1.285554",
    "to_long": "36.826400"
  },
  "city_code": "ke-nairobi",
  "customer_care_number": "+254 709 779 779",
  "currency": "KES",
  "edit_config": null,
  "payment_method": 12,
  "payment_option": 2,
  "inter_county_order_details": {
    "approximate_weight": 15,
    "destination_delivery_mode": null,
    "destination_delivery_status": false,
    "destination_order_no": null,
    "destination_pricing_details": null,
    "destination_pricing_uuid": null,
    "destination_waypoint_instructions": null,
    "final_price": {
      "currency": "KES",
      "partner_price": 180,
      "sendy_price": 200
    },
    "final_weight": null,
    "order_info": {
      "destination_deliveries": null,
      "pickup_deliveries": [
        {
          "id": "6aaf4b84-43f2-48c0-a236-bed733d2fcea"
        }
      ],
      "route": {
        "cost_per_kg": {
          "currency": "KES",
          "partner_cost": 70,
          "sendy_up_charge": 30
        },
        "max_weight": 5,
        "object_id": "5f58bf16fca68fb7dce38569",
        "price": {
          "currency": "KES",
          "partner_price": 180,
          "sendy_price": 200
        }
      }
    },
    "order_no": "AD74ED615-TKM",
    "package_type": "PARCEL",
    "pickup_delivery_status": false,
    "pickup_order_no": null,
    "pickup_pricing_details": null,
    "pickup_pricing_uuid": null,
    "pickup_waypoint_instructions": [],
    "recipient_info": {
      "name": "Dennis",
      "phone_number": "+254 700 536660"
    },
    "sender_info": {
      "name": "Faithshopy",
      "phone_number": "+254709779779"
    },
    "status": "received",
    "vat_amount": 29,
    "total_cost": 229
  },
  "order_timeline": [
    {
      "message": "Your order has been received",
      "status": "visited",
      "timestamp": "2020-09-26T10:15:16.000Z"
    },
    {
      "message": "Take your package to our collection center at RNG Plaza",
      "status": "ongoing",
      "timestamp": "2020-09-26T10:15:16.000Z"
    },
    {
      "message": "Your package will be verified at the collection center and the final fees charged",
      "status": "pending"
    },
    {
      "message": "Your package will be delivered overnight to Baraton Plaza",
      "status": "pending"
    },
    {
      "message": "Your package is on the way to Baraton Plaza",
      "status": "pending"
    },
    {
      "message": "Delivery has been completed",
      "status": "pending"
    }
  ]
};
localStorage.session = {
  "peer": {},
  "biz": {
    "pay_option": 2,
    "default_currency": "KES",
    "default_carrier_type": 1,
    "user_name": "Faithshopy",
    "status": true,
    "user_phone": "+254709779779",
    "industry_id": 2,
    "freight_status": 2,
    "tax_authority_pin": "A758577545P",
    "cop_biz_email": "faithshop@gmail.com",
    "verified_social_media_business": 1,
    "cop_id": 669,
    "user_email": "faithshop@gmail.com",
    "company_reg_no": "testreg",
    "cop_biz_phone": "+254778987789",
    "social_media_business_approval_status": 0,
    "user_promo": "9ALEEM",
    "user_id": 1,
    "freight_approver": 1,
    "preferred_language": null,
    "cop_contact_person": "Faith mungai",
    "cop_name": "Faith shop",
    "user_type": 2,
    "primary_business_unit": 1,
    "pay_method": 2,
    "country_code": "KE",
    "cop_user_type": 2
  },
  "test_account": true,
  "customer_care_number": "+254 709 779 779",
  "default": "biz",
  "first_time": false,
};
localStorage.cancellation_reasons = {
  "status": true,
  "data": [
    {
      "id": 3,
      "vendor_type_ids": "[1,2,3,6,10,12,13,14,17,18,19,20,25,26]",
      "vendor_type_names": [
        "10T Truck",
        "14T Truck",
        "20T Truck",
        "24T Truck",
        "28T Truck",
        "3T Truck",
        "5T Truck",
        "7T Truck",
        "Bike",
        "Freight",
        "Inter-county",
        "Pick Up",
        "tuk tuk",
        "Van"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 5,
      "cancellation_reason": "My order is not ready",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-04-20T12:46:24.000Z",
      "created_by": "Lewis",
      "admin_id": 101,
      "status": 1,
      "priority_key": 19,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": [
        {
          "action_type": 1,
          "message": "We are sorry that your order is not ready. You can reschedule the pick up time of you order to another time like now.",
          "applicable_order_status": [
            1
          ],
          "comparator": 0,
          "duration": "0"
        },
        {
          "action_type": 2,
          "comparator": 1,
          "duration": "10",
          "cancellation_fee": "300",
          "currency": "KES",
          "applicable_order_status": [
            1
          ]
        }
      ]
    },
    {
      "id": 4,
      "vendor_type_ids": "[1,2,3,6,10,12,13,14,17,18,19,20,25]",
      "vendor_type_names": [
        "10T Truck",
        "14T Truck",
        "20T Truck",
        "24T Truck",
        "28T Truck",
        "3T Truck",
        "5T Truck",
        "7T Truck",
        "Bike",
        "Freight",
        "Pick Up",
        "tuk tuk",
        "Van"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 4,
      "cancellation_reason": "Placed the wrong locations",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-04-20T16:22:02.000Z",
      "created_by": "Caleb Nasio",
      "admin_id": 361,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": [
        {
          "action_type": 4,
          "message": "We are sorry you entered the wrong locations. You can update the locations below. You may incur cost on updating your destinations.",
          "applicable_order_status": [
            1,
            2,
            3
          ],
          "comparator": 0,
          "duration": "0"
        },
        {
          "action_type": 2,
          "comparator": 1,
          "duration": "10",
          "cancellation_fee": "100",
          "currency": "KES",
          "applicable_order_status": [
            1,
            2,
            3
          ]
        }
      ]
    },
    {
      "id": 5,
      "vendor_type_ids": "[1,2,3,6,10,12,13,14,17,18,19,20,25,26]",
      "vendor_type_names": [
        "10T Truck",
        "14T Truck",
        "20T Truck",
        "24T Truck",
        "28T Truck",
        "3T Truck",
        "5T Truck",
        "7T Truck",
        "Bike",
        "Freight",
        "Inter-county",
        "Pick Up",
        "tuk tuk",
        "Van"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 7,
      "cancellation_reason": "No driver has been allocated to my request",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-04-20T16:25:21.000Z",
      "created_by": "Lewis",
      "admin_id": 101,
      "status": 1,
      "priority_key": 17,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": [
        {
          "action_type": 5,
          "applicable_order_status": [1],
          "comparator": 2,
          "duration": "5",
          "message": "We are sorry that your order has not been matched to a suitable driver. We are doing our best to find your a suitable driver to service your order",
        }
      ],
    },
    {
      "id": 8,
      "vendor_type_ids": "[1,2,3,6,10,12,13,14,17,18,19,20,26]",
      "vendor_type_names": [
        "10T Truck",
        "14T Truck",
        "20T Truck",
        "24T Truck",
        "28T Truck",
        "3T Truck",
        "5T Truck",
        "7T Truck",
        "Bike",
        "Inter-county",
        "Pick Up",
        "tuk tuk",
        "Van"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 21,
      "cancellation_reason": "Driver too far",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-04-20T16:25:32.000Z",
      "created_by": "Lewis",
      "admin_id": 101,
      "status": 1,
      "priority_key": 15,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": null
    },
    {
      "id": 9,
      "vendor_type_ids": "[1,2,3,6,10,12,13,14,17,18,19,20,26]",
      "vendor_type_names": [
        "10T Truck",
        "14T Truck",
        "20T Truck",
        "24T Truck",
        "28T Truck",
        "3T Truck",
        "5T Truck",
        "7T Truck",
        "Bike",
        "Inter-county",
        "Pick Up",
        "tuk tuk",
        "Van"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 0,
      "cancellation_reason": "Other reason",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-04-20T16:29:07.000Z",
      "created_by": "Lewis",
      "admin_id": 101,
      "status": 1,
      "priority_key": 14,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": [
        {
          "action_type": 2,
          "duration": "10",
          "comparator": 2,
          "cancellation_fee": "300",
          "applicable_order_status": [
            1,
            2
          ]
        },
        {
          "action_type": 3,
          "duration": 0,
          "comparator": 0,
          "cancellation_fee": "500",
          "applicable_order_status": [
            2
          ]
        }
      ]
    },
    {
      "id": 13,
      "vendor_type_ids": "[1,3]",
      "vendor_type_names": [
        "Bike",
        "Van"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 13,
      "cancellation_reason": "Didn't get my preferred rider",
      "applicable_order_status": "[2,1]",
      "order_status_names": [
        "Before Confirmation",
        "After Confirmation"
      ],
      "date_created": "2021-04-23T08:37:09.000Z",
      "created_by": "Caleb Nasio",
      "admin_id": 361,
      "status": 1,
      "priority_key": 16,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": null
    },
    {
      "id": 39,
      "vendor_type_ids": "[1]",
      "vendor_type_names": [
        "Bike"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 67,
      "cancellation_reason": "Took too long to get rider",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-04-26T12:43:07.000Z",
      "created_by": "Lewis",
      "admin_id": 101,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": null
    },
    {
      "id": 61,
      "vendor_type_ids": "[1]",
      "vendor_type_names": [
        "Bike"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 61,
      "cancellation_reason": "Carol testing1",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-04-28T13:39:51.000Z",
      "created_by": "Caroline Mbae",
      "admin_id": 402,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": [
        {
          "action_type": 2,
          "duration": 0,
          "comparator": 0,
          "cancellation_fee": "100",
          "applicable_order_status": [
            1
          ]
        }
      ]
    },
    {
      "id": 73,
      "vendor_type_ids": "[1,12]",
      "vendor_type_names": [
        "Bike",
        "tuk tuk"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 73,
      "cancellation_reason": "The order was wrongly placed",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-04-29T11:58:00.000Z",
      "created_by": "Caleb Nasio",
      "admin_id": 361,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": null
    },
    {
      "id": 74,
      "vendor_type_ids": "[1,12]",
      "vendor_type_names": [
        "Bike",
        "tuk tuk"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 74,
      "cancellation_reason": "This is not test reason",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-04-29T12:05:52.000Z",
      "created_by": "Caleb Nasio",
      "admin_id": 361,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": null
    },
    {
      "id": 76,
      "vendor_type_ids": "[1]",
      "vendor_type_names": [
        "Bike"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 104,
      "cancellation_reason": "Partner Taking Long to Arrive_TestTim",
      "applicable_order_status": "[1,2,3]",
      "order_status_names": [
        "Before Confirmation",
        "After Confirmation",
        "After Arrival At Pick Up"
      ],
      "date_created": "2021-04-29T19:06:58.000Z",
      "created_by": "Timothy Omare",
      "admin_id": 106,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": [
        {
          "action_type": 2,
          "applicable_order_status": [
            1
          ],
          "comparator": 0,
          "duration": 0,
          "cancellation_fee": "200",
          "currency": "KES"
        }
      ]
    },
    {
      "id": 83,
      "vendor_type_ids": "[1]",
      "vendor_type_names": [
        "Bike"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 83,
      "cancellation_reason": "the order is not ready",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-05-04T07:42:44.000Z",
      "created_by": "Caleb Nasio",
      "admin_id": 361,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": null
    },
    {
      "id": 87,
      "vendor_type_ids": "[1]",
      "vendor_type_names": [
        "Bike"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 87,
      "cancellation_reason": "Carol test1 and 2 and 3",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-05-11T08:47:11.000Z",
      "created_by": "Caroline Mbae",
      "admin_id": 402,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": null
    },
    {
      "id": 90,
      "vendor_type_ids": "[1]",
      "vendor_type_names": [
        "Bike"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 90,
      "cancellation_reason": "caroline test 1and 2! ",
      "applicable_order_status": "[2,1]",
      "order_status_names": [
        "Before Confirmation",
        "After Confirmation"
      ],
      "date_created": "2021-05-11T10:11:38.000Z",
      "created_by": "Timothy Omare",
      "admin_id": 106,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": null
    },
    {
      "id": 93,
      "vendor_type_ids": "[1,21,12,2,3,6,10,13,14,17,18,19,20,25]",
      "vendor_type_names": [
        "10T Truck",
        "14T Truck",
        "20T Truck",
        "24T Truck",
        "28T Truck",
        "3T Truck",
        "5T Truck",
        "7T Truck",
        "Bike",
        "Freight",
        "Pick Up",
        "Runner",
        "tuk tuk",
        "Van"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 120,
      "cancellation_reason": "Not Ready with the Order",
      "applicable_order_status": "[1,2,3]",
      "order_status_names": [
        "Before Confirmation",
        "After Confirmation",
        "After Arrival At Pick Up"
      ],
      "date_created": "2021-05-20T19:52:23.000Z",
      "created_by": "Timothy Omare",
      "admin_id": 106,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CUSTOMER\"]",
      "actions": [
        {
          "action_type": 1,
          "message": "pole to hear the order is not ready. Worry not, you can change pickup time.",
          "applicable_order_status": [
            1
          ]
        }
      ]
    },
    {
      "id": 94,
      "vendor_type_ids": "[1]",
      "vendor_type_names": [
        "Bike"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 94,
      "cancellation_reason": "CaroTest1",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-05-21T08:34:03.000Z",
      "created_by": "Caroline Mbae",
      "admin_id": 402,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": null
    },
    {
      "id": 95,
      "vendor_type_ids": "[1,21]",
      "vendor_type_names": [
        "Bike",
        "Runner"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 95,
      "cancellation_reason": "CCarol Test1",
      "applicable_order_status": "[1,3]",
      "order_status_names": [
        "Before Confirmation",
        "After Arrival At Pick Up"
      ],
      "date_created": "2021-05-21T11:52:56.000Z",
      "created_by": "Caroline Mbae",
      "admin_id": 402,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CC\",\"CUSTOMER\"]",
      "actions": null
    },
    {
      "id": 100,
      "vendor_type_ids": "[1]",
      "vendor_type_names": [
        "Bike"
      ],
      "country_code": "KE",
      "cancellation_reason_id": 127,
      "cancellation_reason": "Driver is so so far test",
      "applicable_order_status": "[1]",
      "order_status_names": [
        "Before Confirmation"
      ],
      "date_created": "2021-05-27T18:35:00.000Z",
      "created_by": "Timothy Omare",
      "admin_id": 106,
      "status": 1,
      "priority_key": 18,
      "allow_platform": "[\"CUSTOMER\"]",
      "actions": [
        {
          "action_type": 1,
          "message": "This message should show when driver is so so fas reason is selected. You can also reschedule the order",
          "applicable_order_status": [
            1
          ]
        }
      ]
    }
  ]
};
