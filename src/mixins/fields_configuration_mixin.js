/* eslint no-control-regex: "error" */

const validations = [
  {
    field: 'user_name',
    rule: /^([A-Z]{1}[a-zA-Z]{2,}\s[A-Z]{1,}'?-?[a-zA-Z]{2,}?)*$/,
    required: true,
  },
  {
    field: 'biz_name',
    rule: /^\w/,
    required: true,
  },
];

export default validations;
