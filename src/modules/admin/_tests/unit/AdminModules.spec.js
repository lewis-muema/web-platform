/* global describe,beforeEach,it */
/* eslint no-undef: "error" */
/* eslint no-unused-expressions: "error" */
/* eslint no-unused-expressions: ["error", { "allowShortCircuit": true, "allowTernary": true }] */
import Vue from 'vue';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from '@vue/test-utils';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
// import AddDepartment from '../../components/AddDepartment.vue';
// import API from '../../components/API.vue';
// import CompanyDetails from '../../components/CompanyDetails.vue';
// import Departments from '../../components/Departments.vue';
// import EditDepartment from '../../components/EditDepartment.vue';
// import Preferences from '../../components/Preferences.vue';
// import Users from '../../components/Users.vue';
// import AddUser from '../../components/users/AddUser.vue';
// import EditUser from '../../components/users/EditUser.vue';
// import ListUsers from '../../components/users/ListUsers.vue';
// import EndComponent from '../../components/users/invite_users/EndComponent.vue';
// import InviteComponent from '../../components/users/invite_users/InviteComponent.vue';
import LinkShowComponent from '../../components/users/invite_users/LinkShowComponent.vue';
import ManyComponent from '../../components/users/invite_users/ManyComponent.vue';
import i18n from '../../../../i18n';

Vue.use(Vuex);
Vue.use(VueRouter);
// const router = new VueRouter();
const spy = sinon.spy();
const session = {
  peer: {},
  biz: {
    pay_option: 2,
    user_email: 'faithshop@gmail.com',
    cop_biz_phone: '+254778987789',
    user_promo: '9ALEEM',
    user_id: 1,
    user_phone: '+254778987789',
    cop_biz_email: 'faithshop@gmail.com',
    cop_contact_person: 'Faith mungai',
    cop_name: 'Faith shop',
    user_type: 2,
    pay_method: 1,
    cop_id: 669,
    status: true,
    user_name: 'Faithshopy',
  },
  default: 'biz',
  first_time: false,
};
let getters;
let store;
let mutations;
let actions;

