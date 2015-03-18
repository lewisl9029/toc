export default function channels($q, state, network, identity) {
  const CHANNELS_PATH = ['channels'];
  const CHANNELS_CURSORS = {
    synchronized: state.synchronized.tree.select(CHANNELS_PATH)
  };
  const CHANNEL_NAME_PREFIX = 'toc-';
  const INVITE_CHANNEL_NAME = CHANNEL_NAME_PREFIX + 'invite';

  let generateContactChannelId = function generateContactChannelId(contactId) {
    let userId = identity.IDENTITY_CURSORS.synchronized.get('userInfo').id;

    let channelId = userId > contactId ?
      userId + '-' + contactId :
      contactId + '-' + userId;

    return CHANNEL_NAME_PREFIX + channelId;
  };

  let generateGroupChannelId = function generateGroupChannelId(channelName) {
    let userId = identity.IDENTITY_CURSORS.synchronized.get('userInfo').id;

    let channelId = userId + channelName;

    return CHANNEL_NAME_PREFIX + channelId;
  };

  let createContactChannel = function createContactChannel(contactId) {
    let channelId = generateContactChannelId(contactId);

    let channel = {
      id: channelId,
      contactIds: [contactId]
    };

    return state.save(
        CHANNELS_CURSORS.synchronized,
        [channelId, 'channelInfo'],
        channel
      ).then(() => network.listen(channel));
  };

  let initialize = function initialzeChannels() {
    return network.listen({id: INVITE_CHANNEL_NAME});
  };

  return {
    createContactChannel,
    initialize
  };
}
