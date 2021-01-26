import NPSFooter from '../en/NPSFooter';
import mainHeader from '../en/MainHeader';
import paymentMxn from '../en/payment_mixin';
import EndComponent from '../en/modules/admin/components/users/invite_users/EndComponent';
import inviteComponent from '../en/modules/admin/components/users/invite_users/inviteComponent';
import linkComponent from '../en/modules/admin/components/users/invite_users/linkComponent';
import editUser from '../en/modules/admin/components/users/editUser';
import listUser from '../en/modules/admin/components/users/listUser';
import addDepartment from '../en/modules/admin/components/addDepartment';
import api from '../en/modules/admin/components/api';
import departments from '../en/modules/admin/components/departments';
import editDepartment from '../en/modules/admin/components/editDepartment';
import preferences from '../en/modules/admin/components/preferences';
import admin from '../en/modules/admin/admin';
import companyDetails from '../en/modules/admin/components/companyDetails';
import analytics from '../en/modules/analytics/analytics';
import byPassLogin from '../en/modules/auth/components/byPassLogin';
import forgetPassword from '../en/modules/auth/components/forgetPassword';
import loadingComponent from '../en/modules/auth/components/loadingComponent';
import resetPassword from '../en/modules/auth/components/resetPassword';
import signIn from '../en/modules/auth/components/signIn';
import signUp from '../en/modules/auth/components/signUp';
import signUpDetails from '../en/modules/auth/components/signUpDetails';
import signUpVerification from '../en/modules/auth/components/signUpVerification';
import successComponent from '../en/modules/auth/components/successComponent';
import completeComponent from '../en/modules/external/components/completeComponent';
import emailValidation from '../en/modules/external/components/emailValidation';
import onboardingComponent from '../en/modules/external/components/onboardingIngComponent';
import passwordValidation from '../en/modules/external/components/passworValidationComponent';
import count from '../en/modules/external/count';
import createFreightOrder from '../en/modules/freights/component/createFreightOrder';
import dashboardComponent from '../en/modules/freights/component/dashboardComponent';
import FreightLoadingComponent from '../en/modules/freights/component/loadingComponent';
import mainComponent from '../en/modules/freights/component/mainComponent';
import ordersComponent from '../en/modules/freights/component/ordersComponent';
import orderDetail from '../en/modules/freights/component/ordersDetail';
import settingsComponent from '../en/modules/freights/component/settingsComponent';
import transporterComponent from '../en/modules/freights/component/transporterComponent';
import freight from '../en/modules/freights/freight';
import verifyComponent from '../en/modules/freights/verifyComponent';
import genTranslationsEnglish from '../en/general/en';


const translations = {

  message: {
    hello: 'こんにちは、世界',
  },
  npsFooter: NPSFooter,
  mainHeader,
  paymentMxn,
  endComponent: EndComponent,
  inviteComponent,
  linkComponent,
  editUser,
  listUsers: listUser,

  addDepartment,
  api,
  departments,
  editDepartment,
  preferences,
  admin,
  companyDetails,
  analytics,
  byPassLogin,
  forgotPassword: forgetPassword,
  loadingComponent,
  resetPassword,
  signIn,
  signUp,
  signUpDetails,
  signUpVerification,
  successComponent,
  completeComponent,
  emailValidation,
  onboardingComponent,
  passwordValidation,
  count,
  createFreightOrder,
  dashboardComponent,
  FreightLoadingComponent,
  mainComponent,
  ordersComponent,
  orderDetail,
  settingsComponent,
  transporterComponent,
  freight,
  verifyComponent,
  general: genTranslationsEnglish,

};

export default translations;
