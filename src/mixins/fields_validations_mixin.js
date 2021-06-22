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
  },
};
export default inputValidationMixin;
