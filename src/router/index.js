import Vue from "vue";
import Router from "vue-router";
import store from "../store/global";
Vue.use(Router);

let entryUrl = null;

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }

  return true;
}

function guard(to, from, next) {
  return new Promise((resolve, reject) => {
    let session = store.state.session;
    if (isEmpty(session)) {
      if (process.browser) {
        //read ls here
        let _sessionSnack = localStorage.getItem("_sessionSnack");

        if (isEmpty(_sessionSnack)) {
          resolve(next("/auth/sign_in"));
        } else {
          session = JSON.parse(_sessionSnack);
          store.state.session = session;
          let analytics_env = '';
          try{
              analytics_env = process.env.CONFIGS_ENV.ENVIRONMENT;
          }
          catch(er){

          }
          if('default' in session && analytics_env === 'production'){
            let acc = session[session.default];
            mixpanel.identify(acc.user_email);
          }
          resolve(next());
        }
      } else {
        resolve(next());
      }
    } else {
      resolve(next());
      let analytics_env = '';
      try{
          analytics_env = process.env.CONFIGS_ENV.ENVIRONMENT;
      }
      catch(er){

      }
      if( analytics_env === 'production'){
        let acc = session.default;
        if ('innerTrack' in to.meta) {
          let details = to.meta.innerTrack;
          if (details !== 'undefined') {
            mixpanel.track(details , {
              'Client Type': 'Web Platform',
              'Account Type': acc === 'peer' ? 'Personal' : 'Business',
            });

          }
        }
      }
    }
  });
}

function login_guard(to, from, next) {
  return new Promise((resolve, reject) => {
    let session = store.state.session;

    if (isEmpty(session)) {
      if (process.browser) {
        //read ls here
        let _sessionSnack = localStorage.getItem("_sessionSnack");

        if (isEmpty(_sessionSnack)) {
          resolve(next());
          if('login' in to.meta){
            let details = to.meta.login ;
            if(details !== 'undefined'){
              let analytics_env = '';
              try{
                  analytics_env = process.env.CONFIGS_ENV.ENVIRONMENT;
              }
              catch(er){

              }
              // let path = window.location.href;
              if(analytics_env === 'production'){
                mixpanel.track(details , {
                  'Client Type': 'Web Platform',
                });
              }

            }
          }
        } else {
          session = JSON.parse(_sessionSnack);
          store.state.session = session;
          resolve(next("/orders"));
        }
      } else {
        resolve(next());
      }
    } else {
      resolve(next());
    }
  });
}

