export default {
  methods: {
    phone_validate: function(value)
    {
      return phoneUtil.isValidNumber(phoneUtil.parse(value))
    }
  }
}
