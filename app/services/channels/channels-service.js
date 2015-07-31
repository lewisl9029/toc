export default function channels(state) {
  const CHANNEL_ID_PREFIX = 'toc-';
  const INVITE_CHANNEL_ID = CHANNEL_ID_PREFIX + 'invite';

  let activeChannelUpdates = {};

  let generateContactChannelId =
    function generateContactChannelId(userId, contactId) {
      let channelId = userId > contactId ?
        userId + '-' + contactId :
        contactId + '-' + userId;

      return CHANNEL_ID_PREFIX + channelId;
    };

  let generateGroupChannelId =
    function generateGroupChannelId(userId, channelName) {
      let channelId = userId + channelName;

      return CHANNEL_ID_PREFIX + channelId;
    };

  let createContactChannel = function createContactChannel(userId, contactId) {
    let channelId = generateContactChannelId(userId, contactId);

    let channel = {
      id: channelId,
      contactIds: [contactId]
    };

    return channel;
  };

  let initializeChannel = function initializeChannel(channelInfo) {
    if (channelInfo.contactIds.length !== 1) {
      return $q.reject('Group chat not supported yet.');
    }

    return listen(channelInfo)
      .catch((error) => notification.error(error, 'Network Listen Error'))
      .then(() => {
        let sendStatusUpdate = () => sendStatus(channelInfo.contactIds[0], 1)
          .catch((error) => {
            if (error === 'timeout') {
              return $q.when();
            }

            return notification.error(error, 'Status Update Error');
          });

        sendStatusUpdate();
        activeChannelUpdates[channelInfo.id] = $interval(sendStatusUpdate, 15000);

        return $q.when();
      })
      .then(() => {
        let channelCursor = state.cloud.network.select([
          'channels', channelInfo.id
        ]);

        let logicalClock = channelCursor.get('logicalClock');

        if (logicalClock) {
          return $q.when();
        }

        logicalClock = 0;
        return state.save(channelCursor, ['logicalClock'], logicalClock);
      });
  };

  let initialize = function initialize() {
    let channels = state.cloud.network.get(['channels']);

    R.pipe(
      R.values,
      R.map(R.prop('channelInfo')),
      R.forEach(initializeChannel)
    )(channels);

    $window.onbeforeunload = () => {
      let contactsCursor = state.cloud.contacts;

      R.pipe(
        R.keys,
        R.forEach((contactId) => sendStatus(contactId, 0))
      )(contactsCursor.get());
    };

    return $q.when();
  };

  let destroy = function destroy() {
    R.pipe(
      R.values,
      R.forEach((activeChannel) => $interval.cancel(activeChannel))
    )(activeChannelUpdates);

    activeChannelUpdates = {};

    return $q.when();
  };

  return {};
}
