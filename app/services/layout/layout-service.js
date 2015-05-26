export default function layout($state, R) {
  let isContactsMenuEnabled = function isContactsMenuEnabled() {
    let menuDisabledStates = [
      'app.welcome',
      'app.signin',
      'app.signup',
      'app.cloud'
    ];

    return !R.any($state.includes)(menuDisabledStates);
  };

  return {
    isContactsMenuEnabled
  };
}
