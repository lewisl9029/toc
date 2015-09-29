export let serviceName = 'navigation';
export default /*@ngInject*/ function navigation(
  $ionicHistory,
  $ionicModal,
  $q,
  $rootScope,
  $state,
  $timeout,
  R,
  state
) {
  const routes = {
    public: {
      welcome: 'public.welcome',
      cloud: 'public.cloud',
      signin: 'public.signin',
      signout: 'public.signin'
    },
    private: {
      home: 'private.home',
      cloud: 'private.cloud',
      channel: 'private.channel'
    }
  };

  const DEFAULT_PUBLIC_STATE = routes.public.welcome;
  const DEFAULT_PRIVATE_STATE = routes.private.home;

  let go = function go(stateName, parameters) {
    return $state.go(stateName, parameters);
  };

  let navigate = function navigate(viewId) {
    if (isActiveView(viewId)) {
      return $q.when();
    }

    let toHome = viewId === 'home';

    if (!toHome) {
      let channelExists = R.pipe(
        R.keys,
        R.contains(viewId)
      )(state.cloud.channels.get() || {});

      if (!channelExists) {
        return $q.when();
      }
    }

    let destination = toHome ?
      routes.private.home : routes.private.channel;
    let destinationParams = toHome ?
      undefined : { channelId: viewId };

    $ionicHistory.nextViewOptions({
      disableBack: true,
      disableAnimate: false
    });

    return go(destination, destinationParams)
      .then(() => state.save(
        state.cloud.navigation,
        ['activeViewId'],
        viewId
      ));
  };

  let isActiveView = function isActiveView(viewId) {
    return state.cloud.navigation.get('activeViewId') === viewId;
  };

  let at = function at(stateName, parameters) {
    return $state.is(stateName, parameters);
  };

  let showModal = function showModal(modalName, template, controller, scope) {
    //clean up existing modal if it was hidden instead of removed
    if (controller[modalName]) {
      controller[modalName].remove();
    }

    controller[modalName] = $ionicModal.fromTemplate(template, { scope });
    return controller[modalName].show();
  };

  let setupRedirect = function setupRedirect() {
    // redirect to routes.welcome if identity has not been initialized
    $rootScope.$on('$stateChangeStart', function(event, toState) {
      let doRedirect;
      let redirectStateName;

      if (state.cloud.identity && state.cloud.identity.get()) {
        doRedirect = !isPrivateState(toState.name);
        redirectStateName = DEFAULT_PRIVATE_STATE;
      } else {
        doRedirect = isPrivateState(toState.name);
        redirectStateName = DEFAULT_PUBLIC_STATE;
      }

      if (!doRedirect) {
        return;
      }

      event.preventDefault();
      return go(redirectStateName);
    });

    return $q.when();
  };

  let clearCache = function clearCache() {
    return $ionicHistory.clearCache();
  };

  let isPrivateState = function isPrivateState(stateName) {
    if (stateName) {
      return stateName.startsWith('private');
    }

    return $state.includes('private');
  };

  let resetHistory = function resetHistory(options = {disableAnimate: false}) {
    $ionicHistory.nextViewOptions({
      historyRoot: true,
      disableBack: true,
      disableAnimate: options.disableAnimate
    });
    return $q.when();
  };

  let initializePublic = function initializePublic() {
    let prepareNavigate = !at(routes.public.welcome) ?
      resetHistory({disableAnimate: true}) :
      $q.when();

    return prepareNavigate
      .then(() => go(routes.public.welcome))
      //workaround for too early initialization
      .then(() => $timeout(() => clearCache(), 0, false));
  };

  let initialize =
    function initializeNavigation() {
      let activeViewId = state.cloud.navigation.get('activeViewId');

      if (activeViewId === undefined) {
        return resetHistory()
          .then(() => go(DEFAULT_PRIVATE_STATE))
          .then(() => state.save(
            state.cloud.navigation,
            ['activeViewId'],
            'home'
          ));
      }

      if (activeViewId.startsWith('toc-')) {
        return resetHistory()
          .then(() => go(
            routes.private.channel,
            {channelId: activeViewId}
          ));
      }

      return resetHistory()
        .then(() => go(DEFAULT_PRIVATE_STATE));
    };

  return {
    routes,
    go,
    at,
    navigate,
    isActiveView,
    isPrivateState,
    showModal,
    clearCache,
    setupRedirect,
    resetHistory,
    initializePublic,
    initialize
  };
}
