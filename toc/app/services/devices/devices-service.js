export let serviceName = 'devices';
export default /*@ngInject*/ function devices(
  $interval,
  $ionicPopup,
  $log,
  $q,
  $rootScope,
  $window,
  cryptography,
  R,
  state
) {
  let session;
  let localDisconnectFlag;

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

  let isIosApp = function isIosApp() {
    if (!isCordovaApp()) {
      return false;
    }

    return $window.cordova.platformId === 'ios';
  };

  let isInForeground = function isInForeground() {
    // fallback for when page visibility api isnt supported
    if ($window.document.hidden === undefined) {
      if ($window.document.hasFocus === undefined) {
        return true;
      }
      return $window.document.hasFocus();
    }

    return !$window.document.hidden;
  };

  let disconnectOtherDevices = function disconnectOtherDevices() {
    let localDeviceId = state.local.devices.get(['deviceInfo', 'id']);

    let existingCloudDevices = state.cloud.devices.get() || {};

    let updateDisconnectFlag = (deviceId) => {
      return cryptography.getRandomBase64(2)
        .then((disconnectFlag) => {
          if (deviceId === localDeviceId) {
            localDisconnectFlag = disconnectFlag;
          }
          return state.save(
            state.cloud.devices,
            [deviceId, 'disconnect'],
            disconnectFlag
          );
        });
    };

    let otherDeviceIds = R.pipe(
      R.keys,
      R.reject(R.equals(localDeviceId))
    )(existingCloudDevices);

    let disconnectingOthers = R.map(updateDisconnectFlag)(otherDeviceIds);

    return updateDisconnectFlag(localDeviceId)
      .then(() => $q.all(disconnectingOthers));
  };

  let listenForDisconnects = function listenForDisconnects(destroySession) {
    let localDeviceId = state.local.devices.get(['deviceInfo', 'id']);
    let localDisconnectCursor = state.cloud.devices
      .select([localDeviceId, 'disconnect']);

    let handleDisconnects = function handleDisconnects(event) {
      if (event.data.currentData === localDisconnectFlag) {
        return;
      }

      let disconnectPopupScope = $rootScope.$new();
      disconnectPopupScope.disconnectPopup = {
        countdown: 15
      };

      let disconnectingDevice = $interval(() => {
        disconnectPopupScope.disconnectPopup.countdown =
          disconnectPopupScope.disconnectPopup.countdown - 1;
      }, 1000, 15, true);

      disconnectingDevice.then(() => destroySession());

      let remoteLoginPopup = $ionicPopup.show({
        title: 'Another device has connected',
        template: 'This device will disconnect in ' +
          '{{disconnectPopup.countdown}} seconds.',
        scope: disconnectPopupScope,
        buttons: [
          {
            text: 'Stay connected',
            type: 'button-positive button-block',
            onTap: (event) => {
              $interval.cancel(disconnectingDevice);
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
    isIosApp,
    isInForeground,
    isCordovaApp,
    isWebApp
  };
}
