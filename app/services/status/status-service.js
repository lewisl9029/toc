export let serviceName = 'status';
export default /*@ngInject*/ function status(
  $interval,
  $q,
  $window,
  network,
  R,
  state
) {
  let activeStatusUpdates = {};

  const ONLINE = 1;
  const OFFLINE = 0;
  //TODO: add random delay to stagger updates
  const STATUS_UPDATE_INTERVAL = 15000;

  let sendUpdate = function sendUpdate(contactId) {
    //TODO: only send updates to initialized contacts (not existing new invites)
    //TODO: send current custom status rather than static ONLINE status
    return network.sendStatus(contactId, ONLINE)
      .catch((error) => {
        if (error === 'timeout') {
          return $q.when();
        }

        return $q.reject(error);
      });
  };

  let initializeUpdates = function initializeUpdates(contactId) {
    let sendStatusUpdate = () => sendUpdate(contactId);

    sendStatusUpdate();
    activeStatusUpdates[contactId] =
      $interval(sendStatusUpdate, STATUS_UPDATE_INTERVAL);

    return $q.when();
  };

  let initialize = function initialize() {
    let contacts = state.cloud.contacts.get();
    R.pipe(
      R.keys,
      R.forEach(initializeUpdates)
    )(contacts);

    //FIXME: won't be appropriate when simultaneous login is implemented
    $window.onbeforeunload = () => {
      R.pipe(
        R.keys,
        R.forEach((contactId) => network.sendStatus(contactId, OFFLINE))
      )(contacts);
    };

    return $q.when();
  };

  let destroy = function destroy() {
    let contacts = state.cloud.contacts.get();
    R.pipe(
      R.values,
      R.forEach((activeUpdate) => $interval.cancel(activeUpdate))
    )(activeStatusUpdates);

    activeStatusUpdates = {};

    return $q.when();
  };

  return {
    sendUpdate,
    initializeUpdates,
    initialize,
    destroy
  };
}
