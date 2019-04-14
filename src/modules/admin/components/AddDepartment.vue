<template lang="html">
  <div id="log_in" class="admin-edit-item">
    <div class="admin-edit-inner">
      <div class="">
        <i class="el-icon-back edit-back" @click="go_back" />
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
          />
        </div>
        <div class="edit-holder">
          <el-select
            v-model="filterData.user"
            class="addUser--select edit-select"
            placeholder="Admin"
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
          <button class="button-primary add_dept--btn" type="submit" @click="add_department">
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapActions, mapGetters, mapMutations} from 'vuex'

    export default {
        name: 'AddDepartment',
        data() {
            return {
                empty_departments_state: 'Adding Department',
                filterData: {
                    'user': '',
                },
                department_name: '',
            }
        },
        mounted() {
            let session = this.$store.getters.getSession;
            let cop_id = 0;
            if(session.default === 'biz'){
                cop_id = session[session.default]['cop_id'];
            }
            let payload = {
                'cop_id': cop_id,

            }
            let users_full_payload = {
                'values' : payload,
                'app':'NODE_PRIVATE_API',
                'endpoint':'cop_users',
            }
            this.$store.dispatch('$_admin/requestUsersList', users_full_payload).then(response => {

            }, error => {
              let level = 2;
              let notification = {'title': '', 'level': level, 'message': 'Something went wrong.'}; //notification object
              this.$store.commit('setNotification', notification);
              this.$store.commit('setNotificationStatus', true);
            });
        },
        computed: {
            ...mapGetters({
                userData: '$_admin/getUsersList',
                requestUsersList: '$_admin/requestUsersList'
            }),
        },
        methods: {
            ...mapActions({
                addNewDepartment: '$_admin/addNewDepartment'
            }),
            add_department: function () {
                let session = this.$store.getters.getSession;
                let cop_id = 0;
                if (session.default === 'biz') {
                    cop_id = session[session.default]['cop_id'];
                }
                let newDept_payload = {
                    'cop_id': cop_id,
                    'department_name': this.department_name,
                    'cop_user_id': this.filterData.user,
                }

                let full_payload = {
                    'values': newDept_payload,
                    'app': 'NODE_PRIVATE_API',
                    'endpoint': 'cop_departments_add',
                }
                this.$store.dispatch('$_admin/addNewDepartment', full_payload).then(response => {
                    let level = 1; //success
                    let notification = {'title': '', 'level': level, 'message': 'Department Added!'}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true); //activate notification
                }, error => {
                    let level = 2;
                    let notification = {'title': '', 'level': level, 'message': 'Something went wrong.'}; //notification object
                    this.$store.commit('setNotification', notification);
                    this.$store.commit('setNotificationStatus', true); //activate notification

                });
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
</style>
