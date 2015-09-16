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
  let session;

  let isCordovaApp = function isCordovaApp() {
    return $window.cordova ? true : false;
  };

  let isWebApp = function isWebApp() {
    return $window.cordova ? false : true;
  };

  let isAndroidApp = function isAndroidApp() {
    if (!isCordovaApp()) {
      return false;
    }

    return $window.cordova.platformId === 'android';
  };

  let isInForeground = function isInForeground() {
    if (isCordovaApp()) {
      return !$window.cordova.plugins.backgroundMode.isActive();
    }

    // fallback for when page visibility api isnt supported
    if ($window.hidden === undefined) {
      if ($window.document.hasFocus === undefined) {
        return true;
      }
      return $window.document.hasFocus();
    }

    return !$window.hidden;
  };

  let disconnectOtherDevices = function disconnectOtherDevices() {
    let localDeviceId = state.local.devices.get(['deviceInfo', 'id']);

    let existingCloudDevices = state.cloud.devices.get() || {};

    let cloudDevices = R.assoc(localDeviceId, {})(existingCloudDevices);

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
      if (event.data.currentData !== 1) {
        return;
      }

      let disconnectingDevice = $timeout(() => {
        destroySession();
      }, 5000, false);

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

  let initialize = function initializeDevices(sessionService) {
    session = sessionService;

    return disconnectOtherDevices()
      .then(() => listenForDisconnects(session.destroy));
  };

  return {
    initialize,
    create,
    isAndroidApp,
    isInForeground,
    isCordovaApp,
    isWebApp
  };
}
