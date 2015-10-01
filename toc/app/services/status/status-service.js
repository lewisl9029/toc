export let serviceName = 'status';
export default /*@ngInject*/ function status(
  $interval,
  $q,
  $log,
  $window,
  devices,
  network,
  R,
  state
) {
  let activeStatusUpdates = {};

  const ONLINE = 1;
  const OFFLINE = 0;
  //TODO: add random delay to stagger updates
  const ACTIVE_UPDATE_INTERVAL = 15000; // 15s
  const BACKGROUND_UPDATE_INTERVAL = 900000; // 15m

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

  let scheduleUpdates = function scheduleUpdates(contactId, interval) {
    if (activeStatusUpdates[contactId]) {
      $interval.cancel(activeStatusUpdates[contactId]);
    }

    activeStatusUpdates[contactId] =
      $interval(() => sendUpdate(contactId), interval, 0, false);
  };

  let initializeUpdates = function initializeUpdates(contactId) {
    let beginUpdates = () => {
      //TODO: need a different approach for iOS when using background fetch
      // https://github.com/christocracy/cordova-plugin-background-fetch
      if (!devices.isInForeground()) {
        scheduleUpdates(contactId, BACKGROUND_UPDATE_INTERVAL);
        return;
      }

      sendUpdate(contactId);
      scheduleUpdates(contactId, ACTIVE_UPDATE_INTERVAL);
    };

    beginUpdates();

    $window.document.addEventListener('visibilitychange', beginUpdates);

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
