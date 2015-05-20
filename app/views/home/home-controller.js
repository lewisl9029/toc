export default function HomeController(state, identity, network) {
  let currentUserCursor = state.synchronized.cursors.identity;

  let activeChannelId = state.synchronized.cursors.network.get(
    ['activeChannelId']
  );

  if (activeChannelId !== 'home') {
    state.save(
      state.synchronized.cursors.network,
      ['activeChannelId'],
      'home'
    );
  }

  this.currentUser = currentUserCursor.get();

  currentUserCursor.on('update', () => {
    this.currentUser = currentUserCursor.get();
  });
}
