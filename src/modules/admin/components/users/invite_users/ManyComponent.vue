<template lang="html">
  <div class="inv-container">
    <div class="row many--row">
      <form class="col s12">
        <div class="row textarea--row">
          <div class="input-field col s12 inviteMany--textarea">
            <textarea
              id="email_area"
              v-model="emailSet"
              class="inviteMany--textareabox"
            />
            <div class="active inviteMany--text">
              Enter multiple email addresses separated by a comma
            </div>
          </div>
        </div>
      </form>
      <div class="side-flex many-flex many-action-buttons">
        <div class="column-flex space-right">
          <a
            class="show-link-justify"
            @click="get_inv"
          >Cancel</a>
        </div>
        <div class="column-flex">
          <button
            class="button-primary"
            type="submit"
            name="action"
            @click="inv_many"
          >
            Add Invitees
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import NotificationMxn from '../../../../../mixins/notification_mixin';

export default {
  name: 'ManyComponent',
  components: {},
  mixins: [NotificationMxn],
  data() {
    return {
      emailSet: '',
      cancelInvite: false,
      inviteMany: false,
    };
  },
  computed: {
    ...mapGetters({
      getState: '$_admin/getViewState',
    }),
  },
  methods: {
    ...mapMutations({
      updateViewState: '$_admin/setViewState',
      newAdds: '$_admin/newAdds',
      updateInvites: '$_admin/updateInvites',
    }),
    get_inv() {
      this.updateViewState(1);
      this.cancelInvite = true;
    },
    inv_many() {
      if (this.emailSet !== '') {
        const set = this.emailSet;
        const emails = set.split(',');
        const number = emails.length;
        const data = new Array();
        for (let x = 0; x < number; x += 1) {
          data[x] = new Array(emails[x], '', '');
        }
        this.newAdds(number);
        this.updateInvites(data);
        this.updateViewState(1);
        this.inviteMany = true;
      } else {
        const level = 2;
        const notification = {
          title: '',
          level,
          message: 'Please enter valid email address separated by a comma.',
        }; // notification object
        this.displayNotification(notification);
      }
    },
  },
};
</script>

<style lang="css">
.many-flex {
    width: 50%;
}

.inviteMany--text {
    font-size: 14px;
    color: #555;
    margin-top: 20px;
}

.many--row {
    width: 100% !important;
    display: inline !important;
}

.btn-cancel {
    background-color: transparent !important;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2) !important;
    color: #333 !important;
    border: none !important;
    width: 200px!important;
}

.btn-submit {
    font-size: 14px !important;
    width: 200px!important;
}

.inviteMany--textarea {
    width: 100% !important;
    height: 120px!important;
    margin-top: 0rem !important;
}
.inviteMany--textareabox {
    width: 100% !important;
    height: 120px!important;
    font-family: 'Rubik', sans-serif !important;
    font-size: 14px !important;
    color: #555 !important;
    border: 1px solid #dcdfe6 !important;
    border-radius: 4px !important;
    margin-top: 1.3rem !important;
}
.inviteMany--textareabox:focus{
    border: 1px solid #007FFF !important;
    -webkit-box-shadow: none !important;
    outline:none;
    box-shadow: none !important;
}
.textarea--row{
    margin-bottom: 50px !important;
}
.hiddendiv {
    visibility: hidden;
    white-space: pre-wrap;
    word-wrap: break-word;
    overflow-wrap: break-word;
    padding-top: 1.2rem;
    position: absolute;
    top: 0;
    z-index: -1;
}
.many-action-buttons {
    float: right !important;
}
</style>
