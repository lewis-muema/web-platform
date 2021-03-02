<template lang="html">
  <div class="user-invite-outer">
    <header-component />
    <bod-component v-if="received_response" />
  </div>
</template>

<script>
import Vue from 'vue';
import { mapMutations, mapActions } from 'vuex';
import VeeValidate, { Validator } from 'vee-validate';
import externalStore from './_store';
import RegisterStoreModule from '../../mixins/register_store_module';
import HeaderComponent from './components/HeaderComponent.vue';
import BodComponent from './components/BodComponent.vue';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

Vue.use(VeeValidate);

Validator.extend('check_phone', {
  getMessage: field => this.$('count.phone'),
  validate: (value) => {
    let validity = false;
    try {
      const rawNumber = phoneUtil.parseAndKeepRawInput(value);
      const numberCode = phoneUtil.getRegionCodeForNumber(rawNumber);
      const number = phoneUtil.parse(value, numberCode);
      validity = phoneUtil.isValidNumber(number);
    } catch (e) {
      validity = false;
    }
    return validity;
  },
});

export default {
  name: 'External',
  components: { HeaderComponent, BodComponent },
  mixins: [RegisterStoreModule],
  data() {
    return {
      received_response: false,
    };
  },
  created() {
    this.$store.registerModule('$_external', externalStore);
  },
  mounted() {
    this.check_validity();
  },
  methods: {
    ...mapActions({
      requestTokenValidation: '$_external/requestTokenValidation',
    }),
    ...mapMutations({
      updateCopID: '$_external/updateCopID',
      updateBizName: '$_external/updateBizName',
      updateDeptID: '$_external/updateDeptID',
      updatePerEmail: '$_external/updatePerEmail',
      updateName: '$_external/updateName',
      updateInviteType: '$_external/updateInviteType',
      updateCopUserID: '$_external/updateCopUserID',
    }),
    check_validity() {
      let type = '';
      const { content } = this.$route.params;
      const { tag } = this.$route.params;

      if (this.$route.params.type === 'link') {
        type = 1;
      } else if (this.$route.params.type === 'email') {
        type = 0;
      }
      const values = {};
      values.type = type;
      values.content = content;
      values.tag = tag;
      const fullPayload = {
        values,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'onboard_details',
      };
      this.requestTokenValidation(fullPayload).then(
        (response) => {
          if (response.length > 0) {
            response = response[0];
          }

          if (response.status) {
            let deptId = 1;
            if (response.data.department_id) {
              deptId = response.data.department_id;
            }

            this.updateCopID(response.data.cop_id);
            this.updateBizName(response.data.cop_name);
            this.updateDeptID(deptId);
            this.updatePerEmail(response.data.email);
            this.updateName(response.data.name);
            this.updateCopUserID(response.data.cop_user_id);
            this.updateInviteType(type);
            this.received_response = true;
          } else {
            this.$router.push('/auth');
          }
        },
        (error) => {
          // ...
        },
      );
    },
  },
};
</script>

<style lang="css">
.user-invite-outer{
  background-color: #fcfcfc;
}
</style>
