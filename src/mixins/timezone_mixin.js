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
      const userTZ = moment.tz.guess();
      const gmtDate = moment
        .tz(date, userTZ)
        .tz('GMT')
        .format('YYYY-MM-DD HH:mm ZZ');
      const UTCDate = moment.utc(gmtDate);
      return UTCDate;
    },
  },
};
export default timezone;