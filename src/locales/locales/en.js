import NPSFooter from '../footers/en/NPSFooter';
import mainHeader from '../headers/en/MainHeader';

import byPassLogin from '../auth/en/components/byPassLogin';
import forgetPassword from '../auth/en/components/forgetPassword';
import loadingComponent from '../auth/en/components/loadingComponent';
import resetPassword from '../auth/en/components/resetPassword';
import signIn from '../auth/en/components/signIn';
import signUp from '../auth/en/components/signUp';
import signUpDetails from '../auth/en/components/signUpDetails';
import signUpVerification from '../auth/en/components/signUpVerification';
import successComponent from '../auth/en/components/successComponent';
import promoCodeComponent from '../orders/en/components/orderPlacement/PromoCodesComponent';
import approvalDialogue from '../orders/en/components/social_media/approvalDialogue';
// admin
import endComponent from '../admin/en/components/users/invite_users/EndComponent';
import inviteComponent from '../admin/en/components/users/invite_users/inviteComponent';
import linkComponent from '../admin/en/components/users/invite_users/linkComponent';
import editUser from '../admin/en/components/users/editUser';
import listUser from '../admin/en/components/users/listUser';
import addDepartment from '../admin/en/components/addDepartment';
import api from '../admin/en/components/api';
import departments from '../admin/en/components/departments';
import editDepartment from '../admin/en/components/editDepartment';
import preferences from '../admin/en/components/preferences';
import admin from '../admin/en/admin';
import companyDetails from '../admin/en/components/companyDetails';
// analytics
import analytics from '../analytics/en/analytics';
// external component
import completeComponent from '../external/en/components/completeComponent';
import emailValidation from '../external/en/components/emailValidation';
import onboardingComponent from '../external/en/components/onboardingIngComponent';
import passwordValidation from '../external/en/components/passworValidationComponent';
import count from '../external/en/count';
// freight module
import createFreightOrder from '../freights/en/component/createFreightOrder';
import dashboardComponent from '../freights/en/component/dashboardComponent';
import FreightLoadingComponent from '../freights/en/component/loadingComponent';
import mainComponent from '../freights/en/component/mainComponent';
import ordersComponent from '../freights/en/component/ordersComponent';
import orderDetail from '../freights/en/component/ordersDetail';
import settingsComponent from '../freights/en/component/settingsComponent';
import transporterComponent from '../freights/en/component/transporterComponent';
import freight from '../freights/en/freight';
import verifyComponent from '../freights/en/verifyComponent';
import orderDetailsComponent from '../freights/en/component/orderDetailsComponent';

import genTranslationsEnglish from '../general/en';

const translations = {
  NPSFooter,
  mainHeader,
  byPassLogin,
  forgotPassword: forgetPassword,
  loadingComponent,
  resetPassword,
  signIn,
  signUp,
  signUpDetails,
  signUpVerification,
  successComponent,
  promoCodeComponent,
  approvalDialogue,
  endComponent,
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
  orderDetailsComponent,

  general: genTranslationsEnglish,
};

export default translations;
