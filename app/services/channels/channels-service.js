export default function channels($q, state, network) {
  const CHANNELS_PATH = ['channels'];
  const CHANNELS_CURSORS = {
    synchronized: state.synchronized.tree.select(CHANNELS_PATH)
  };
  const CHANNEL_ID_PREFIX = 'toc-';
  const INVITE_CHANNEL_ID = CHANNEL_ID_PREFIX + 'invite';

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

  let initialize = function initialzeChannels() {
    return network.listen({id: INVITE_CHANNEL_ID});
  };

  return {
    CHANNELS_CURSORS,
    createContactChannel,
    initialize
  };
}
