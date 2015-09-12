export let serviceName = 'notifications';
export default /*@ngInject*/ function notifications(
  $cordovaLocalNotification,
  $rootScope,
  $window,
  $timeout,
  $q,
  devices,
  identity,
  navigation,
  state,
  R
) {
  let contacts;
  let activeWebNotifications = {};
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
      smallIcon: 'res://icon.png',
      data: notificationInfo
    };

    return $cordovaLocalNotification.schedule(cordovaNotificationInfo);
  };

  let notifyWeb = function notifyWeb(notificationInfo) {
    if (!$window.Notification) {
      return $q.when();
    }
    let channelId = notificationInfo.id;
    let channelCursor = state.cloud.channels.select([channelId]);
    let contactId = channelCursor.get(['channelInfo', 'contactIds'])[0];
    let contactCursor = state.cloud.contacts.select(contactId);
    let contactInfo = contactCursor.get('userInfo');

    let webNotificationOptions = {
      body: getNotificationMessage(notificationInfo.id),
      icon: identity.getAvatar(contactInfo),
      tag: notificationInfo.id
    };

    let notificationTitle = contactInfo.displayName || 'Anonymous';

    activeWebNotifications[notificationInfo.id] =
      new Notification(notificationTitle, webNotificationOptions);

    let notificationInstance = activeWebNotifications[notificationInfo.id];
    $timeout(() => {
      notificationInstance.close();
    }, 5000, false);

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
    return $cordovaLocalNotification
      .clear(notificationInfo.cordovaNotificationId);
  };

  let dismissWeb = function dismissWeb(notificationInfo) {
    if (!$window.Notification) {
      return $q.when();
    }
    return $q.when();
  };

  let dismiss = function dismiss(notificationId) {
    let cordovaNotificationId = getCordovaNotificationId(notificationId);

    if (isDismissed(notificationId)) {
      return $q.when();
    }

    let dismissNative = (notificationInfo) => {
      return devices.isCordovaApp() ?
        dismissCordova(notificationInfo) :
        dismissWeb(notificationInfo);
    };

    let notificationCursor = state.cloud.notifications.select([notificationId]);

    let notificationInfo = {
      id: notificationId,
      cordovaNotificationId
    };

    return dismissNative(notificationInfo)
      .then(() => state.save(notificationCursor, ['dismissed'], true));
  };

  let isDismissed = function isDismissed(notificationId) {
    return state.cloud.notifications.get([notificationId, 'dismissed']);
  };

  $rootScope.$on('$cordovaLocalNotification:click', (event, notification) => {
    let viewId = JSON.parse(notification.data).id;

    if (viewId === 'home') {
      return navigation.navigate(viewId);
    }

    let channelId = viewId;
    let channelCursor = state.cloud.channels.select([channelId]);

    if (channelCursor.get(['inviteStatus'])  === 'received') {
      return contacts.showAcceptInviteDialog(channelId);
    }

    return navigation.navigate(channelId)
      .then(() => state.save(channelCursor, ['viewingLatest'], true));
  });

  let initialize = function initialize(contactsService) {
    contacts = contactsService;

    if (devices.isCordovaApp()) {
      let notificationsCursor = state.cloud.notifications;
      let updateOngoingNotification = () => {
        let notificationCount = R.pipe(
          R.values,
          R.reject(R.prop('dismissed'))
        )(notificationsCursor.get()).length;

        let message;
        if (notificationCount === 0) {
          message = 'No new notifications';
        }
        else if(notificationCount === 1) {
          message = '1 new notification';
        }
        else {
          message = `${notificationCount} new notifications`;
        }

        return $cordovaLocalNotification.schedule({
          id: 0,
          title: 'Toc Messenger',
          text: message,
          sound: 'res://platform_default',
          icon: 'res://icon.png',
          smallIcon: 'res://icon.png',
          data: { id: 'home' },
          ongoing: devices.isAndroidApp()
        });
      };

      state.addListener(notificationsCursor, updateOngoingNotification);
    }

    if (devices.isWebApp()) {
      if (!$window.Notification) {
        return $q.when();
      }

      $window.Notification.requestPermission();
    }

    return $q.when();
  };

  return {
    isDismissed,
    notify,
    dismiss,
    initialize
  };
}
