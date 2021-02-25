<template lang="html">
  <div
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
        Add Department
      </div>
      <div class="edit-position">
        <div class="edit-holder edit-dimen">
          <input
            v-model="department_name"
            class="input-control edit-form"
            type="text"
            placeholder="Name"
          >
        </div>
        <div class="edit-holder">
          <el-select
            v-model="filterData.user"
            class="addUser--select edit-select"
            placeholder="Admin"
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
        <div class="add-dept-holder">
          <button
            type="submit"
            :disabled="disabled == 1 ? true : false"
            :class="
              disabled == 1
                ? 'button-primary add_dept--btn inactive-btn'
                : 'button-primary add_dept--btn'
            "
            @click="add_department"
          >
            Add
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
  name: 'AddDepartment',
  mixins: [NotificationMxn],
  data() {
    return {
      empty_departments_state: 'Adding Department',
      department_name: '',
      disabled: 0,
      filterData: {
        user: '',
      },
    };
  },
  computed: {
    ...mapGetters({
      userData: '$_admin/getUsersList',
      requestUsersList: '$_admin/requestUsersList',
    }),
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
      endpoint: 'cop_users',
    };
    this.$store
      .dispatch('$_admin/requestUsersList', usersFullPayload)
      .then((response) => {}, (error) => {});
  },
  methods: {
    ...mapActions({
      addNewDepartment: '$_admin/addNewDepartment',
    }),
    add_department() {
      if (this.filterData.user !== '' && this.department_name !== '') {
        const session = this.$store.getters.getSession;
        let cop_id = 0;
        if (session.default === 'biz') {
          cop_id = session[session.default].cop_id;
        }
        const newDeptPayload = {
          cop_id,
          department_name: this.department_name,
          cop_user_id: this.filterData.user,
        };

        const fullPayload = {
          values: newDeptPayload,
          vm: this,
          app: 'NODE_PRIVATE_API',
          endpoint: 'cop_departments_add',
        };
        this.$store.dispatch('$_admin/addNewDepartment', fullPayload).then(
          (response) => {
            const level = 1;
            this.disabled = 1;
            const notification = {
              title: 'Add Department',
              level,
              message: 'Department added successfully',
            };
            this.displayNotification(notification);
            setTimeout(() => {
              this.$router.push('/admin/department');
            }, 5000);
          },
          (error) => {
            const level = 2;
            const notification = { title: '', level, message: 'Something went wrong.' };
            this.displayNotification(notification);
          },
        );
      } else {
        const level = 2;
        const notification = {
          title: 'Add Department Error !',
          level,
          message: 'Please provide Department name and Admin',
        };
        this.displayNotification(notification);
      }
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
.add_dept--btn{
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
    /*margin-top: 18% !important;*/
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
.inactive-btn{
  background: rgba(0,0,0,0.50);
  border: 1px solid rgba(0,0,0,0.50);
}
.add-dept-holder{
  display: block;
}
</style>
