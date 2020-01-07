import * as moment from 'moment';

const timezone = {
  methods: {
    convertToUTCToLocal(date) {
      const formated = moment.utc(date).local().format('YYYY-MM-DD HH:mm:ss');
      return formated;
    },
    convertToLocalTime(date) {
      const localTime = moment(date)
        .local()
        .format('YYYY-MM-DD HH:mm:ss');
      return localTime;
    },
    convertToUTC(date) {
      const UTCDate = moment.utc(date);
      return UTCDate;
    },
  },
};
export default timezone;
