export default function layout($state) {
  let isContactsMenuEnabled = function isContactsMenuEnabled() {
    return !$state.is('app.welcome');
  };

  return {
    isContactsMenuEnabled
  };
}
