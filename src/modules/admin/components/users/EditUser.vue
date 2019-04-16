<template lang="html">
  <div v-if="available" id="log_in" class="admin-edit-item">
    <div class="admin-edit-inner">
      <div class="">
        <i class="el-icon-back edit-back" v-on:click="one_step_back"></i>
      </div>

      <div class="admin-edit2-details">
        Edit User
      </div>
      <div class="edit-position">
        <div class="edit-holder edit-dimen">
          <input
            class="input-control edit-form"
            type="text"
            style="margin-top: 14%;"
            name="name"
            v-model="userDetails.name"
            placeholder="Name"
            autocomplete="off"
          />
        </div>

        <div class="edit-holder edit-dimen">
          <input
            class="input-control edit-form"
            type="text"
            name="email"
            v-model="userDetails.email"
            placeholder="Email"
          />
        </div>

        <div class="edit-holder edit-dimen">
          <input
            class="input-control edit-form"
            type="text"
            name="phone"
            v-model="userDetails.phone"
            placeholder="Phone"
          />
        </div>

        <div class="edit-holder">
          <el-select
            class="addUser--select edit-select"
            v-model="userDetails.department_id"
            placeholder="Department"
          >
            <el-option
              v-for="depart in departments"
              :key="depart.department_id"
              :label="depart.department_name"
              :value="depart.department_id"
            >
            </el-option>
          </el-select>
        </div>

        <div class="edit-holder">
          <el-select
            class="addUser--select edit-select"
            v-model="userDetails.status"
            placeholder="Status"
          >
            <el-option
              v-for="status in statuses"
              :key="status.status"
              :label="status.status_label"
              :value="status.status"
            >
            </el-option>
          </el-select>
        </div>

        <div class="edit-holder">
          <el-select
            class="addUser--select edit-select"
            v-model="userDetails.type"
            placeholder="User Type"
          >
            <el-option
              v-for="type in types"
              :key="type.type"
              :label="type.type_name"
              :value="type.type"
            >
            </el-option>
          </el-select>
        </div>

        <div class="sign-holder">
          <button
            class="button-primary btn-edit-user"
            type="submit"
            id="UpdateEdit"
            v-on:click="update_edit"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'EditUser',
  data() {
    return {
      userDetails: {},
      message: '',
      available: false,
      statuses: [
        {
          status: 1,
          status_label: 'Active',
        },
        {
          status: 2,
          status_label: 'Deactivate',
        },
      ],
      types: [
        {
          type: 1,
          type_name: 'Normal',
        },
        {
          type: 2,
          type_name: 'Admin',
        },
      ],
    };
  },
  mounted() {
    let cop_user_id = this.$route.params.id;
    this.userDetails = this.userData.filter(user => user.cop_user_id == cop_user_id)[0];

    if (this.userDetails !== undefined) {
      this.available = true;
    } else {
      this.available = false;
      this.one_step_back();
    }
  },
  computed: {
    ...mapGetters({
      userData: '$_admin/getUsersList',
      departments: '$_admin/getDepartmentsList',
    }),
  },

  methods: {
    ...mapActions({
      editAdminUser: '$_admin/editAdminUser',
    }),
    update_edit: function() {
      let vm = this;
      let payload = {};
      payload.cop_user_id = this.userDetails.cop_user_id;
      payload.user_name = this.userDetails.name;
      // payload.user_email = this.userDetails.email;
      payload.user_phone = this.userDetails.phone;
      payload.department_id = this.userDetails.department_id;
      payload.user_type = this.userDetails.type;
      payload.user_email = this.userDetails.email;
      payload.status = this.userDetails.status;

      let editUser_full_payload = {
        values: payload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'update_user',
      };
      this.$store.dispatch('$_admin/editAdminUser', editUser_full_payload).then(
        response => {
          // return;

          let level = 1; //success
          this.message = 'Edit Successful!';

          let notification = { title: '', level: level, message: this.message }; //notification object
          this.$store.commit('setNotification', notification);
          this.$store.commit('setNotificationStatus', true); //activate notification

          // vm.one_step_back()
        },
        error => {
          let level = 3;
          this.message = 'Something went wrong.';
          let notification = { title: '', level: level, message: this.message }; //notification object
          this.$store.commit('setNotification', notification);
          this.$store.commit('setNotificationStatus', true); //activate notification

          // vm.one_step_back()
        }
      );
    },
    one_step_back: function() {
      this.$router.push('/admin/users/');
    },
  },
};
</script>

<style lang="css">
.admin-edit-item {
    text-align: center;
    border: 0 solid #ccc;
    margin: 5px;
}

.admin-edit-inner {
    max-width: 60rem;
    border-radius: 4px;
    padding: 2rem;
    font-family: 'Rubik', sans-serif;
    display: flex;
}

.admin-edit2-details {
    font-size: 1.3rem;
    line-height: 1.7em;
    font-weight: 400;
    text-align: center;
    color: #666;
    /* margin-right: 20%; */
    margin-top: 18% !important;
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
  width: 50px;
      height: 50px;
      border-radius: 50%;
      transition: .3s;
      /* box-shadow: 0 0 6px rgba(0, 0, 0, .12); */
      line-height: 50px !important;
      cursor: pointer;
      border: 1px solid #555;
      text-align: center;
      font-size: 23px;
}

.edit-position {
    border-left: 2px solid rgb(23, 130, 197);
    padding-left: 80px;
}
.btn-edit-user{
  border-width:0px !important;
  margin-left: 15px !important;
}
</style>
