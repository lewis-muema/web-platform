import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    mode: 'history',
    routes: [
        { path: '/', component: () => import('./components/Home.vue') },
        { path: '/auth', component: () => import('./components/Auth.vue'),
          children: [
            {
              path: '/',
              component: () => import('./components/SignIn.vue')
            },
            {
              path: 'sign_up',
              component: () => import('./components/SignUp.vue')
            },
            {
              path: 'forgot_password',
              component: () => import('./components/ForgotPassword.vue')
            },
            {
              path: 'reset_password',
              component: () => import('./components/ResetPassword.vue')
            },
          ]
        }
    ]
  })
}
