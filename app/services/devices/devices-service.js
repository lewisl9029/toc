export default function devices(state, session, cryptography, R, $q, $log,
  $interval, $timeout, $ionicPopup) {
  let updateKillFlags = function updateKillFlags() {
    let localDeviceId = state.local.devices.get(['deviceInfo', 'id']);

    let cloudDevices = state.cloud.devices.get();

    let killFlagsUpdated = R.map((deviceId) => {
      let killFlag = deviceId === localDeviceId ? 0 : 1;

      return state.save(
        state.cloud.devices,
        [deviceId, 'kill'],
        killFlag
      );
    })(R.keys(cloudDevices));

    return $q.all(killFlagsUpdated);
  };

  let listenForKillFlags = function listenForKillFlags() {
    let localDeviceId = state.local.devices.get(['deviceInfo', 'id']);
    let localKillFlagCursor = state.cloud.devices
      .select([localDeviceId, 'kill']);

    let handleKillFlagUpdate = function handleKillFlagUpdate(event) {
      if (event.data.data !== 1) {
        return;
      }

      let killingDevice = $timeout(() => {
        session.signOut();
      }, 5000);

      let remoteLoginPopup = $ionicPopup.show({
        title: 'Another device has connected',
        template: 'This device will disconnect in 5 seconds.',
        buttons: [
          {
            text: 'Stay connected',
            type: 'button-assertive',
            onTap: (event) => {
              $timeout.cancel(killingDevice);
              updateKillFlags();
            }
          }
        ]
      });
    };

    state.addListener(localKillFlagCursor, handleKillFlagUpdate, null, {
      skipInitialize: true
    });

    return $q.when();
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

    return deviceReady
      .then(updateKillFlags)
      .then(() => listenForKillFlags())
      .catch((error) => notifications.error(error, 'Devices Init Error'));
  };

  return {
    initialize
  };
}
