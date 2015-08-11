export let serviceName = 'time';
export default /*@ngInject*/ function time(
  $interval,
  $window,
  $q,
  moment,
  R
) {
  let getTime = () => $window.Date.now();

  let getTimestamp = R.memoize((time) => {
    return moment(time).format('LT');
  });

  let getDatestamp = R.memoize((time) => {
    return moment(time).calendar();
  });

  let isMinuteDifferent = R.memoize((time1, time2) => {
    return moment(time1).minutes() !== moment(time2).minutes();
  });

  let isDayDifferent = R.memoize((time1, time2) => {
    return moment(time1).dayOfYear() !== moment(time2).dayOfYear();
  });

  let initialize = function initialize() {
    moment.locale('en', {
      calendar : {
        lastDay : '[Yesterday]',
        sameDay : '[Today]',
        nextDay : '[Tomorrow]',
        lastWeek : 'll',
        nextWeek : 'll',
        sameElse : 'll'
      }
    });

    return $q.when();
  };

  let timeService = {
    getTime,
    getTimestamp,
    getDatestamp,
    isMinuteDifferent,
    isDayDifferent,
    initialize,
    moment
  };

  $window.tocTime = timeService;

  return timeService;
}
