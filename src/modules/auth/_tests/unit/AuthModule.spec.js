import Vue from 'vue';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Auth from '../../Auth.vue';
import ForgotPassword from '../../components/ForgotPassword.vue';
import ResetPassword from '../../components/ResetPassword.vue';
import SignIn from '../../components/SignIn.vue';
import SignUp from '../../components/SignUp.vue';
import SignUpVerification from '../../components/SignUpVerification.vue';

Vue.use(Vuex);

describe('Auth.vue', () => {
  it('checks the auth module', () => {});
  // it('Check text', () => {
  //   const wrapper = mount(HeaderComponent, {
  //     store,
  //   });
  //   const message = wrapper.find('h1').text();
  //   expect(message).to.equal('Am Here');
  // });
});
describe('SignIn.vue', () => {
  it('checks the signIn component', () => {});
});
describe('SignUp.vue', () => {
  it('checks the signUp component', () => {});
});
describe('ForgotPassword.vue', () => {
  it('checks the forgot password component', () => {});
});
describe('SignUpVerification.vue', () => {
  it('checks the sign up component', () => {});
});
describe('ResetPassword.vue', () => {
  it('checks the reset password component', () => {});
});
