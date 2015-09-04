export let serviceName = 'channels';
export default /*@ngInject*/ function channels(
  $q,
  R,
  state,
  cryptography
) {
  let network;
  const CHANNEL_ID_PREFIX = 'toc-';
  const INVITE_CHANNEL_ID = CHANNEL_ID_PREFIX + 'invite';

  let generateContactChannelId =
    function generateContactChannelId(userId, contactId) {
      let channelId = userId > contactId ?
        userId + '-' + contactId :
        contactId + '-' + userId;

      //channel ids need to be somewhat short because they're prefixed on
      // most storage keys (including on every message), so there are huge
      // storage usage implications
      let shortChannelId = cryptography.getSha256(channelId).substr(0, 32);

      return CHANNEL_ID_PREFIX + shortChannelId;
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

    let channelCursor = state.cloud.channels.select([
      channelInfo.id
    ]);

    let logicalClock = channelCursor.get('logicalClock');

    if (logicalClock === undefined) {
      return state.save(channelCursor, ['logicalClock'], 0);
    }
    return $q.when();
  };

  //Workaround for circular dependency between network and channel...
  let initialize = function initialize(networkService) {
    network = networkService;
    let existingChannels = state.cloud.channels.get();

    let initializingChannels = $q.all(R.pipe(
      R.values,
      R.reject(R.prop('inviteStatus')),
      R.map(R.prop('channelInfo')),
      R.map((channelInfo) => {
        return initializeChannel(channelInfo)
          .then(() => network.listen(channelInfo));
      })
    )(existingChannels));

    return initializingChannels;
  };

  return {
    INVITE_CHANNEL_ID,
    createContactChannel,
    initializeChannel,
    initialize
  };
}
