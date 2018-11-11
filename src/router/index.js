import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
      { path: '*', redirect: '/auth' },
      { path: '/auth', component: () => import('../components/Auth.vue'),
        children: [
          {
            path: '/',
            component: () => import('../components/SignIn.vue')
          },
          {
            path: '/auth/sign_up',
            component: () => import('../components/SignUp.vue')
          },
          // {
          //   path: 'sign_up',
          //   component: () => import('./components/SignUp.vue')
          // },
          // {
          //   path: 'forgot_password',
          //   component: () => import('./components/ForgotPassword.vue')
          // },
          // {
          //   path: 'reset_password',
          //   component: () => import('./components/ResetPassword.vue')
          // },
        ]
      },
      { path: '/transactions', component: () => import('../modules/transactions/Transactions.vue'),
        children: [
            {
              path: '/',
              component: () => import('../modules/transactions/_components/OrderHistory.vue')
            },
            {
              path: '/transactions/order_history',
              component: () => import('../modules/transactions/_components/OrderHistory.vue')
            },
            {
              path: '/transactions/statement',
              component: () => import('../modules/transactions/_components/Statement.vue')
            },
            {
              path: '/transactions/payments',
              component: () => import('../modules/transactions/_components/Payments.vue')
            },
        ]
      },
      { path: '/admin', component: () => import('../modules/admin/Admin.vue'),
        children: [
            {
              path: '/',
              component: () => import('../modules/admin/components/Users.vue')
            },
            {
              path: '/admin/users',
              component: () => import('../modules/admin/components/Users.vue')
            },
            {
              path: '/admin/department',
              component: () => import('../modules/admin/components/Departments.vue')
            },
            {
              path: '/admin/preferences',
              component: () => import('../modules/admin/components/Preferences.vue')
            },
            {
              path: '/admin/api',
              component: () => import('../modules/admin/components/API.vue')
            },
        ]
      },
      { path: '/analytics', component: () => import('../modules/analytics/Analytics.vue'),
        children: [
            {
              path: '/',
              component: () => import('../modules/analytics/components/Weekly.vue')
            },
            {
              path: '/analytics/weekly',
              component: () => import('../modules/analytics/components/Weekly.vue')
            },
            {
              path: '/analytics/monthly',
              component: () => import('../modules/analytics/components/Monthly.vue')
            },
        ]
      },
      // { path: '/auth', component: () => import('../modules/auth/Auth.vue'),
      // },
      { path: '/orders', component: () => import('../modules/orders/Orders.vue'),
      },
    ]
  })
}
