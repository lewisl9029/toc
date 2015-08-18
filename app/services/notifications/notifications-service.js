export let serviceName = 'notifications';
export default /*@ngInject*/ function notifications(
  state,
  time
) {
  let notify = function notify(notificationId) {
    return state.save(
      state.cloud.notifications,
      [notificationId, 'notificationInfo'],
      { id: notificationId }
    );
  };

  let dismiss = function dismiss(notificationId) {

  };

  return {
    notify,
    dismiss
  };
}
