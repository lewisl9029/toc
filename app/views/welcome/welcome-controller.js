export default function WelcomeController(state) {
  let welcomeView = this;

  let localUsersCursor = state.persistent.cursors.identity;

  welcomeView.users = localUsersCursor.get();

  localUsersCursor.on('update', () => {
    welcomeView.users = localUsersCursor.get();
  });
}