export function createRouter() {
  const router = new Router({
    mode: "history",
    routes: [
      { path: "*", redirect: "/auth" },
      {
        path: "/auth",
        component: () => import("../modules/auth/Auth.vue"),
        beforeEnter: login_guard,
        children: [
          {
            path: "/",
            component: () => import("../modules/auth/components/SignIn.vue"),
            beforeEnter: login_guard,
            meta: {login: 'Sign In Page'}
          },
          {
            path: "/auth/sign_in",
            name: "sign_in",
            component: () => import("../modules/auth/components/SignIn.vue"),
            beforeEnter: login_guard,
            meta: {login: 'Sign In Page'}
          },
          {
            path: "/auth/sign_up",
            component: () => import("../modules/auth/components/SignUp.vue"),
            beforeEnter: login_guard,
            meta: {login: 'Sign Up Page'}
          },
          {
            path: "/auth/forgot_password",
            component: () =>
              import("../modules/auth/components/ForgotPassword.vue")
          },
          {
            path: "/auth/reset_password/:content",
            component: () =>
              import("../modules/auth/components/ResetPassword.vue")
          },
          {
            path: "/auth/sign_up_verification",
            component: () =>
              import("../modules/auth/components/SignUpVerification.vue"),
            beforeEnter: login_guard,
            meta: {login: 'Sign Up Verification Page'}
          }
        ]
      },
      {
        path: "/transactions",
        component: () => import("../modules/transactions/Transactions.vue"),
        beforeEnter: guard,
        meta: {innerTrack: 'Order History Page'},
        children: [
          {
            path: "/",
            component: () =>
              import("../modules/transactions/_components/OrderHistory.vue"),
            meta: {innerTrack: 'Order History Page'},
          },
          {
            path: "/transactions/order_history",
            component: () =>
              import("../modules/transactions/_components/OrderHistory.vue"),
            meta: {innerTrack: 'Order History Page'},
            children: [
              {
                path: "details/:id",
                name: "order-details",
                component: () =>
                  import("../modules/transactions/_components/OrderDetails.vue")
              }
            ]
          },
          {
            path: "/transactions/statement",
            component: () =>
              import("../modules/transactions/_components/Statement.vue")
          },
          {
            path: "/transactions/payments",
            component: () =>
              import("../modules/transactions/_components/Payments.vue")
          }
        ]
      },
      {
        path: "/admin",
        component: () => import("../modules/admin/Admin.vue"),
        beforeEnter: guard,
        children: [
          {
            path: "/",
            component: () => import("../modules/admin/components/Users.vue")
          },
          {
            path: "/admin/users",
            component: () => import("../modules/admin/components/Users.vue"),
            children: [
              {
                path: "/",
                component: () =>
                  import("../modules/admin/components/users/ListUsers.vue")
              },
              {
                path: "/admin/users/add_user",
                name: "adminAddUser",
                component: () =>
                  import("../modules/admin/components/users/AddUser.vue")
              },
              {
                path: "/admin/users/edit_user/:id",
                component: () =>
                  import("../modules/admin/components/users/EditUser.vue")
              }
            ]
          },
          {
            path: "/admin/department",
            component: () =>
              import("../modules/admin/components/Departments.vue")
          },
          {
            path: "/admin/department/add_department",
            component: () =>
              import("../modules/admin/components/AddDepartment.vue")
          },
          {
            path: "/admin/department/edit_department/:id",
            component: () =>
              import("../modules/admin/components/EditDepartment.vue")
          },
          {
            path: "/admin/preferences",
            component: () =>
              import("../modules/admin/components/Preferences.vue")
          },
          {
            path: "/admin/api",
            component: () => import("../modules/admin/components/API.vue")
          },
          {
            path: '/admin/company_details',
            component: () => import('../modules/admin/components/CompanyDetails.vue')
          }
        ]
      },
      {
        path: "/analytics",
        component: () => import("../modules/analytics/Analytics.vue"),
        beforeEnter: guard,
        children: [
          {
            path: "/",
            component: () =>
              import("../modules/analytics/components/Weekly.vue")
          },
          {
            path: "/analytics/weekly",
            component: () =>
              import("../modules/analytics/components/Weekly.vue")
          },
          {
            path: "/analytics/monthly",
            component: () =>
              import("../modules/analytics/components/Monthly.vue")
          }
        ]
      },
      {
        path: "/payment",
        component: () => import("../modules/payment/Payment.vue"),
        beforeEnter: guard,
        children: [
          {
            path: "/",
            component: () =>
              import("../modules/payment/_components/MpesaComponent.vue")
          },
          {
            path: "mpesa",
            component: () =>
              import("../modules/payment/_components/MpesaComponent.vue"),
            name: "mpesa_payment"
          },
          {
            path: "card",
            component: () =>
              import("../modules/payment/_components/CardComponent.vue"),
            name: "card_payment"
          },
          {
            path: "promo",
            component: () =>
              import("../modules/payment/_components/PromoComponent.vue"),
            name: "promo_payment"
          }
        ]
      },
      {
        path: "/orders",
        component: () => import("../modules/orders/Orders.vue"),
        beforeEnter: guard,
        meta: {innerTrack: 'Order Placement Page'},
        children: [
          {
            path: "/",
            component: () =>
              import("../modules/orders/_components/order_placement/Home.vue"),
            alias: "/orders/home",
            name: "order_placement",
            meta: {innerTrack: 'Order Placement Page'},
          },
          {
            path: "/orders/tracking/:order_no",
            component: () =>
              import("../modules/orders/_components/tracking/Tracking.vue"),
            name: "tracking",
            beforeEnter: guard,
            meta: {innerTrack: 'Tracking Page'},
          },
          {
            path: "/orders/rating/:order_no",
            component: () =>
              import("../modules/orders/_components/rating/Rating.vue"),
            meta: {innerTrack: 'Rating Page'},
          }
        ]
      },
      {
        path: "/user",
        component: () => import("../modules/user/User.vue"),
        beforeEnter: guard,
        children: [
          {
            path: "/",
            component: () => import("../modules/user/_components/Profile.vue"),
            redirect: "/user/profile/personal_information"
          },
          {
            path: "/user/profile",
            component: () => import("../modules/user/_components/Profile.vue"),
            children: [
              {
                path: "/",
                component: () =>
                  import("../modules/user/_components/PersonalInfo.vue"),
                alias: "personal_information"
              },
              {
                path: "personal_information",
                component: () =>
                  import("../modules/user/_components/PersonalInfo.vue")
              },
              {
                path: "change_password",
                component: () =>
                  import("../modules/user/_components/ChangePassword.vue")
              }
            ]
          },
          {
            path: "/user/free_deliveries",
            component: () =>
              import("../modules/user/_components/FreeDeliveries.vue")
          }
        ]
      },
      {
        path: "/external/onboard/:type/:content/:tag",
        component: () => import("../modules/external/External.vue")
      },
      {
        path: "/external",
        component: () => import("../modules/external/ExternalTracking.vue"),
        children: [
          {
            path: "/external/tracking/:order_no",
            component: () =>
              import("../modules/orders/_components/tracking/Tracking.vue"),
            name: "tracking_external"
          },
          {
            path: "/external/rating/:order_no",
            component: () =>
              import("../modules/orders/_components/rating/Rating.vue")
          }
        ]
      },
    ]
  });

  return router;
}
