<template lang="html">
  <div class="">
    <div class="inv-container inv-justify">
      <div class="inv-inputs">
        <div
          v-for="element in elements"
          class="side-flex inp"
        >
          <input
            v-model="element.email"
            class="form-control"
            type="text"
            name="email"
            placeholder="name@example.com"
          >
          <input
            v-model="element.name"
            class="form-control"
            type="text"
            name="name"
            :placeholder="$t('inviteComponent.full_name')"
          >
          <el-select
            v-model="element.department"
            class="addUser--select"
            :placeholder="$t('inviteComponent.department')"
            filterable
          >
            <el-option
              v-for="department in departments"
              :key="department.department_id"
              :label="department.department_name"
              :value="department.department_id"
            />
          </el-select>
        </div>
      </div>
    </div>
    <div class="side-flex add-user-submit">
      <div class="column-flex pad-flex alleft">
        <div class="addUser--link">
          <a
            class="add-anchor"
            @click="addElement"
          ><i class="el-icon-circle-plus-outline" />&nbsp;{{ $t('inviteComponent.add_another')}}</a>
          <span> or </span>
          <a
            class="add-anchor"
            href="#"
            @click="invite_many"
          >{{$t('inviteComponent.add_many')}}</a>
        </div>
      </div>
      <div class="addUser--submit">
        <button
          class="button-primary"
          type="submit"
          name="action"
          @click="postInvites"
        >
          {{ button }}
        </button>
      </div>
    </div>

    <div class="side-flex add-user-submit">
      <div class="column-flex pad-flex inv-link">
        <div class="flex">
          <a
            class="add-anchor inviteMany--anchor"
            @click="getInviteLink"
          ><i class="el-icon-share" /><span>&nbsp;{{$t('inviteComponent.get_invite_link')}}</span></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations, mapActions } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'InviteComponent',
  components: {},
  mixins: [NotificationMxn],
  data() {
    return {
      value: '',
      button: this.$t('inviteComponent.send_invites'),
      elements: [
        {
          email: '',
          name: '',
          department: '',
        },
        {
          email: '',
          name: '',
          department: '',
        },
        {
          email: '',
          name: '',
          department: '',
        },
      ],
      invitees: [],
      invitation: false,
    };
  },
  computed: {
    ...mapGetters({
      departments: '$_admin/getDepartmentsList',
      getViewState: '$_admin/getViewState',
      getBizName: '$_admin/getBizName',
      getAdds: '$_admin/getAdds',
      getInvites: '$_admin/getInvites',
    }),
  },
  mounted() {
    const number = this.getAdds;
    if (number > 3) {
      for (let i = 3; i < number; i++) {
        this.elements.push({ value: '' });
      }
      this.populate();
    } else if (number === 3 && this.getInvites !== null) {
      this.populate();
    }
  },
  methods: {
    ...mapMutations({
      updateViewState: '$_admin/setViewState',
      updateInvites: '$_admin/updateInvites',
      updateDepartmentsList: '$_admin/updateDepartmentsList',
      postInvites: '$_admin/postInvites',
      updateBizName: '$_admin/updateBizName',
    }),
    ...mapActions({
      inviteNewUsers: '$_admin/inviteNewUsers',
      createInviteLink: '$_admin/createInviteLink',
    }),
    populate() {
      const set = this.getInvites;
      for (let i = 0; i < set.length; i += 1) {
        this.elements[i].email = set[i][0];
      }
    },
    get_link() {
      this.updateViewState(5);
    },
    invite_many() {
      this.updateViewState(3);
    },
    postInvites() {
      for (let i = 0, iLen = this.elements.length; i < iLen; i += 1) {
        const { email } = this.elements[0];
        if (email !== '') {
          this.button = this.$t('inviteComponent.sending');
          const session = this.$store.getters.getSession;
          let cop_id = 0;
          if (session.default === 'biz') {
            cop_id = session[session.default].cop_id;
          }


          if (this.elements[i].email !== '' && this.elements[i].department !== '') {
            const { email } = this.elements[i];
            const { name } = this.elements[i];
            const { department } = this.elements[i];
            this.invitees.push({
              cop_id,
              email,
              password: '',
              name,
              department_id: department,
            });
            this.invitation = true;
            const payload = this.invitees;
            const fullPayload = {
              values: payload,
              vm: this,
              app: 'NODE_PRIVATE_API',
              endpoint: 'invite_user',
            };
            this.$store.dispatch('$_admin/inviteNewUsers', fullPayload).then(
              (response) => {
                this.button = 'Send Invites';
                if (response.status) {
                  const level = 1;
                  const notification = {
                    title: this.$t('inviteComponent.add_user'),
                    level,
                    message: this.$t('inviteComponent.invitations_sent_successful'),
                  };
                  this.inviteLog(payload);
                  this.displayNotification(notification);
                  this.updateViewState(4);
                }
              },
              (error) => {
                // ...
              },
            );
          } else if (!this.invitation) {
            this.button = this.$t('inviteComponent.send_invites');
            const level = 2;
            const notification = {
              title: this.$t('inviteComponent.send_invites'),
              level,
              message: this.$t('inviteComponent.select_department'),
            };
            this.displayNotification(notification);
          }
        } else {
          this.button = this.$t('inviteComponent.send_invites');

          const level = 2;
          const notification = {
            title: this.$t('inviteComponent.send_invites'),
            level,
            message: this.$t('inviteComponent.valid_email'),
          }; // notification object
          this.displayNotification(notification);
        }
      }
    },
    inviteLog(invitees) {
      let analyticsEnv = '';
      try {
        analyticsEnv = process.env.CONFIGS_ENV.ENVIRONMENT;
      } catch (er) {
        // ...
      }
      for (let i = 0, iLen = invitees.length; i < iLen; i += 1) {
        if (analyticsEnv === 'production') {
          // track invitees

          mixpanel.track('User Invite', {
            'Account Type': 'Business',
            'Last Login': new Date(),
            'Client Type': 'Web Platform',
            'Invitee Email': invitees[i].email,
          });
        }
      }
    },
    addElement() {
      this.elements.push({ value: '' });
    },
    getInviteLink() {
      const session = this.$store.getters.getSession;
      let cop_id = 0;
      if (session.default === 'biz') {
        cop_id = session[session.default].cop_id;
        cop_id = cop_id.toString();
      }
      const payload = {
        cop_id,
      };
      const fullPayload = {
        values: payload,
        vm: this,
        app: 'NODE_PRIVATE_API',
        endpoint: 'create_invite',
      };
      this.$store.dispatch('$_admin/createInviteLink', fullPayload).then(
        (response) => {
          this.updateViewState(5);
          const level = 1; // success
          const notification = {
            title: this.$t('inviteComponent.send_invites'),
            level,
            message: this.$t('inviteComponent.link_created'),
          }; // notification object
          this.displayNotification(notification);
        },
        (error) => {
          const level = 2;
          const notification = {
            title: this.$t('inviteComponent.invite_link'),
            level,
            message: this.$t('inviteComponent.error_occurred'),
          }; // notification object
          this.displayNotification(notification);
        },
      );
    },
  },
};
</script>

