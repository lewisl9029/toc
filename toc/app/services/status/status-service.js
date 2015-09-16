export let serviceName = 'status';
export default /*@ngInject*/ function status(
  $interval,
  $q,
  $log,
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
    //TODO: send current custom status rather than static ONLINE status
    $log.debug(`Status: Sending status update to ${contactId}`);
    return network.sendStatus(contactId, ONLINE)
      .catch((error) => {
        if (error === 'timeout') {
          return $q.when();
        }

        return $q.reject(error);
      });
  };

  let initializeUpdates = function initializeUpdates(contactId) {
    sendUpdate(contactId);
    activeStatusUpdates[contactId] =
      $interval(() => sendUpdate(contactId), STATUS_UPDATE_INTERVAL, 0, false);

    return $q.when();
  };

  let initialize = function initialize() {
    let contacts = state.cloud.contacts.get();

    R.pipe(
      R.values,
      R.reject(R.propEq('statusId', -1)),
      R.forEach((contact) => initializeUpdates(contact.userInfo.id))
    )(contacts);

    //FIXME: won't be appropriate when simultaneous login is implemented
    $window.onbeforeunload = () => {
      R.pipe(
        R.values,
        R.reject(R.propEq('statusId', -1)),
        R.forEach((contact) => network.sendStatus(contact.userInfo.id, OFFLINE))
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
