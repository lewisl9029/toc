export let serviceName = 'notifications';
export default /*@ngInject*/ function notifications(
  $cordovaLocalNotification,
  $q,
  devices,
  identity,
  state
) {
  // cordovaLocalNotification uses number IDs
  // notificationId is just channelId, and has the form toc-{32hex-chars}
  let getCordovaNotificationId = (notificationId) => {
    let lastEightHex = notificationId.substr(notificationId.length - 8);
    return parseInt(lastEightHex, 16);
  };

  let getNotificationMessage = function getNotificationMessage(notificationId) {
    let channelId = notificationId;
    let channelCursor = state.cloud.channels.select([channelId]);

    let notificationMessage;
    if (channelCursor.get(['inviteStatus']) === 'received') {
      return 'New invite received!';
    }

    let messageIdCursor = channelCursor.select(['latestMessageId']);
    let messageId = messageIdCursor.get();
    if (!messageId) {
      return '';
    }

    return state.cloud.messages.get([
      channelId, messageId, 'messageInfo', 'content'
    ]);
  };

  let notifyCordova = function notifyCordova(notificationInfo) {
    let channelId = notificationInfo.id;
    let channelCursor = state.cloud.channels.select([channelId]);
    let contactId = channelCursor.get(['channelInfo', 'contactIds'])[0];
    let contactCursor = state.cloud.contacts.select(contactId);
    let contactInfo = contactCursor.get('userInfo');

    let icon = identity.getAvatar(contactInfo);
    let title = contactInfo.displayName || 'Anonymous';
    let text = getNotificationMessage(notificationInfo.id);

    let cordovaNotificationInfo = {
      id: notificationInfo.cordovaNotificationId,
      title,
      text,
      icon,
      sound: 'res://platform_default',
      smallIcon: 'res://icon.png'
    };

    return $cordovaLocalNotification.schedule(cordovaNotificationInfo);
  };

  let notifyWeb = function notifyWeb(notificationInfo) {
    return $q.when();
  };

  let notify = function notify(notificationId) {
    let cordovaNotificationId = getCordovaNotificationId(notificationId);

    let notifyNative = (notificationInfo) => {
      if (devices.isInForeground()) {
        return $q.when();
      }

      return devices.isCordovaApp() ?
        notifyCordova(notificationInfo) :
        notifyWeb(notificationInfo);
    };

    let notificationCursor = state.cloud.notifications.select([notificationId]);

    let notificationInfo = {
      id: notificationId,
      cordovaNotificationId
    };

    return notifyNative(notificationInfo)
      .then(() => state.save(
        notificationCursor, ['notificationInfo'], notificationInfo
      ))
      .then(() => state.save(notificationCursor, ['dismissed'], false));
  };

  let dismissCordova = function dismissCordova(notificationInfo) {
    return $cordovaNotification
  };

  let dismissWeb = function dismissWeb(notificationInfo) {
    return $q.when();
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
