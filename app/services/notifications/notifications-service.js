export let serviceName = 'notifications';
export default /*@ngInject*/ function notifications(
  $cordovaLocalNotification,
  $q,
  state
) {
  // cordovaLocalNotification uses number IDs
  // notificationId is just channelId, and has the form toc-{32hex-chars}
  // we translate channelId to cordovaNotificationId by parsing the last 8 hex
  // because js ints lack the precision to represent more than 52 bits
  // FIXME: there is a non-negligible chance for collisions here
  // but I can't think of any good alternatives atm
  let getCordovaNotificationId = (notificationId) => {
    let lastEightHex = notificationId.substr(notificationId.length - 8);
    return parseInt(lastEightHex, 16);
  };

  let notify = function notify(notificationId) {
    let cordovaId = getCordovaNotificationId(notificationId);
    return state.save(
        state.cloud.notifications,
        [notificationId, 'notificationInfo'],
        { id: notificationId, cordovaId }
      )
      .then(() => state.save(
        state.cloud.notifications,
        [notificationId, 'dismissed'],
        false
      ));
  };

  let dismiss = function dismiss(notificationId) {
    if (isDismissed(notificationId)) {
      return $q.when();
    }

    return state.save(
      state.cloud.notifications,
      [notificationId, 'dismissed'],
      true
    );
  };

  let isDismissed = function isDismissed(notificationId) {
    return state.cloud.notifications.get([notificationId, 'dismissed']);
  };

  let initialize = function initialize() {
    return $q.when();
  };

  return {
    isDismissed,
    notify,
    dismiss,
    initialize
  };
}
