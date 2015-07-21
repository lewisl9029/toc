export default function devices(state, session, cryptography, R, $q, $log,
  $interval, $timeout) {
  let activeDevicePing;

  let updatePing = function updatePing() {
    //TODO: don't let this grow unbounded.
    let localDeviceId = state.local.devices.get(['deviceInfo', 'id']);
    let previousPing = state.cloud.devices.get([localDeviceId, 'ping']);

    let newPing = previousPing === undefined ? 0 : previousPing + 1;

    return state.save(
      state.cloud.devices,
      [localDeviceId, 'ping'],
      newPing
    );
  };

  let disconnectOnRemotePing = function disconnectOnRemotePing() {
    let devicesCursor = state.cloud.devices;
    let handleDevicesChange = (event) => {
      let newData = event.data.data;
      let previousData = event.data.previousData;

      if (!previousData) {
        return;
      }

      let localDeviceId = state.local.devices.get('deviceInfo').id;
      let newDevices = R.omit([localDeviceId])(newData);

      if (R.keys(newDevices).length === 0) {
        return;
      }

      let previousDevices = R.omit([localDeviceId])(previousData);

      let remotePingReceived = R.any((newDeviceId) => {
        let newDeviceAdded = previousDevices[newDeviceId] === undefined;
        if (newDeviceAdded) {
          return true;
        }

        let newPingReceived = newDevices[newDeviceId].ping !=
          previousDevices[newDeviceId].ping;
        if (newPingReceived) {
          return true;
        }

        return false;
      })(R.keys(newDevices));

      if (remotePingReceived) {
        destroy()
          .then(() => session.signOut());
      }
    };

    state.addListener(devicesCursor, handleDevicesChange, null, {
      skipInitialize: true
    });
  };

  let createDeviceId = function createDeviceId() {
    return cryptography.getRandomBase64(16);
  };

  let initialize = function initializeDevices() {
    let localDeviceInfo = state.local.devices.get('deviceInfo');

    let deviceReady = localDeviceInfo ?
      $q.when() :
      createDeviceId()
        .then((deviceId) => state.save(
          state.local.devices,
          ['deviceInfo'],
          { id: deviceId }
        ))
        // needed a manual commit here because updatePing() depends on deviceId
        .then(() => state.commit());

    deviceReady.then(() => {
      activeDevicePing = $interval(updatePing, 20000);
      updatePing();
      //avoid listening for remote ping immediately to minimize race conditions
      // where new client would immediately disconnect
      $timeout(() => {
        disconnectOnRemotePing();
      }, 10000);
    });

    return deviceReady;
  };

  let destroy = function destroyDevices() {
    $interval.cancel(activeDevicePing);

    activeDevicePing = undefined;

    return $q.when();
  };

  return {
    initialize
  };
}
