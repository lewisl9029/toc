export default function devices(state, cryptography, $q, $interval) {
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
      updatePing();

      activeDevicePing = $interval(updatePing, 20000);

      let devicesCursor = state.cloud.devices;
      let handleDevicesChange = (event) => {
        if (!event.previousData) {
          return;
        }

        let localDeviceId = state.local.devices.get('deviceInfo');
        let newDevices = R.omit(localDeviceId)(event.data);

        if (R.keys(newDevices).length === 0) {
          return;
        }

        let previousDevices = R.omit(localDeviceId)(event.previousData);

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
          //TODO: actually trigger signout here
          $log.info('signing out');
        }
      };

      state.addListener(devicesCursor, handleDevicesChange, null, {
        skipInitialize: true
      });
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
