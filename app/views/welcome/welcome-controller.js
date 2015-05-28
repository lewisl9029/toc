export default function WelcomeController(state, R, storage) {
  let localUsers = state.local.tree;

  // this.chooseAccount = function chooseAccount() {
  //   storage.claimAccess(R.keys(localUsers.get()[0]));
  //   storage.connect('tocuser1@5apps.com');
  // };

  this.isConnected = storage.isConnected;

  this.users = localUsers.get();

  localUsers.on('update', () => {
    this.users = localUsers.get();
  });
}
