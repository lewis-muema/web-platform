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
      const gmtDate = moment.tz(date, 'YYYY-MM-DD HH:mm ZZ', userTZ);
      const UTCDate = moment.utc(gmtDate);
      return UTCDate;
    },
    dashboardTimer(orderTime) {
      const localTime = this.convertToLocalTime(orderTime);
      const timer = moment(localTime).toDate();
      const now = moment(new Date());
      if (moment.duration(now.diff(timer)).asHours() <= 24) {
        const timer1 = moment(timer, 'YYYYMMDD, h:mm:ss a').fromNow();
        return timer1;
      }
      const timer1 = moment(timer).format('ddd, Do MMM YYYY, hh:mm A');
      return timer1;
    },
    formatExpiryDate(date) {
      const localDate = this.convertToUTCToLocal(date);

      const now = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
      const diff = moment(localDate).diff(now, 'months');
      const status = diff >= 1 ? 'green' : 'red';
      const formattedDate = moment(localDate).format('MMM D, YYYY');

      return { status, expiryDate: formattedDate };
    },
  },
};
export default timezone;
