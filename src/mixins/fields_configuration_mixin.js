/* eslint no-control-regex: "error" */

const validations = [
  {
    field: 'user_name',
    rule: /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)$/,
    error: this.$t('general.user_name_error'),
    required: true,
  },
  {
    field: 'biz_name',
    rule: /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)$/,
    error: this.$t('general.biz_name_error'),
    required: true,
  },
];

export default validations;
