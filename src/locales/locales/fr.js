
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
import genFrenchTranslations from '../general/fr';

const translations = {
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
  general: genFrenchTranslations,
};

export default translations;
