export let serviceName = 'notifications';
export default /*@ngInject*/ function notifications(
  state
) {
  let notificationsCursor = state.cloud.notifications;

  let notify = function notify(notificationType, notificationId) {
    return state.save(
      notificationsCursor,
      [notificationType, notificationId, 'notificationInfo'],
      { id: notificationId }
    );
  };

  return {
    notify
  };
}
