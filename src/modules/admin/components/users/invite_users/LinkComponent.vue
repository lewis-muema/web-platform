<template lang="html">
  <div class="inv-container">
    <div class="up-flex">
      <div
        class="input-spaced"
        style="display: none;"
      >
        <el-select
          v-model="value"
          class="addUser--select"
          filterable
          :placeholder="$t('linkComponent.select')"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="input-spaced">
        <el-select
          v-model="value"
          class="addUser--select"
          filterable
          :placeholder="$t('linkComponent.select')"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div class="side-flex mid-btn">
        <a @click="get_inv">{{ $t('linkComponent.cancel') }}</a>
        <button
          class="button-primary"
          type="submit"
          name="action"
          @click="get_link"
        >
          {{ $t('linkComponent.create_link') }}
        </button>
      </div>
    </div>
    <div class="side-flex side-desc">
      {{ $t('linkComponent.use_link_to_join', {getBizName: getBizName}) }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  name: 'LinkComponent',
  components: {},
  data() {
    return {
      options: [
        {
          value: 'Option1',
          label: 'Option1',
        },
        {
          value: 'Option2',
          label: 'Option2',
        },
        {
          value: 'Option3',
          label: 'Option3',
        },
        {
          value: 'Option4',
          label: 'Option4',
        },
        {
          value: 'Option5',
          label: 'Option5',
        },
      ],
      value: '',
    };
  },
  computed: {
    ...mapGetters({
      getState: '$_admin/getViewState',
      getDepartmentsList: '$_admin/getDepartmentsList',
      getBaseUrl: '$_admin/getBaseUrl',
      getBizName: '$_admin/getBizName',
    }),
  },
  methods: {
    ...mapMutations({
      updateViewState: '$_admin/setViewState',
      updateInviteLink: '$_admin/updateInviteLink',
    }),
    get_inv() {
      this.updateViewState(1);
    },
  },
};
</script>

<style lang="css">
.end-btn {
    justify-content: center;
    align-items: flex-end;
    padding-right: 0px !important;
    flex: .5 !important;
}

.cancel-btn {
    min-width: 124px;
}

.mid-btn {
    flex: .5 !important;
    justify-content: space-evenly;
    align-items: center;
}

.input-spaced {
    margin: 30px 0px 30px 0px;
}

.up-flex {
    margin: 0 auto;
    width: 70%;
}

.side-desc {
    font-size: initial;
    justify-content: center;
    align-items: center;
    margin-top: 50px;
    font-size: 14px !important;
    color: #9e9e9e !important;
}
.many--link{
    margin-top: -1rem !important;
}
</style>
