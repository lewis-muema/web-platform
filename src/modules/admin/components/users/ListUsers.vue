<template lang="html">
  <div>
    <div class="section--filter-wrap">
      <div class="section--filter-input-wrap">
        <el-input
          v-model="filterData.user"
          class="section--filter-input"
          placeholder="Search users"
        />

        <el-select
          v-model="filterData.department"
          class="section--filter-input"
          placeholder="All Departments"
          filterable
        >
          <el-option
            v-for="dept in deptData"
            :key="dept.department_id"
            :label="dept.department_name"
            :value="dept.department_id"
          />
        </el-select>

        <button
          type="button"
          :class="
            active_filter
              ? 'button-primary section--filter-action align-left btn-users'
              : 'button-primary section--filter-action-inactive align-left btn-users'
          "
          :disabled="active_filter == true ? false : true"
          @click="filterUserTableData"
        >
          Search
        </button>
      </div>
      <div class="section--filter-action-wrap">
        <button class="button-primary section--filter-action btn-users" @click="addUser">
          Add User
        </button>
      </div>
    </div>

    <el-table :data="user_data" style="width: 100%" :border="true" :stripe="true">
      <template slot="empty">
        {{ empty_users_state }}
      </template>
      <el-table-column label="Name" prop="name" />
      <el-table-column label="Phone" prop="phone" />
      <el-table-column label="Email" prop="email" width="250" />
      <el-table-column label="Department" prop="department_name" />
      <el-table-column label="Type">
        <template slot-scope="scope">
          <span>{{ get_user_type(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Status">
        <template slot-scope="scope">
          <span>{{ get_user_status(scope.$index) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template slot-scope="scope">
          <a class="btn-edit-user" @click="edit_user(user_data[scope.$index]['cop_user_id'])"
            >Edit User</a
          >
        </template>
      </el-table-column>
    </el-table>
    <div class="section--pagination-wrap">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredUserData.length"
        :page-size="pagination_limit"
        :current-page.sync="pagination_page"
        :page-sizes="[10, 20, 50, 100]"
        class="section--pagination-item"
        @current-change="changePage"
        @size-change="changeSize"
      />
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';

export default {
  name: 'ListUsers',
  data() {
    return {
      empty_users_state: 'Fetching Users...',
      empty_departments_state: 'Fetching Departments...',
      pagination_limit: 10,
      pagination_page: 1,
      filteredUserData: [],
      filterState: false,
      search_users: '',
      filterData: {
        user: '',
        department: '',
      },
    };
  },
  mounted() {
    const session = this.$store.getters.getSession;
    let cop_id = 0;
    if (session.default === 'biz') {
      cop_id = session[session.default].cop_id;
    }
    const payload = {
      cop_id,
    };
    const usersFullPayload = {
      values: payload,
      app: 'NODE_PRIVATE_API',
      endpoint: 'cop_users',
    };
    this.$store
      .dispatch('$_admin/requestUsersList', usersFullPayload)
      .then(response => {}, error => {});

    const deptsFullPayload = {
      values: payload,
      vm: this,
      app: 'NODE_PRIVATE_API',
      endpoint: 'cop_departments',
    };
    this.$store
      .dispatch('$_admin/requestDepartmentsList', deptsFullPayload)
      .then(response => {}, error => {});
    this.filteredUserData = this.userData;
  },
  computed: {
    ...mapGetters({
      userData: '$_admin/getUsersList',
      deptData: '$_admin/getDepartmentsList',
    }),
    ...mapActions({
      requestUsersList: '$_admin/requestUsersList',
    }),
    user_data() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      if (this.filterState == true) {
        if (Array.isArray(this.filteredUserData)) {
          return this.filteredUserData.slice(from, to);
        }
        return [];
      }
      this.filteredUserData = this.userData;
      if (Array.isArray(this.userData)) {
        return this.userData.slice(from, to);
      }
      return [];
    },
    active_filter() {
      return this.filterData.user !== '' || this.filterData.department !== '';
    },
  },

  methods: {
    addUser() {
      this.$router.push({ name: 'adminAddUser' });
    },
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      const user_data = this.userData.slice(from, to);
    },
    get_user_type(index) {
      let resp = '';
      if (this.user_data.length > 0) {
        resp = this.user_data[index].type;
        if (resp === 1) {
          resp = 'Normal';
        } else if (resp === 2) {
          resp = 'Admin';
        }
      }
      return resp;
    },
    get_user_status(index) {
      let resp = '';
      if (this.user_data.length > 0) {
        resp = this.user_data[index].status;
        if (resp === 1) {
          resp = 'Active';
        } else if (resp === 2) {
          resp = 'Deactivated';
        } else if (resp === 0) {
          resp = 'Deleted';
        }
      }
      return resp;
    },
    filterUserTableData() {
      // reset filter
      const vm = this;
      this.filterState = false;
      const userId = this.filterData.user;
      const { department } = this.filterData;
      this.filteredUserData = this.userData;
      // check if both are filled
      if (userId !== '' && department !== '') {
        const vm = this;
        this.filteredUserData = this.filteredUserData.filter(user => {
          if (
            user.name.toLowerCase().indexOf(vm.filterData.user.toLowerCase()) >= 0 &&
            user.department_id === department
          ) {
            return (
              user.name.toLowerCase().indexOf(vm.filterData.user.toLowerCase()) >= 0 &&
              user.department_id === department
            );
          }
          vm.empty_users_state = 'Could not find users for the department.';
        });
        this.filterState = true;
      } else if (userId !== '') {
        // user filter
        const vm = this;
        this.filteredUserData = this.filteredUserData.filter(
          user => user.name.toLowerCase().indexOf(vm.filterData.user.toLowerCase()) >= 0
        );
        this.filterState = true;
      } else {
        // department filter

        this.filteredUserData = this.filteredUserData.filter(user => {
          if (user.department_id === department) {
            return user.department_id === department;
          }
          vm.empty_users_state = 'Could not find users for the department.';
        });
        this.filterState = true;
      }
    },
    ...mapMutations({
      updateCopUserId: '$_admin/updateCopUserId',
      updateUserName: '$_admin/updateUserName',
      updateUserEmail: '$_admin/updateUserEmail',
      updateUserPhone: '$_admin/updateUserPhone',
      updateType: '$_admin/updateType',
    }),
    edit_user(copUserId) {
      this.$router.push(`/admin/users/edit_user/${copUserId}`);
    },
  },
};
</script>

<style lang="css" scoped>
@import 'https://fonts.googleapis.com/css?family=Nunito:300,400,500,700|Material+Icons';
.btn_users {
    border-width: 0px !important;
}

.btn-edit-user {
    cursor: pointer;
}
</style>
