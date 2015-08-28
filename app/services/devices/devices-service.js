export let serviceName = 'devices';
export default /*@ngInject*/ function devices(
  $interval,
  $ionicPopup,
  $log,
  $q,
  $timeout,
  $window,
  cryptography,
  R,
  state
) {
  let isCordovaApp = function isCordovaApp() {
    return $window.cordova;
  };

  let disconnectOtherDevices = function disconnectOtherDevices() {
    let localDeviceId = state.local.devices.get(['deviceInfo', 'id']);

    let cloudDevices = state.cloud.devices.get() || {};
    cloudDevices[localDeviceId] = {};

    let devicesDisconnecting = R.pipe(
      R.keys,
      R.map((deviceId) => {
        let disconnect = deviceId === localDeviceId ? 0 : 1;

        return state.save(
          state.cloud.devices,
          [deviceId, 'disconnect'],
          disconnect
        );
      })
    ) (cloudDevices);

    return $q.all(devicesDisconnecting);
  };

  let listenForDisconnects = function listenForDisconnects(destroySession) {
    let localDeviceId = state.local.devices.get(['deviceInfo', 'id']);
    let localDisconnectCursor = state.cloud.devices
      .select([localDeviceId, 'disconnect']);

    let handleDisconnects = function handleDisconnects(event) {
      if (event.data.data !== 1) {
        return;
      }

      let disconnectingDevice = $timeout(() => {
        destroySession();
      }, 5000);

      let remoteLoginPopup = $ionicPopup.show({
        title: 'Another device has connected',
        template: 'This device will disconnect in 5 seconds.',
        buttons: [
          {
            text: 'Stay connected',
            type: 'button-assertive',
            onTap: (event) => {
              $timeout.cancel(disconnectingDevice);
              disconnectOtherDevices();
            }
          }
        ]
      });
    };

    state.addListener(localDisconnectCursor, handleDisconnects, null, {
      skipInitialize: true
    });

    return $q.when();
  };

  let create = function create() {
    let localDeviceInfo = state.local.devices.get('deviceInfo');

    return localDeviceInfo ?
      $q.when(localDeviceInfo) :
      cryptography.getRandomBase64(8)
        .then((deviceId) => state.save(
          state.local.devices,
          ['deviceInfo'],
          { id: deviceId }
        ));
  };

  //Workaround for circular dependency between devices and session
  let initialize = function initializeDevices(destroySession) {
    return disconnectOtherDevices()
      .then(() => listenForDisconnects(destroySession));
  };

  return {
    initialize,
    create,
    isCordovaApp
  };
}
