export default function WelcomeController(state, R, storage) {
  let cloudUsers = state.cloudUnencrypted.tree;

  // this.chooseAccount = function chooseAccount() {
  //   storage.claimAccess(R.keys(cloudUsers.get()[0]));
  //   storage.connect('tocuser1@5apps.com');
  // };

  this.isConnected = storage.isConnected;

  this.users = R.keys(cloudUsers.get()).length;

  cloudUsers.on('update', () => {
    this.users = R.keys(cloudUsers.get()).length;
  });
}
