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
      { path: '/transactions', component: () => import('../modules/transactions/Transactions.vue')},
      { path: '/admin', component: () => import('../modules/admin/Admin.vue'),
      },
      // { path: '/auth', component: () => import('../modules/auth/Auth.vue'),
      // },
      { path: '/orders', component: () => import('../modules/orders/Orders.vue'),
      },
    ]
  })
}
