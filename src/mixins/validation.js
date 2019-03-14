export default {
  methods: {
    phone_validate(value) {
      return phoneUtil.isValidNumber(phoneUtil.parse(value));
    },
  },
};
