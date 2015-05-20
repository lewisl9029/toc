export default function WelcomeController(state) {
  let localUsersCursor = state.persistent.cursors.identity;

  this.users = localUsersCursor.get();

  localUsersCursor.on('update', () => {
    this.users = localUsersCursor.get();
  });
}