<style lang="css">

.addUser--select {
    width: 100%;
}

.addUser--submit {
    margin-right: 6.5%;
}

.btn-submit {
    font-size: 14px;
}

a {
    color: #1782c5;
    text-decoration: none;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
}

i.right {
    float: right;
    margin: 5px 0 5px 15px;
}

.add-user-submit {
    /*margin-top: 40px;*/
    padding: 20px;
    margin: 30px !important;
}

.error {
    justify-content: center;
}

.inp > .column-flex {
    align-items: flex-start;
    margin-right: 5px;
}

.alright {
    align-items: flex-end;
}

.or-div {
    align-items: center;
    justify-content: center;
    font-size: xx-large;
}

.alleft {
    justify-content: flex-end;
    align-items: flex-start;
}

.inv-link {
    padding-top: 5%;
}

.flex {
    display: flex;
}

.alleft > div {
    display: flex;
    align-items: center;
}

.alleft span {
    padding-left: 5px;
    padding-right: 5px;
}

.add-anchor {
    display: flex;
    align-items: center;
    /*margin-left: 1.7%;*/
}

.inviteMany--anchor {
    margin-left: 1.7% !important;
}

.addUser--link {
    margin-left: 1.7%;
}

.add-anchor:hover {
    text-decoration: none !important;
    border-bottom: 1.5px solid !important;
    margin-bottom: -2px !important;
}

.plus-icon {
    font-size: 20px !important;
    padding-right: 3px;
}

.select-wrapper {
    width: 100%;
}

.inv-justify {
    margin-top: -1.29rem !important;
}

.inv-inputs {
    margin-top: 30px;
}
</style>
