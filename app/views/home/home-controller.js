export default function HomeController(state, identity, network) {
  let currentUserCursor = identity.IDENTITY_CURSORS.synchronized;

  state.save(
    network.NETWORK_CURSORS.synchronized,
    ['activeChannelId'],
    'home'
  );

  this.currentUser = currentUserCursor.get();

  currentUserCursor.on('update', () => {
    this.currentUser = currentUserCursor.get();
  });
}
