export default function HomeController(state, identity, network) {
  let currentUserCursor = state.synchronized.cursors.identity;

  state.save(
    state.synchronized.cursors.network,
    ['activeChannelId'],
    'home'
  );

  this.currentUser = currentUserCursor.get();

  currentUserCursor.on('update', () => {
    this.currentUser = currentUserCursor.get();
  });
}
