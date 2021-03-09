const moment = require('moment-timezone');

moment.locale('fr', {
  months: 'janvier_février_mars_avril_mai_juin_juillet_août_septembre_octobre_novembre_décembre'.split('_'),
  monthsShort: 'janv._févr._mars_avr._mai_juin_juil._août_sept._oct._nov._déc.'.split('_'),
  monthsParseExact: true,
  weekdays: 'dimanche_lundi_mardi_mercredi_jeudi_vendredi_samedi'.split('_'),
  weekdaysShort: 'dim._lun._mar._mer._jeu._ven._sam.'.split('_'),
  weekdaysMin: 'Di_Lu_Ma_Me_Je_Ve_Sa'.split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'DD/MM/YYYY',
    LL: 'D MMMM YYYY',
    LLL: 'D MMMM YYYY HH:mm',
    LLLL: 'dddd D MMMM YYYY HH:mm',
  },
  calendar: {
    sameDay: '[Aujourd’hui à] LT',
    nextDay: '[Demain à] LT',
    nextWeek: 'dddd [à] LT',
    lastDay: '[Hier à] LT',
    lastWeek: 'dddd [dernier à] LT',
    sameElse: 'L',
  },
  relativeTime: {
    future: 'dans %s',
    past: 'il y a %s',
    s: 'quelques secondes',
    m: 'une minute',
    mm: '%d minutes',
    h: 'une heure',
    hh: '%d heures',
    d: 'un jour',
    dd: '%d jours',
    M: 'un mois',
    MM: '%d mois',
    y: 'un an',
    yy: '%d ans',
  },
  dayOfMonthOrdinalParse: /\d{1,2}(er|e)/,
  ordinal(number) {
    return number + (number === 1 ? 'er' : 'e');
  },
  meridiemParse: /PD|MD/,
  isPM(input) {
    return input.charAt(0) === 'M';
  },
  // In case the meridiem units are not separated around 12, then implement
  // this function (look at locale/id.js for an example).
  // meridiemHour : function (hour, meridiem) {
  //     return /* 0-23 hour, given meridiem token and hour 1-12 */ ;
  // },
  meridiem(hours) {
    return hours < 12 ? 'PD' : 'MD';
  },
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 4, // Used to determine first week of the year.
  },
});
moment.locale(localStorage.getItem('timeLocale'));
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
