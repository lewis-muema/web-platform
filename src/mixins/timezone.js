const moment = require('moment-timezone');

const timezone = {
  methods: {
    convertToUTCToLocal(date) {
      const formated = moment
        .utc(date)
        .local()
        .format('YYYY-MM-DD HH:mm:ss');
      return formated;
    },
    convertToLocalTime(date) {
      const localTime = moment(date)
        .local()
        .format('YYYY-MM-DD HH:mm:ss');
      return localTime;
    },
    convertToUTC(date) {
      const tzDate = moment(date)
        .tz('Etc/GMT+1')
        .format('YYYY-MM-DD HH:mm ZZ');

      const UTCDate = moment.utc(tzDate);
      return UTCDate;
    },
  },
};
export default timezone;
