import NPSFooter from '../footers/fr/NPSFooter';
import mainHeader from '../headers/fr/MainHeader';

import byPassLogin from '../auth/fr/components/byPassLogin';
import forgetPassword from '../auth/fr/components/forgetPassword';
import loadingComponent from '../auth/fr/components/loadingComponent';
import resetPassword from '../auth/fr/components/resetPassword';
import signIn from '../auth/fr/components/signIn';
import signUp from '../auth/fr/components/signUp';
import signUpDetails from '../auth/fr/components/signUpDetails';
import signUpVerification from '../auth/fr/components/signUpVerification';
import successComponent from '../auth/fr/components/successComponent';
import promoCodeComponent from '../orders/fr/components/orderPlacement/PromoCodesComponent';
import approvalDialogue from '../orders/fr/components/social_media/approvalDialogue';

// admin
import endComponent from '../admin/fr/components/users/invite_users/EndComponent';
import inviteComponent from '../admin/fr/components/users/invite_users/inviteComponent';
import linkComponent from '../admin/fr/components/users/invite_users/linkComponent';
import editUser from '../admin/fr/components/users/editUser';
import listUser from '../admin/fr/components/users/listUser';
import addDepartment from '../admin/fr/components/addDepartment';
import api from '../admin/fr/components/api';
import departments from '../admin/fr/components/departments';
import editDepartment from '../admin/fr/components/editDepartment';
import preferences from '../admin/fr/components/preferences';
import admin from '../admin/fr/admin';
import companyDetails from '../admin/fr/components/companyDetails';
// analytics
import analytics from '../analytics/en/analytics';
// external component
import completeComponent from '../external/fr/components/completeComponent';
import emailValidation from '../external/fr/components/emailValidation';
import onboardingComponent from '../external/fr/components/onboardingIngComponent';
import passwordValidation from '../external/fr/components/passworValidationComponent';
import count from '../external/fr/count';
// freight module
import createFreightOrder from '../freights/fr/component/createFreightOrder';
import dashboardComponent from '../freights/fr/component/dashboardComponent';
import FreightLoadingComponent from '../freights/fr/component/loadingComponent';
import mainComponent from '../freights/fr/component/mainComponent';
import ordersComponent from '../freights/fr/component/ordersComponent';
import orderDetail from '../freights/fr/component/ordersDetail';
import settingsComponent from '../freights/fr/component/settingsComponent';
import transporterComponent from '../freights/fr/component/transporterComponent';
import freight from '../freights/fr/freight';
import verifyComponent from '../freights/fr/verifyComponent';
import orderDetailsComponent from '../freights/fr/component/orderDetailsComponent';
import freightDocuments from '../freights/fr/component/freightDocuments';

import genFrenchTranslations from '../general/fr';

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
  freightDocuments,

  general: genFrenchTranslations,
};

export default translations;
