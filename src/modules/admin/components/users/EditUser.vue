<template lang="html">
  <div id="log_in" class="admin-edit-item" >

      <div class="admin-edit-inner">

          <div class="admin-edit-details">
            Edit User Details
          </div>

          <div>

            <div class="edit-holder edit-dimen">
              <input class="input-control edit-form" type="text" style="margin-top: 14%;"name="name" v-model="name" placeholder="Name" autocomplete="on">
            </div>

            <div class="edit-holder edit-dimen">
              <input class="input-control edit-form" type="text" name="email" v-model="email" placeholder="Email">
            </div>

            <div class="edit-holder edit-dimen">
              <input class="input-control edit-form" type="text" name="phone" v-model="phone" placeholder="Phone">
            </div>

            <div class="edit-holder">
            <el-select class="addUser--select edit-select" v-model="dept_value" placeholder="Department">
                <el-option v-for="depart in departments" :key="depart.dept_value" :label="depart.label" :value="depart.dept_value">
                </el-option>
            </el-select>
           </div>

           <div class="edit-holder">
           <el-select class="addUser--select edit-select" v-model="status_value" placeholder="Status">
               <el-option v-for="status in statuses" :key="status.status_value" :label="status.status_name" :value="status.status_value">
               </el-option>
           </el-select>
          </div>

          <div class="edit-holder">
          <el-select class="addUser--select edit-select" v-model="type_value" placeholder="User Type">
              <el-option v-for="type in types" :key="type.type_value" :label="type.type_name" :value="type.type_value">
              </el-option>
          </el-select>
         </div>

            <div class="sign-holder">
              <input class="button-primary" type="submit" value="Update Details" id="UpdateEdit" v-on:click="update_edit" >
            </div>
          </div>
      </div>
  </div>


</template>

<script>
import {mapActions} from 'vuex'
export default {
  name:'EditUser',
  data() {
      return {
          departments: [{
              dept_value: '1',
              label: 'Department1'
          }, {
             dept_value: '2',
             label: 'Department2'
          }, {
             dept_value: '3',
            label: 'Department3'
          }],
          statuses: [{
              status_value: '1',
              status_name: 'Active'
          }, {
            status_value: '2',
            status_name: 'Deactivate'
          }],
          types: [{
              type_value: '1',
              type_name: 'User'
          }, {
            type_value: '2',
            type_name: 'Admin'
          }],
          dept_value: '',
          status_value: '',
          type_value: ''
        }
  },

  methods:{
     ...mapActions({
        requestEditUserAdmin :'$_admin/requestEditUserAdmin',
    }),
    update_edit: function ()
    {
      let payload = {};
        payload.cop_user_id = '';
        payload.user_name = '';
        payload.user_email = '';
        payload.user_phone = '';
        payload.department_id = this.dept_value;
        payload.user_type = this.type_value;
        payload.email = '';
        payload.status = this.status_value;
      this.requestEditUserAdmin(payload).then(response => {
         console.log("User Details Updated!")
         console.log(response);
      }, error => {
          console.error("Check Internet Connection")
          console.log(error);
      });
    },
},

}
</script>

<style lang="css">
.admin-edit-item{
text-align: center;
border: 0px solid #ccc;
margin: 5px;
}
.admin-edit-inner{
  max-width: 60rem;
  border-radius: 4px;
  padding: 2rem;
  font-family: 'Rubik', sans-serif;
  display: flex;
}
.admin-edit-details{
font-size: 1.3rem;
line-height: 1.7em;
font-weight: 400;
text-align: center;
color: #666;
margin-right: 20%;
margin-top: 4%;
}
.edit-holder{
margin: 1em;
display: block;
}

.edit-dimen{
width: 83%;
}

.edit-form{
  height:42px!important;
  width: 160%!important;
}
.edit-select{
  height:42px!important;
  width: 155%!important;
}
</style>
