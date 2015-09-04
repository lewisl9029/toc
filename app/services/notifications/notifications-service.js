export let serviceName = 'notifications';
export default /*@ngInject*/ function notifications(
  $q,
  state
) {
  let notify = function notify(notificationId) {
    return state.save(
        state.cloud.notifications,
        [notificationId, 'notificationInfo'],
        { id: notificationId }
      )
      .then(() => state.save(
        state.cloud.notifications,
        [notificationId, 'dismissed'],
        false
      ));
  };

  let dismiss = function dismiss(notificationId) {
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
