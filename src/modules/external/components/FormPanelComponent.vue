<template lang="html">
  <div class="form-panel-outer">
    <onboarding-info-component v-if="getViewState === 1" />
    <email-validation-component v-if="getViewState === 2" />
    <password-validation-component v-if="getViewState === 3" />
    <complete-component v-if="getViewState === 4" />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import OnboardingInfoComponent from './OnboardingInfoComponent.vue';
import EmailValidationComponent from './EmailValidationComponent.vue';
import PasswordValidationComponent from './PasswordValidationComponent.vue';
import CompleteComponent from './CompleteComponent.vue';

export default {
  name: 'FormPanelComponent',
  components: {
    OnboardingInfoComponent,
    EmailValidationComponent,
    PasswordValidationComponent,
    CompleteComponent,
  },
  computed: {
    ...mapGetters({
      getViewState: '$_external/getViewState',
    }),
  },
  methods: {
    ...mapMutations({
      setViewState: '$_external/setViewState',
    }),
  },
};
</script>

<style lang="css">
.onboarding-user-header
{
  font-size: 28px;
  color: #333;
  line-height: 36px;
  font-weight: 700;
}

.form-inputs
{
  padding: 24px 0 6px;
  padding-right: 15%;
  padding-bottom: 40px;
  padding-top: 0px;
}

.divide
{
  width: 65%;
  border-top: 1px solid hsla(0,0%,73%,0);
  box-shadow: 0 -1px 0 rgba(0,0,0,.08);
  padding: 12px;
}

.form-submits
{
  display: flex;
  justify-content: space-between;
  width: 60%;
}
</style>
