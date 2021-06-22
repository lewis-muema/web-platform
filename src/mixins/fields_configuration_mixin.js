/* eslint no-control-regex: "error" */

const validations = [
  {
    field: 'user_name',
    rule: /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)$/,
    required: true,
  },
  {
    field: 'biz_name',
    rule: /^([a-zA-Z]{2,}\s[a-zA-Z]{1,}'?-?[a-zA-Z]{2,}\s?([a-zA-Z]{1,})?)$/,
    required: true,
  },
];

export default validations;
