import Vue from 'vue';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import Vuex from 'vuex';
import Admin from '../../Admin.vue';
import AddDepartment from '../../components/AddDepartment.vue';
import API from '../../components/API.vue';
import CompanyDetails from '../../components/CompanyDetails.vue';
import Departments from '../../components/Departments.vue';
import EditDepartment from '../../components/EditDepartment.vue';
import Preferences from '../../components/Preferences.vue';
import Users from '../../components/Users.vue';
import AddUser from '../../components/users/AddUser.vue';
import EditUser from '../../components/users/EditUser.vue';
import ListUsers from '../../components/users/ListUsers.vue';
import EndComponent from '../../components/users/invite_users/EndComponent.vue';
import InviteComponent from '../../components/users/invite_users/InviteComponent.vue';
import LinkComponent from '../../components/users/invite_users/LinkComponent.vue';
import LinkShowComponent from '../../components/users/invite_users/LinkShowComponent.vue';
import ManyComponent from '../../components/users/invite_users/ManyComponent.vue';


Vue.use(Vuex);

describe('Admin.vue', () => {
  it('checks the admin module', () => {});
  // it('Check text', () => {
  //   const wrapper = mount(HeaderComponent, {
  //     store,
  //   });
  //   const message = wrapper.find('h1').text();
  //   expect(message).to.equal('Am Here');
  // });
});
describe('AddDepartment.vue', () => {
  // let getters;
  // let store;
  // let state ;
  //
  // beforeEach(() => {
  //   getters = { 'getSession': () => 'biz' };
  //   store = new Vuex.Store({
  //     getters,
  //   });
  // });

  it('checks the add department component', () => {
    // const wrapper = mount(AddDepartment ,{sync : false , store});
  });
});
describe('API.vue', () => {
  it('checks the API component', () => {});
});
describe('ComponentDetails.vue', () => {
  it('checks the company details component', () => {});
});
describe('Departments.vue', () => {
  it('checks the admin departments component', () => {});
});
describe('EditDepartment.vue', () => {
  it('checks the edit department component', () => {});
});
describe('Preferences.vue', () => {
  it('checks the admin preferences component', () => {});
});
describe('Users.vue', () => {
  it('checks the admin users component', () => {});
});
describe('EndComponent.vue', () => {
  it('checks the invite users - end component', () => {});
});
describe('InviteComponent.vue', () => {
  it('checks the invite users - invite component', () => {});
});
describe('LinkComponent.vue', () => {
  it('checks the checks the invite users- link component', () => {});
});
describe('LinkShowComponent.vue', () => {
  it('checks the invite users - link show component', () => {});
});
describe('ManyComponent.vue', () => {
  let getters;
  let store;
  let state ;
  let mutations ;
  let actions ;

  beforeEach(() => {
    mutations = { '$_admin/setViewState': () => 1 };
    store = new Vuex.Store({
      getters,
      mutations,
    });
  });
  it('checks the many component if email is set', () => {
      const wrapper = mount(ManyComponent ,{
        sync : false ,
        store,

    });
     wrapper.setData({
       emailSet: 'clinton@sendy.co.ke'
     });
      expect(wrapper.vm.emailSet).equal('clinton@sendy.co.ke');

  });
  it('checks the many component if cancel button works', () => {
      const wrapper = mount(ManyComponent ,{
        sync : false ,
        store,

    });
    wrapper.find(".show-link-justify").trigger("click");
    wrapper.vm.get_inv();
      // 
      // expect(wrapper.vm.insane).equal(true);

  });
});
describe('AddUser.vue', () => {
  it('checks the add user component', () => {});
});
describe('EditUser.vue', () => {
  it('checks the edit user component', () => {});
});
describe('ListUsers.vue', () => {
  it('checks the list users component', () => {});
});
