/* eslint no-restricted-syntax: ["error", "WithStatement"] */
/* global mixpanel  */
/* eslint no-undef: "error" */
/* eslint no-underscore-dangle: ["error", { "allow": ["_sessionSnack"] }] */
/* eslint-disable import/prefer-default-export */

import Vue from 'vue';
import Router from 'vue-router';
import store from '../store/global';

Vue.use(Router);

function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) return false;
  }

  return true;
}

function guard(to, from, next) {
  return new Promise((resolve) => {
    let { session } = store.state;
    if (isEmpty(session)) {
      if (process.browser) {
        // read ls here
        const _sessionSnack = localStorage.getItem('_sessionSnack');
        let userState = true;
        if (typeof _sessionSnack === 'string') {
          userState = _sessionSnack.includes('peer');
        }

        if (isEmpty(_sessionSnack) || _sessionSnack === null || !userState) {
          resolve(next('/auth/sign_in'));
        } else {
          session = JSON.parse(_sessionSnack);
          store.state.session = session;
          let analyticsEnv = '';
          try {
            analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
          } catch (er) {
            // empty
          }
          if ('default' in session && analyticsEnv === 'production') {
            const acc = session[session.default];
            mixpanel.identify(acc.user_email);
          }
          resolve(next());
        }
      } else {
        resolve(next());
      }
    } else {
      resolve(next());
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // empty
      }
      if (analyticsEnv === 'production') {
        if ('innerTrack' in to.meta) {
          const details = to.meta.innerTrack;
          if (details !== 'undefined') {
            mixpanel.track(details, {
              'Client Type': 'Web Platform',
              'Account Type': session.default === 'peer' ? 'Personal' : 'Business',
            });
          }
        }
      }
    }
  });
}

