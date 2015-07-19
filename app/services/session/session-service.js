export default function session(state, $window) {
  //TODO: to be refactored from signin-form/signup-form/app-run
  let signIn = function signIn() {};
  let signOut = function signOut() {
    return state.remove(
        state.local.identity,
        ['savedCredentials']
      )
      .then(() => $q.when($window.location.reload()))
      .catch((error) => notification.error(error, 'Signout Error'));
  };

  return {
    signIn,
    signOut
  };
};
