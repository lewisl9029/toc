export let serviceName = 'notifications';
export default /*@ngInject*/ function notifications(
  state
) {
  let notify = function notify(
    notificationType, notificationId,
    notificationInfo = { id: notificationId }
  ) {
    return state.save(
      state.cloud.notifications,
      [notificationType, notificationId, 'notificationInfo'],
      notificationInfo
    );
  };

  return {
    notify
  };
}
