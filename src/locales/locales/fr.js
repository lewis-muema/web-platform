import NPSFooter from '../fr/NPSFooter';
import mainHeader from '../fr/MainHeader';
import paymentMxn from '../fr/payment_mixin';
import EndComponent from '../fr/modules/admin/components/users/invite_users/EndComponent';
import inviteComponent from '../fr/modules/admin/components/users/invite_users/inviteComponent';
import linkComponent from '../fr/modules/admin/components/users/invite_users/linkComponent';
import editUser from '../fr/modules/admin/components/users/editUser';
import listUser from '../fr/modules/admin/components/users/listUser';
import addDepartment from '../fr/modules/admin/components/addDepartment';
import api from '../fr/modules/admin/components/api';
import departments from '../fr/modules/admin/components/departments';
import editDepartment from '../fr/modules/admin/components/editDepartment';
import preferences from '../fr/modules/admin/components/preferences';
import admin from '../fr/modules/admin/admin';
import companyDetails from '../fr/modules/admin/components/companyDetails';
import analytics from '../fr/modules/analytics/analytics';
import byPassLogin from '../fr/modules/auth/components/byPassLogin';
import forgetPassword from '../fr/modules/auth/components/forgetPassword';
import loadingComponent from '../fr/modules/auth/components/loadingComponent';
import resetPassword from '../fr/modules/auth/components/resetPassword';
import signIn from '../fr/modules/auth/components/signIn';
import signUp from '../fr/modules/auth/components/signUp';
import signUpDetails from '../fr/modules/auth/components/signUpDetails';
import signUpVerification from '../fr/modules/auth/components/signUpVerification';
import successComponent from '../fr/modules/auth/components/successComponent';
import completeComponent from '../fr/modules/external/components/completeComponent';
import emailValidation from '../fr/modules/external/components/emailValidation';
import onboardingComponent from '../fr/modules/external/components/onboardingIngComponent';
import passwordValidation from '../fr/modules/external/components/passworValidationComponent';
import count from '../fr/modules/external/count';
import createFreightOrder from '../fr/modules/freights/component/createFreightOrder';
import dashboardComponent from '../fr/modules/freights/component/dashboardComponent';
import FreightLoadingComponent from '../fr/modules/freights/component/loadingComponent';
import mainComponent from '../fr/modules/freights/component/mainComponent';
import ordersComponent from '../fr/modules/freights/component/ordersComponent';
import orderDetail from '../fr/modules/freights/component/ordersDetail';
import settingsComponent from '../fr/modules/freights/component/settingsComponent';
import transporterComponent from '../fr/modules/freights/component/transporterComponent';
import freight from '../fr/modules/freights/freight';
import verifyComponent from '../fr/modules/freights/verifyComponent';
import genFrenchTranslations from '../fr/general/fr';


const translations = {

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
  general: genFrenchTranslations,

};

export default translations;