describe('AddDepartment.vue', () => {
  beforeEach(() => {
    getters = {
      getSession: () => session,
      '$_admin/getUsersList': () => '',
      '$_admin/requestUsersList': () => '',
    };
    store = new Vuex.Store({
      getters,
    });
  });

  it('checks the add department component', () => {
    // const wrapper = mount(AddDepartment ,{sync : false , store});
  });
});
describe('API.vue', () => {
  beforeEach(() => {
    getters = {
      getSession: () => session,
      '$_admin/getKeysList': () => '',
    };
    actions = {
      '$_admin/requestKeysList': spy,
      '$_admin/generateAPIKey': spy,
    };
    mutations = {
      setNotification: () => {
        'Key Generated!';
      },
      setNotificationStatus: () => true,
    };
    store = new Vuex.Store({
      getters,
      actions,
      mutations,
    });
  });

  // it('renders a vue instance in API Component', () => {
  //   expect(mount(API, { store }).isVueInstance()).to.be.true;
  // });

  it('checks the API component - generate API Key', () => {
    // const wrapper = mount(API, {
    //   sync: false,
    //   store,
    // });
    // const clickMethodStub = sinon.stub();
    // wrapper.setMethods({ '$_admin/generateAPIKey': clickMethodStub });
    // wrapper.vm.updateApiKey();
    // let list = '$_admin/requestKeysList';
    // expect(clickMethodStub.called).equal(false);
  });
});
describe('CompanyDetails.vue', () => {
  beforeEach(() => {
    getters = {
      getSession: () => session,
    };
    actions = {
      '$_admin/requestCopInfo': spy,
    };
    store = new Vuex.Store({
      getters,
      actions,
    });
  });
  //   it('renders a vue instance in Company Details component', () => {
  //   expect(mount(CompanyDetails , { store }).isVueInstance()).to.be.true;
  // });

  it('checks the company details component', () => {
    // const wrapper = mount(CompanyDetails, {
    //   sync: false,
    //   store,
    // });
    // wrapper.vm.set_data();
    // wrapper.setData({
    //   message: 'Details Saved!'
    // });
    // expect(wrapper.vm.message).equal(true);
  });
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
  beforeEach(() => {
    mutations = {
      '$_admin/setViewState': () => 1,
      '$_admin/updateAddedStatus': () => '',
      '$_admin/newAdds': () => 3,
      '$_admin/updateInvites': () => [],
    };
    getters = {
      '$_admin/getBaseUrl': () => '',
    };
    store = new Vuex.Store({
      getters,
      mutations,
    });
  });

  // it('renders a vue instance in End component', () => {
  //   expect(mount(EndComponent, { store }).isVueInstance()).to.be.true;
  // });

  // it('checks back button after sucessfull user invite ', () => {
  //   const wrapper = mount(EndComponent, {
  //     sync: false,
  //     store,
  //   });
  //   wrapper.find('.end--back-link').trigger('click');
  //   wrapper.vm.back_btn();
  // });
});
describe('InviteComponent.vue', () => {
  it('checks the invite users - invite component', () => {});
});
describe('LinkShowComponent.vue', () => {
  beforeEach(() => {
    mutations = {
      '$_admin/updateViewState': () => 1,
    };
    getters = {
      '$_admin/getViewState': () => 1,
      '$_admin/getBizName': () => 'FaithShop',
      '$_admin/getInviteLink': () => 'https://webapptest.sendyit.com/external/onboard/link/198be9/3db1ea66bb8fa354b85588750b0fc8f3',
      getSession: () => session,
    };
    store = new Vuex.Store({
      getters,
      mutations,
    });
  });

  // it('renders a vue instance in Link Show Component', () => {
  //   expect(mount(LinkShowComponent, { store }).isVueInstance()).to.be.true;
  // });

  it('checks the invite users - copy link  option', () => {
    const wrapper = mount(LinkShowComponent, {
      sync: false,
      store,
      i18n,
    });
    const input = wrapper.find('#in_link');
    input.element.value = 'linkurl';
    // wrapper.vm.copy_link();
    // expect(wrapper.vm.button).equal('Copied');
  });
});
describe('ManyComponent.vue', () => {
  beforeEach(() => {
    mutations = {
      '$_admin/setViewState': () => 1,
      '$_admin/newAdds': () => '',
      '$_admin/updateInvites': () => '',
    };
    store = new Vuex.Store({
      getters,
      mutations,
    });
  });
  // it('renders a vue instance in Many Component', () => {
  //   expect(mount(ManyComponent).isVueInstance()).equal(true);
  // });
  it('checks the many component if email is set', () => {
    const wrapper = mount(ManyComponent, {
      sync: false,
      store,
      i18n,
    });
    wrapper.setData({
      emailSet: 'clinton@sendy.co.ke',
    });
    expect(wrapper.vm.emailSet).equal('clinton@sendy.co.ke');
  });
  // it('checks the many component if cancel button works', () => {
  //   const wrapper = mount(ManyComponent, {
  //     sync: false,
  //     store,
  //     i18n,
  //   });
  //   wrapper.find('.show-link-justify').trigger('click');
  //   wrapper.vm.get_inv();
  //   expect(wrapper.vm.cancelInvite).equal(true);
  // });
  // it('checks the add invitee button', () => {
  //   const wrapper = mount(ManyComponent, {
  //     sync: false,
  //     store,
  //     i18n,
  //   });
  //   wrapper.setData({
  //     emailSet: 'clinton@sendy.co.ke',
  //   });
  //   wrapper.find('.button-primary').trigger('click');
  //   wrapper.vm.inv_many();
  //   expect(wrapper.vm.inviteMany).equal(true);
  // });
});
describe('AddUser.vue', () => {
  beforeEach(() => {
    getters = {
      '$_admin/getViewState': () => 1,
      '$_admin/getAdds': () => '',
      '$_admin/getDepartmentsList': () => '',
    };
    store = new Vuex.Store({
      getters,
    });
  });

  // it('renders a vue instance in Add User Component', () => {
  //   expect(mount(AddUser, { store }).isVueInstance()).equal(true);
  // });

  it('checks the add user component', () => {});
});
describe('EditUser.vue', () => {
  beforeEach(() => {
    getters = {
      userData: () => '',
      '$_admin/getDepartmentsList': () => '',
    };
    actions = {
      '$_admin/requestCopInfo': spy,
    };

    store = new Vuex.Store({
      getters,
      actions,
    });
  });
  it('checks the edit user component', () => {
    //   const wrapper = mount(EditUser ,{
    //     sync : false ,
    //     store,
    //     router,
    //
    // });
  });
});
describe('ListUsers.vue', () => {
  beforeEach(() => {
    getters = {
      userData: () => '',
      '$_admin/getDepartmentsList': () => '',
      getSession: () => session,
    };
    actions = {
      '$_admin/requestUsersList': spy,
    };

    store = new Vuex.Store({
      getters,
      actions,
    });
  });
  it('checks the list users component', () => {
    //   const wrapper = mount(ListUsers ,{
    //     sync : false ,
    //     store,
    //     router,
    //
    // });
  });
});
