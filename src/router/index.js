import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/global';
Vue.use(Router);

let entryUrl = null;

function isEmpty(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }

  return true;
}

function getSessionCookie()   {

  var nameEQ = "_sessionSnack" + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0){

        } return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function guard(to, from, next){

  return new Promise((resolve, reject) => {
     let session = store.state.session;

      console.log('the guard is executing');
      console.log(session);

      console.log(isEmpty(session));

      if(isEmpty(session)){

        console.log('empty session here');

        if (process.browser) {
          //read cookies here
            let _sessionSnack = getSessionCookie();
            console.log(_sessionSnack);

            if(_sessionSnack !== null && _sessionSnack !== ''){
              session = JSON.parse(_sessionSnack);
              store.state.session = session;
            }
            if (isEmpty(session) == true) {
              console.log('router-message', 'user not logged in');
               resolve(next('/auth/sign_in'));
            } else {
              console.log('session is updated');
              resolve(next());
            }


        } else {
          resolve(next())
        }

      } else {
        console.log('session is okay');
        resolve(next());
      }
    })
}





export function createRouter () {
  const router =  new Router({
    mode: 'history',
    routes: [
      { path: '*', redirect: '/auth' },
      { path: '/auth', component: () => import('../modules/auth/Auth.vue'),
        children: [
          {
            path: '/',
            component: () => import('../modules/auth/components/SignIn.vue')
          },
          {
            path: '/auth/sign_in',
            name: 'sign_in',
            component: () => import('../modules/auth/components/SignIn.vue')
          },
          {
            path: '/auth/sign_up',
            component: () => import('../modules/auth/components/SignUp.vue')
          },
          {
            path: '/auth/forgot_password',
            component: () => import('../modules/auth/components/ForgotPassword.vue')
          },
          {
            path: '/auth/reset_password',
            component: () => import('../modules/auth/components/ResetPassword.vue')
          },
        ]
      },
      { path: '/transactions',
        component: () => import('../modules/transactions/Transactions.vue'),
        beforeEnter: guard,
        children: [
            {
              path: '/',
              component: () => import('../modules/transactions/_components/OrderHistory.vue'),
            },
            {
              path: '/transactions/order_history',
              component:() => import('../modules/transactions/_components/OrderHistory.vue'),
              children: [
                {
                  path: 'details/:id',
                  name:'order-details',
                  component: () => import('../modules/transactions/_components/OrderDetails.vue'),

                },
              ]
            },
            {
              path: '/transactions/statement',
              component: () => import('../modules/transactions/_components/Statement.vue'),

            },
            {
              path: '/transactions/payments',
              component: () => import('../modules/transactions/_components/Payments.vue'),
            },
        ]
      },
      { path: '/admin', component: () => import('../modules/admin/Admin.vue'),
        beforeEnter: guard,
        children: [
            {
              path: '/',
              component: () => import('../modules/admin/components/Users.vue')
            },
            {
              path: '/admin/users',
              component: () => import('../modules/admin/components/Users.vue'),
              children: [
                  {
                      path: '/',
                      component: () => import('../modules/admin/components/users/ListUsers.vue')
                  },
                  {
                      path: '/admin/users/add_user',
                      name:'adminAddUser',
                      component: () => import('../modules/admin/components/users/AddUser.vue')
                  },
                  {
                      path: '/admin/users/edit_user/:id',
                      component: () => import('../modules/admin/components/users/EditUser.vue')
                  },
              ]
            },
            {
              path: '/admin/department',
              component: () => import('../modules/admin/components/Departments.vue')
            },
            {
              path: '/admin/department/add_department',
              component: () => import('../modules/admin/components/AddDepartment.vue')
            },
            {
              path: '/admin/department/edit_department/:id',
              component: () => import('../modules/admin/components/EditDepartment.vue')
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
      beforeEnter: guard,
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
      { path: '/payment', component: () => import('../modules/payment/Payment.vue'),
      beforeEnter: guard,
        children: [
            {
              path: '/',
              component: () => import('../modules/payment/_components/MpesaComponent.vue')
            },
            {
              path: 'mpesa',
              component: () => import('../modules/payment/_components/MpesaComponent.vue'),
              name:'mpesa_payment'
            },
            {
              path: 'card',
              component: () => import('../modules/payment/_components/CardComponent.vue'),
              name:'card_payment'
            },
            {
              path: 'promo',
              component: () => import('../modules/payment/_components/PromoComponent.vue'),
              name:'promo_payment'
            },
        ]
      },
      { path: '/orders', component: () => import('../modules/orders/Orders.vue'),
      beforeEnter: guard,
          children: [
              {
                path: '/',
                component: () => import('../modules/orders/_components/order_placement/Home.vue'),
                alias: '/orders/home',
                name: 'order_placement'
              },
              {
                path: '/orders/tracking/:order_no',
                component: () => import('../modules/orders/_components/tracking/Tracking.vue'),
                name: 'tracking',
              },
              {
                  path: '/orders/rating',
                  component: () => import('../modules/orders/_components/rating/Rating.vue')
              }
          ]
      },
      { path: '/user', component: () => import('../modules/user/User.vue'),
      beforeEnter: guard,
          children: [
              {
                path: '/',
                component: () => import('../modules/user/_components/Profile.vue'),
                redirect:'/user/profile/personal_information'
              },
              {
                path: '/user/profile',
                component: () => import('../modules/user/_components/Profile.vue'),
                    children: [
                     {
                       path: '/',
                       component: () => import('../modules/user/_components/PersonalInfo.vue'),
                       alias : 'personal_information'
                     },
                     {
                       path: 'personal_information',
                       component: () => import('../modules/user/_components/PersonalInfo.vue')
                     },
                     {
                       path: 'change_password',
                       component: () => import('../modules/user/_components/ChangePassword.vue')
                     },
                   ]
              },
              {
                path: '/user/free_deliveries',
                component: () => import('../modules/user/_components/FreeDeliveries.vue')
              },

          ]
      },
      { path: '/external/onboard/:token', component: () => import('../modules/external/External.vue'),
      }
    ]
  });


  return router;


}
