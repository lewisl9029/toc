export default function devices(state, cryptography, $q, $interval) {
  let updateDeviceClock = function updateDeviceClock() {
    let localDeviceId = state.local.devices.get(['deviceInfo', 'id']);
    let localDeviceClock = state.cloud.device.get([localDeviceId, 'clock']);

    state.save(
      state.cloud.devices,
      [localDeviceId, 'clock'],
      localDeviceClock + 1,
    );
  };

  let createDeviceId = function createDeviceId() {
    return cryptography.getRandomBase64(16);
  };

  let initialize = function initializeDevices() {
    let localDeviceInfo = state.local.devices.get('deviceInfo');

    let deviceReady = $q.when();

    if (!localDeviceInfo) {
      deviceReady = createDeviceId()
        .then((deviceId) => state.save(
          state.local.devices,
          ['deviceInfo'],
          { id: deviceId }
        ));
    }

    deviceReady.then(() => {
      $interval(updateDeviceClock, 20000);
    })
  };

  return {
    initialize
  };
}
