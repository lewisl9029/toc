export default function devices(state, cryptography, $q, $interval) {
  let activeDevicePing;

  let updatePing = function updatePing() {
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
        ));

    deviceReady.then(() => {
      updatePing();

      activeDevicePing = $interval(updatePing, 20000);
      //TODO: watch for pings from other devices and disconnect
      // add an initial delay to minimize possibility of race conditions
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
