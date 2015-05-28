export default function WelcomeController(state, R, storage) {
  let localUsersCursor = state.local.cursors.identity;

  // this.chooseAccount = function chooseAccount() {
  //   storage.claimAccess(R.keys(localUsersCursor.get()[0]));
  //   storage.connect('tocuser1@5apps.com');
  // };

  this.isConnected = storage.isConnected;

  this.users = localUsersCursor.get();

  localUsersCursor.on('update', () => {
    this.users = localUsersCursor.get();
  });
}
