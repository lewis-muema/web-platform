<template lang="html">
  <div
    id="departments_container"
    class="departments_container"
  >
    <div class="section--filter-wrap">
      <div class="section--filter-input-wrap">
        <el-input
          v-model="filterData.department"
          class="section--filter-input"
          :placeholder="$t('departments.search_department')"
        />

        <button
          type="button"
          :class="
            active_filter
              ? 'button-primary section--filter-action align-left btn-dprts'
              : 'button-primary section--filter-action-inactive align-left btn-dprts'
          "
          :disabled="active_filter == true ? false : true"
          @click="filterUserTableData"
        >
          {{this.$t('departments.search')}}
        </button>
      </div>
      <div class="section--filter-action-wrap">
        <button
          class="button-primary section--filter-action btn-dprts"
          @click="addDepartment"
        >
          {{this.$t('departments.add_department')}}
        </button>
      </div>
    </div>
    <el-table
      :data="departments_data"
      style="width: 100%"
      :border="true"
      :stripe="true"
    >
      <template slot="empty">
        {{ empty_departments_state }}
      </template>
      <el-table-column
        :label="$t('departments.name')"
        prop="department_name"
      />
      <el-table-column
        :label="$t('departments.admin')"
        prop="department_admin"
      />
      <el-table-column label="Action">
        <template slot-scope="scope">
          <a
            class="btn-dpt-edit"
            @click="edit_department(departments_data[scope.$index]['department_id'])"
          >{{$t('departments.edit')}}</a>
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
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'Departments',
  data() {
    return {
      empty_departments_state: this.$t('departments.fetch_department'),
      pagination_limit: 10,
      pagination_page: 1,
      filterState: false,
      filteredUserData: [],
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
      vm: this,
      app: 'NODE_PRIVATE_API',
      endpoint: 'cop_departments',
    };
    this.$store.dispatch('$_admin/requestDepartmentsList', usersFullPayload).then(
      (response) => {},
      (error) => {
        this.empty_departments_state = this.$t('departments.no_department');
      },
    );
    this.filteredUserData = this.deptData;
  },
  computed: {
    ...mapGetters({
      deptData: '$_admin/getDepartmentsList',
      userData: '$_admin/getUsersList',
    }),
    ...mapActions({
      requestDepartmentsList: '$_admin/requestDepartmentsList',
    }),
    departments_data() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      if (this.filterState === true) {
        if (Array.isArray(this.filteredUserData)) {
          return this.filteredUserData.slice(from, to);
        }
        return [];
      }
      this.filteredUserData = this.deptData;
      if (Array.isArray(this.deptData)) {
        return this.deptData.slice(from, to);
      }
      return [];
    },

    active_filter() {
      return this.filterData.user !== '' || this.filterData.department !== '';
    },
  },
  methods: {
    addDepartment() {
      // TODO:route to add department
      this.$router.push('/admin/department/add_department');
    },
    changeSize(val) {
      this.pagination_page = 1;
      this.pagination_limit = val;
    },
    changePage() {
      const from = (this.pagination_page - 1) * this.pagination_limit;
      const to = this.pagination_page * this.pagination_limit;
      const departments_data = this.deptData.slice(from, to);
    },
    edit_department(department) {
      this.$router.push(`/admin/department/edit_department/${department}`);
    },
    filterUserTableData() {
      // reset filter
      this.filterState = false;
      const { user } = this.filterData;
      const { department } = this.filterData;

      this.filteredUserData = this.deptData;
      // check if both are filled
      if (department !== '') {
        // department filter
        const vm = this;
        this.filteredUserData = this.filteredUserData.filter(
          user => user.department_name.toLowerCase().indexOf(vm.filterData.department.toLowerCase()) >= 0,
        );
        this.filterState = true;
      }
    },
  },
};
</script>

<style lang="css">
@import "../../../assets/styles/datatable.css?v=1";

.button {
    float: right;
}

.button__element {
    text-transform: uppercase;
    display: inline-block;
    padding: 10px 30px;
    margin-bottom: 0;
    font-size: 14px;
    font-weight: normal;
    line-height: 1.42857143;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-image: none;
    border: 1px solid transparent;
    border-radius: 3px;
    color: #fff;
    background-color: #007FFF;
    border-color: #357ebd;
    text-decoration: none;
}

.menu {
    display: flow-root;
}
.btn-dprts{
  border-width:0px !important;
}
.btn-dpt-edit{
  cursor: pointer;
}
</style>
