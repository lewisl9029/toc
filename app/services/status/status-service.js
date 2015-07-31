export default function status(state, network, channels, $q) {
  let activeStatusUpdates = {};

  let sendUpdates = function sendUpdates(contactId) {
    //TODO: only send updates to initialized contacts (not existing new invites)
    let sendStatusUpdate = () => sendStatus(contactId, 1)
      .catch((error) => {
        if (error === 'timeout') {
          return $q.when();
        }

        return notification.error(error, 'Status Update Error');
      });

    sendStatusUpdate();
    activeChannelUpdates[channelInfo.id] = $interval(sendStatusUpdate, 15000);
  };

  let initialize = function initialize() {


    //FIXME: won't be appropriate when simultaneous login is implemented
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
}
