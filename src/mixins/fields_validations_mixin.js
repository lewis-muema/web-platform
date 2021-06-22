import validations from './fields_configuration_mixin';

const inputValidationMixin = {
  methods: {
    fieldValidations(input, val) {
      const resp = validations.find(elem => elem.field === input);

      if (resp !== undefined) {
        const validationRule = resp.rule;
        return validationRule.test(val);
      }

      return true;
    },
    fieldValidationsError(input) {
      const resp = validations.find(elem => elem.field === input);

      if (resp !== undefined) {
        const validationError = resp.error;
        return validationError;
      }

      return '';
    },
  },
};
export default inputValidationMixin;
