<template lang="html">
  <div
    v-if="available"
    id="log_in"
    class="admin-edit-item"
  >
    <div class="admin-edit-inner">
      <div class="">
        <i
          class="el-icon-back edit-back"
          @click="go_back"
        />
      </div>
      <div class="admin-edit2-details position--details">
        {{ $t('editDepartment.edit_department_details') }}
      </div>
      <div class="edit-position">
        <div class="edit-holder edit-dimen">
          <input
            v-model="deptDetails.department_name"
            class="input-control edit-form"
            type="text"
            name="department_name"
            :placeholder="$t('editDepartment.name')"
          >
        </div>
        <div class="edit-holder">
          <el-select
            v-model="deptDetails.cop_user_id"
            class="addUser--select edit-select"
            :placeholder="$t('editDepartment.admin')"
            filterable
          >
            <el-option
              v-for="user in userData"
              :key="user.cop_user_id"
              :label="user.name"
              :value="user.cop_user_id"
            />
          </el-select>
        </div>
        <div class="sign-holder">
          <button
            id="update_department"
            class="button-primary btn-edit-dept"
            type="submit"
            @click="update_department"
          >
            {{ $t('editDepartment.update') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import NotificationMxn from '../../../mixins/notification_mixin';

export default {
  name: 'EditDepartment',
  mixins: [NotificationMxn],
  data() {
    return {
      message: '',
      available: false,
      deptDetails: {},
      userDetails: {},
    };
  },
  computed: {
    ...mapGetters({
      deptData: '$_admin/getDepartmentsList',
      userData: '$_admin/getUsersList',
    }),
  },
  mounted() {
    const department = this.$route.params.id;
    this.deptDetails = this.deptData.filter(dept => dept.department_id == department)[0];

    if (typeof this.deptDetails !== 'undefined') {
      this.available = true;
    } else {
      this.available = false;
      this.go_back();
    }
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
      endpoint: 'cop_users',
    };
    this.$store.dispatch('$_admin/requestUsersList', usersFullPayload).then(
      (response) => {
        // ...
      },
      (error) => {
        // ...
      },
    );
  },
  methods: {
    ...mapActions({
      editAdminDepartment: '$_admin/editAdminDepartment',
      requestUsersList: '$_admin/requestUsersList',
    }),
    update_department() {
      const payload = {};
      payload.department_id = this.deptDetails.department_id;
      payload.department_name = this.deptDetails.department_name;
      payload.cop_user_id = this.deptDetails.cop_user_id;
      const editDeptFullPayload = {
        values: payload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'cop_departments_update',
      };
      this.$store.dispatch('$_admin/editAdminDepartment', editDeptFullPayload).then(
        (response) => {
          const level = 1; // success
          this.message = this.$t('editDepartment.updated_successfully');
          const notification = { title: this.$t('editDepartment.edit_department'), level, message: this.message }; // notification object
          this.displayNotification(notification);
        },
        (error) => {
          const level = 2;
          this.message = this.$t('editDepartment.something_went_wrong');
          const notification = { title: '', level, message: this.message }; // notification object
          this.displayNotification(notification);
        },
      );
    },
    go_back() {
      this.$router.push('/admin/department');
    },
  },
};
</script>

<style lang="css">
.position--details {
    margin-top: 7% !important;
}

.dept--id-storetemp {
    display: none !important;
}
.btn-edit-dept{
   border-width: 0px !important;
    margin-left: 15px !important;
}
.admin-edit-item {
    text-align: center;
    border: 0 solid #ccc;
    margin: 5px;
}

.admin-edit-inner {
    max-width: 60rem;
    border-radius: 4px;
    padding: 2rem;
    font-family: 'Nunito', sans-serif;
    display: flex;
}

.admin-edit2-details {
    font-size: 1.3rem;
    line-height: 1.7em;
    font-weight: 400;
    text-align: center;
    color: #666;
    /* margin-right: 20%; */
    margin-top: 7% !important;
    margin-left: 100px;
    margin-right: 60px;
}

.edit-holder {
    margin: 1em;
    display: block;
}

.edit-dimen {
    width: 83%;
}

.edit-form {
    height: 42px !important;
    width: 160% !important;
}

.edit-select {
    height: 42px !important;
    width: 155% !important;
}

.edit-back {
    width: 40px;
    border-radius: 20px;
    transition: .3s;
    box-shadow: 0 0 6px rgba(0, 0, 0, .12);
    line-height: 40px !important;
    cursor: pointer;
}

.edit-position {
    border-left: 2px solid rgb(23, 130, 197);
    padding-left: 80px;
}
.btn-edit-user{
    border-width:0px !important;
}
</style>
