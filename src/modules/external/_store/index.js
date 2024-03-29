import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  base_url: 'https://sendyit.com',
  view_state: 1,
  view_step: 0,
  personal_email: '',
  bizName: '',
  biz_email: '',
  phone: '',
  name: '',
  type: '',
  dept_id: '',
  cop_id: '',
  cop_user_id: '',
  password_plain: '',
  invite_type: '',
  help_panel(bizName) {
    return {
      1: {
        0: [
          'Welcome',
          `You have been invited to join the ${bizName} account on Sendy. Tell us a little more about you`,
        ],
        1: ['Name', 'Your name is what will show on your account when you sign in.'],
        2: ['Email', 'The business email address you will use to log in.'],
        3: ['Phone', 'The number with which Sendy and our Partners can easily reach you.'],
      },
      2: {
        0: [
          'Personal Account',
          "Let's create your personal account so you have access to simple and transparent delivery all the time.",
        ],
        1: ['Personal Email', 'Please enter the email address for your personal account on Sendy.'],
      },
      3: {
        0: [
          'Password',
          'Create a password that will be used for both your personal and business accounts',
        ],
        1: ['Enter Password', 'Create a strong password by using letters, numbers and symbols.'],
        2: ['Confirm Password', 'Ensure that this password is the same as entered above.'],
      },
    };
  },
};

export default {
  namespaced: true,
  state,
  actions,
  getters,
  mutations,
};
