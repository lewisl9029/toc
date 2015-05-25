export default function WelcomeController(state, R, storage) {
  this.connect = function connect() {
    storage.claimAccess('users');
    storage.connect('tocuser1@5apps.com');
  };

  let localUsersCursor = state.persistent.cursors.identity;

  this.chooseAccount = function chooseAccount() {
    storage.claimAccess(R.keys(localUsersCursor.get()[0]));
    storage.connect('tocuser1@5apps.com');
  };

  this.users = localUsersCursor.get();

  localUsersCursor.on('update', () => {
    this.users = localUsersCursor.get();
  });
}
