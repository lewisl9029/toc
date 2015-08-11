export let serviceName = 'time';
export default /*@ngInject*/ function time(
  $interval,
  $window,
  $q,
  moment,
  R
) {
  let getTime = () => $window.Date.now();

  let getTimestamp = (time) => {
    let messageTime = moment(time);

    let now = moment();

    if (messageTime.isSame(now, 'day')) {
      return messageTime.format('LT');
    }

    return `${messageTime.format('l')} ${messageTime.format('LT')}`;
  };

  let isMinuteDifferent = R.memoize((time1, time2) => {
    return moment(time1).minutes() !== moment(time2).minutes();
  });

  let initialize = function initialize() {
    moment.locale('en', {
      relativeTime : {
        future: 'just now',
        past:   '%s ago',
        s:  'seconds',
        m:  'a minute',
        mm: '%d minutes',
        h:  'an hour',
        hh: '%d hours',
        d:  'a day',
        dd: '%d days',
        M:  'a month',
        MM: '%d months',
        y:  'a year',
        yy: '%d years'
      }
    });

    return $q.when();
  };

  let timeService = {
    getTime,
    getTimestamp,
    isMinuteDifferent,
    initialize,
    moment
  };

  $window.tocTime = timeService;

  return timeService;
}
