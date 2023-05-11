// eslint-disable-next-line import/no-unresolved
import validations from './fields_configuration_mixin';

const inputValidationMixin = {
  methods: {
    fieldValidations(input, val) {
      const resp = validations.find((elem) => elem.field === input);
      if (input === 'user_name') {
        let name;
        val.split(' ').forEach((row, index) => {
          if (index === 0) {
            name = row.charAt(0).toUpperCase() + row.slice(1);
          } else {
            name = `${name} ${row.charAt(0).toUpperCase() + row.slice(1)}`;
          }
        });
        // eslint-disable-next-line no-param-reassign
        val = name;
      }
      if (resp !== undefined) {
        const validationRule = resp.rule;
        return validationRule.test(val);
      }

      return true;
    },
    fieldValidationsError(input) {
      if (input === 'user_name') {
        return this.$t('general.user_name_error');
      }
      if (input === 'biz_name') {
        return this.$t('general.biz_name_error');
      }

      return '';
    },
  },
};
export default inputValidationMixin;