function loginGuard(to, from, next) {
  return new Promise((resolve) => {
    let { session } = store.state;

    if (isEmpty(session)) {
      if (process.browser) {
        // read ls here
        const _sessionSnack = localStorage.getItem('_sessionSnack');
        let userState = true;
        if (typeof _sessionSnack === 'string') {
          userState = _sessionSnack.includes('peer');
        }
        if (isEmpty(_sessionSnack) || _sessionSnack === null || !userState) {
          resolve(next());
          if ('login' in to.meta) {
            const details = to.meta.login;
            if (details !== 'undefined') {
              let analyticsEnv = '';
              try {
                analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
              } catch (er) {
                // empty
              }
              // let path = window.location.href;
              if (analyticsEnv === 'production') {
                mixpanel.track(details, {
                  'Client Type': 'Web Platform',
                });
              }
            }
          }
        } else {
          session = JSON.parse(_sessionSnack);
          store.state.session = session;
          resolve(next('/orders'));
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
    mode: 'history',
    routes: [
      { path: '*', redirect: '/auth' },
      {
        path: '/auth',
        component: () => import('../modules/auth/Auth.vue'),
        beforeEnter: loginGuard,
        children: [
          {
            path: '/',
            component: () => import('../modules/auth/components/SignIn.vue'),
            beforeEnter: loginGuard,
            meta: { login: 'Sign In Page' },
          },
          {
            path: '/auth/sign_in',
            name: 'sign_in',
            component: () => import('../modules/auth/components/SignIn.vue'),
            beforeEnter: loginGuard,
            meta: { login: 'Sign In Page' },
          },
          {
            path: '/auth/sign_up',
            component: () => import('../modules/auth/components/SignUp.vue'),
            beforeEnter: loginGuard,
            meta: { login: 'Sign Up Page' },
          },
          {
            path: '/auth/forgot_password',
            component: () => import('../modules/auth/components/ForgotPassword.vue'),
          },
          {
            path: '/auth/reset_password/:content',
            component: () => import('../modules/auth/components/ResetPassword.vue'),
          },
          {
            path: '/auth/sign_up_verification',
            component: () => import('../modules/auth/components/SignUpVerification.vue'),
            beforeEnter: loginGuard,
            meta: { login: 'Sign Up Verification Page' },
          },
          {
            path: '/auth/by_pass',
            name: 'by_pass',
            component: () => import('../modules/auth/components/ByPassLogin.vue'),
            beforeEnter: loginGuard,
            meta: { login: 'By Pass Login Page' },
          },
        ],
      },
      {
        path: '/transactions',
        component: () => import('../modules/transactions/Transactions.vue'),
        beforeEnter: guard,
        meta: { innerTrack: 'Order History Page' },
        children: [
          {
            path: '/',
            component: () => import('../modules/transactions/_components/OrderHistory.vue'),
            meta: { innerTrack: 'Order History Page' },
          },
          {
            path: '/transactions/order_history',
            component: () => import('../modules/transactions/_components/OrderHistory.vue'),
            meta: { innerTrack: 'Order History Page' },
            children: [
              {
                path: 'details/:id',
                name: 'order-details',
                component: () => import('../modules/transactions/_components/OrderDetails.vue'),
              },
            ],
          },
          {
            path: '/transactions/statement',
            component: () => import('../modules/transactions/_components/Statement.vue'),
          },
          {
            path: '/transactions/payments',
            component: () => import('../modules/transactions/_components/Payments.vue'),
          },
        ],
      },
      {
        path: '/admin',
        component: () => import('../modules/admin/Admin.vue'),
        beforeEnter: guard,
        children: [
          {
            path: '/',
            component: () => import('../modules/admin/components/Users.vue'),
          },
          {
            path: '/admin/users',
            component: () => import('../modules/admin/components/Users.vue'),
            children: [
              {
                path: '/',
                component: () => import('../modules/admin/components/users/ListUsers.vue'),
              },
              {
                path: '/admin/users/add_user',
                name: 'adminAddUser',
                component: () => import('../modules/admin/components/users/AddUser.vue'),
              },
              {
                path: '/admin/users/edit_user/:id',
                component: () => import('../modules/admin/components/users/EditUser.vue'),
              },
            ],
          },
          {
            path: '/admin/department',
            component: () => import('../modules/admin/components/Departments.vue'),
          },
          {
            path: '/admin/department/add_department',
            component: () => import('../modules/admin/components/AddDepartment.vue'),
          },
          {
            path: '/admin/department/edit_department/:id',
            component: () => import('../modules/admin/components/EditDepartment.vue'),
          },
          {
            path: '/admin/preferences',
            component: () => import('../modules/admin/components/Preferences.vue'),
          },
          {
            path: '/admin/api',
            component: () => import('../modules/admin/components/API.vue'),
          },
          {
            path: '/admin/company_details',
            component: () => import('../modules/admin/components/CompanyDetails.vue'),
          },
        ],
      },
      {
        path: '/analytics',
        component: () => import('../modules/analytics/Analytics.vue'),
        beforeEnter: guard,
        children: [
          {
            path: '/',
            component: () => import('../modules/analytics/components/Weekly.vue'),
          },
          {
            path: '/analytics/report',
            component: () => import('../modules/analytics/components/Weekly.vue'),
          },
        ],
      },
      {
        path: '/payment',
        component: () => import('../modules/payment/Payment.vue'),
        beforeEnter: guard,
        children: [
          {
            path: '/',
            component: () => import('../modules/payment/_components/CardComponent.vue'),
          },
          {
            path: 'mpesa',
            component: () => import('../modules/payment/_components/MpesaComponent.vue'),
            name: 'mpesa_payment',
          },
          {
            path: 'card',
            component: () => import('../modules/payment/_components/CardComponent.vue'),
            name: 'card_payment',
          },
          {
            path: 'carte',
            component: () => import('../modules/payment/_components/CardComponent.vue'),
            name: 'carte',
          },
          {
            path: 'promocode',
            component: () => import('../modules/payment/_components/PromoComponent.vue'),
            name: 'promo_payment',
          },
          {
            path: 'codepromo',
            component: () => import('../modules/payment/_components/PromoComponent.vue'),
            name: 'codepromo',
          },
        ],
      },
      {
        path: '/orders',
        component: () => import('../modules/orders/Orders.vue'),
        beforeEnter: guard,
        meta: { innerTrack: 'Order Placement Page' },
        children: [
          {
            path: '/',
            component: () => import('../modules/orders/_components/order_placement/Home.vue'),
            alias: '/orders/home',
            name: 'order_placement',
            meta: { innerTrack: 'Order Placement Page' },
          },
          {
            path: '/orders/dedicated/no-destination',
            component: () => import('../modules/orders/_components/order_placement/DedicatedModelNoDestination.vue'),
            name: 'dedicated_no_destination_order_placement',
            meta: { innerTrack: 'Dedicated No Destination Order Placement Page' },
          },
          {
            path: '/orders/dedicated/multi-destination',
            component: () => import('../modules/orders/_components/order_placement/DedicatedModelMultiDestination.vue'),
            name: 'dedicated_multi_destination_order_placement',
            meta: { innerTrack: 'Dedicated Multi Destination Order Placement Page' },
          },
          {
            path: '/orders/freight',
            component: () => import('../modules/orders/_components/order_placement/Freight.vue'),
            name: 'freight_order_placement',
            meta: { innerTrack: 'Freight Order Placement Page' },
          },
          {
            path: '/orders/freight/tracking/:order_no',
            component: () => import('../modules/orders/_components/tracking/FBUTracking.vue'),
            name: 'freight_order_tracking',
            beforeEnter: guard,
            meta: { innerTrack: 'Freight Order Tracking Page' },
          },
          {
            path: '/orders/tracking/:order_no',
            component: () => import('../modules/orders/_components/tracking/Tracking.vue'),
            name: 'tracking',
            beforeEnter: guard,
            meta: { innerTrack: 'Tracking Page' },
          },
          {
            path: '/orders/rating/:order_no',
            component: () => import('../modules/orders/_components/rating/Rating.vue'),
            name: 'rating',
            meta: { innerTrack: 'Rating Page' },
          },
        ],
      },
      {
        path: '/freight',
        component: () => import('../modules/freight/Home.vue'),
        beforeEnter: guard,
        meta: { innerTrack: 'Freight Home Page' },
        children: [
          {
            path: '/',
            component: () => import('../modules/freight/Home.vue'),
            name: 'freight_home',
          },
          {
            path: '/freight/set-up',
            component: () => import('../modules/freight/Freight.vue'),
            name: 'freight_set_up',
          },
          {
            path: '/freight/verify',
            component: () => import('../modules/freight/VerifyComponent.vue'),
            name: 'freight_verify',
          },
          {
            path: '/freight/dashboard',
            component: () => import('../modules/freight/_components/MainComponent.vue'),
            children: [
              {
                path: '/',
                component: () => import('../modules/freight/_components/DashboardComponent.vue'),
                name: 'freight_dashboard',
              },
              {
                path: '/freight/transporters',
                component: () => import('../modules/freight/_components/TransportersComponent.vue'),
                name: 'freight_transporters',
              },
              {
                path: '/freight/transporters/info/:id',
                component: () => import('../modules/freight/_components/TransportersDetailsComponent.vue'),
                name: 'freight_transporters_details',
              },
              {
                path: '/freight/orders',
                component: () => import('../modules/freight/_components/OrdersComponent.vue'),
                name: 'freight_orders',
              },
              {
                path: '/freight/orders/create',
                component: () => import('../modules/freight/_components/CreateFreightOrder.vue'),
                name: 'freight_create_orders',
              },
              {
                path: '/freight/orders/info/:id',
                component: () => import('../modules/freight/_components/OrdersDetailsComponent.vue'),
                name: 'freight_orders_info',
              },
              {
                path: '/freight/settings',
                component: () => import('../modules/freight/_components/SettingsComponent.vue'),
                name: 'freight_settings',
              },
            ],
          },
        ],
      },

      {
        path: '/user',
        component: () => import('../modules/user/User.vue'),
        beforeEnter: guard,
        children: [
          {
            path: '/',
            component: () => import('../modules/user/_components/Profile.vue'),
            redirect: '/user/profile/personal_information',
          },
          {
            path: '/user/profile',
            component: () => import('../modules/user/_components/Profile.vue'),
            children: [
              {
                path: '/',
                component: () => import('../modules/user/_components/PersonalInfo.vue'),
                alias: 'personal_information',
              },
              {
                path: 'personal_information',
                component: () => import('../modules/user/_components/PersonalInfo.vue'),
              },
              {
                path: 'change_password',
                component: () => import('../modules/user/_components/ChangePassword.vue'),
              },
              {
                path: 'change_language',
                component: () => import('../modules/user/_components/changeLanguage.vue'),
              },
            ],
          },
          {
            path: '/user/free_deliveries',
            component: () => import('../modules/user/_components/FreeDeliveries.vue'),
          },
          {
            path: '/user/upgrade_acc',
            component: () => import('../modules/user/_components/UpgradeAccount.vue'),
          },
        ],
      },
      {
        path: '/external/onboard/:type/:content/:tag',
        component: () => import('../modules/external/External.vue'),
      },
      {
        path: '/external',
        component: () => import('../modules/external/ExternalTracking.vue'),
        children: [
          {
            path: '/external/tracking/:order_no',
            component: () => import('../modules/orders/_components/tracking/Tracking.vue'),
            name: 'tracking_external',
          },
          {
            path: '/external/rating/:order_no',
            component: () => import('../modules/orders/_components/rating/Rating.vue'),
          },
        ],
      },
    ],
  });

  return router;
}
