export default function WelcomeController(state, R, storage) {
  this.isStorageConnected = storage.isConnected;

  let savedUsersCursor = state.cloudUnencrypted.cursor;
  let updateSavedUsers = () => {
    this.users = R.keys(savedUsersCursor.get()).length;
  };

  state.addListener(savedUsersCursor, updateSavedUsers, $scope);
}
