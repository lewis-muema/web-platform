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
          @click="one_step_back"
        />
      </div>

      <div class="admin-edit2-details">
        {{ $t( 'editUser.edit_user') }}
      </div>
      <div class="edit-position">
        <div class="edit-holder edit-dimen">
          <input
            v-model="userDetails.name"
            class="input-control edit-form"
            type="text"
            style="margin-top: 14%;"
            name="name"
            :placeholder="$t( 'editUser.name')"
            autocomplete="off"
          >
        </div>

        <div class="edit-holder edit-dimen">
          <input
            v-model="userDetails.email"
            v-validate="'required|email'"
            class="input-control edit-form"
            type="text"
            name="email"
            :placeholder="$t('editUser.email')"
          >
          <p class="edit-details-data-error">
            {{ errors.first('email') }}
          </p>
        </div>

        <div class="edit-holder edit-dimen">
          <vue-tel-input
            v-model.trim="userDetails.phone"
            v-validate="'required|check_phone'"
            class="form-control edit-form"
            name="phone"
            value=""
            :placeholder="$t('editUser.phone')"
            data-vv-validate-on="blur"
            v-bind="phoneInputProps"
            @onBlur="validate_phone"
          />
        </div>

        <div class="edit-holder">
          <el-select
            v-model="userDetails.department_id"
            class="addUser--select edit-details-select"
            :placeholder="$t('editUser.department')"
            filterable
          >
            <el-option
              v-for="depart in departments"
              :key="depart.department_id"
              :label="depart.department_name"
              :value="depart.department_id"
            />
          </el-select>
        </div>

        <div class="edit-holder">
          <el-select
            v-model="userDetails.status"
            class="addUser--select edit-details-select"
            :placeholder="$t('editUser.status')"
            filterable
          >
            <el-option
              v-for="status in statuses"
              :key="status.status"
              :label="status.status_label"
              :value="status.status"
            />
          </el-select>
        </div>

        <div class="edit-holder">
          <el-select
            v-model="userDetails.type"
            class="addUser--select edit-details-select"
            :placeholder="$t('editUser.user_type')"
            filterable
          >
            <el-option
              v-for="type in types"
              :key="type.type"
              :label="type.type_name"
              :value="type.type"
            />
          </el-select>
        </div>

        <div class="sign-holder">
          <button
            id="UpdateEdit"
            class="button-primary btn-edit-user"
            type="submit"
            @click="update_edit"
          >
            {{ $t( 'editUser.update') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import NotificationMxn from '../../../../mixins/notification_mixin';

export default {
  name: 'EditUser',
  mixins: [NotificationMxn],
  data() {
    return {
      userDetails: {},
      message: '',
      available: false,
      statuses: [
        {
          status: 1,
          status_label: this.$t('editUser.active'),
        },
        {
          status: 2,
          status_label: this.$t('editUser.deactivate'),
        },
      ],
      types: [
        {
          type: 1,
          type_name: this.$t('editUser.normal'),
        },
        {
          type: 2,
          type_name: this.$t('editUser.admin'),
        },
      ],
      phoneInputProps: {
        mode: 'international',
        defaultCountry: 'ke',
        disabledFetchingCountry: false,
        disabled: false,
        disabledFormatting: false,
        placeholder: this.$t('general.enter_phone_number'),
        required: false,
        enabledCountryCode: false,
        enabledFlags: true,
        preferredCountries: ['ke', 'ug', 'tz'],
        autocomplete: 'off',
        name: 'telephone',
        maxLen: 25,
        dropdownOptions: {
          disabledDialCode: false,
        },
        inputOptions: {
          showDialCode: false,
        },
      },
    };
  },
  computed: {
    ...mapGetters({
      userData: '$_admin/getUsersList',
      departments: '$_admin/getDepartmentsList',
    }),
  },
  mounted() {
    const cop_user_id = this.$route.params.id;
    this.userDetails = this.userData.filter(user => user.cop_user_id == cop_user_id)[0];

    if (this.userDetails !== undefined) {
      this.available = true;
    } else {
      this.available = false;
      this.one_step_back();
    }
  },
  methods: {
    ...mapActions({
      editAdminUser: '$_admin/editAdminUser',
    }),
    validate_phone() {
      this.$validator.validate();
    },
    update_edit() {
      if (
        this.fieldValidations('user_name', this.userDetails.name)
        && this.userDetails.name !== ''
        && this.userDetails.email !== ''
        && this.userDetails.phone !== ''
      ) {
        const payload = {};
        payload.cop_user_id = this.userDetails.cop_user_id;
        payload.user_name = this.userDetails.name;
        payload.user_phone = this.userDetails.phone;
        payload.department_id = this.userDetails.department_id;
        payload.user_type = this.userDetails.type;
        payload.user_email = this.userDetails.email;
        payload.status = this.userDetails.status;

        const editUserFullPayload = {
          values: payload,
          app: 'NODE_PRIVATE_API',
          endpoint: 'update_user',
        };
        this.$store.dispatch('$_admin/editAdminUser', editUserFullPayload).then(
          (response) => {
            const level = 1; // success
            this.message = this.$t('editUser.edit_successful');

            const notification = { title: '', level, message: this.message }; // notification object
            this.displayNotification(notification);
          },
          (error) => {
            const level = 3;
            this.message = this.$t('editUser.something_went_wrong');
            const notification = { title: '', level, message: this.message }; // notification object
            this.displayNotification(notification);

            // vm.one_step_back()
          },
        );
      } else {
        const level = 3;

        this.message = this.$t('general.provide_all_details');
        if (!this.fieldValidations('user_name', this.userDetails.name)) {
          this.message = this.fieldValidationsError('user_name');
        }
        const notification = { title: '', level, message: this.message }; // notification object
        this.displayNotification(notification);
      }
    },
    one_step_back() {
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

.edit-details-select {
    height: 42px !important;
    width: 149% !important;
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
.edit-details-data-error{
  margin-right: 3%;
  font-size: 13px;
  font-family: 'Nunito', sans-serif;
  color: #e08445;
  text-align: left;
  width: 112% !important;
}
.edit-form > .vti__dropdown >.vti__dropdown-list{
  margin-top: 13% !important;
  width: 385px !important;
}
</style>
