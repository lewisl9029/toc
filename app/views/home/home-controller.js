export default function HomeController(state, identity) {
  let currentUserCursor = identity.IDENTITY_CURSORS.synchronized;

  this.currentUser = currentUserCursor.get();

  currentUserCursor.on('update', () => {
    this.currentUser = currentUserCursor.get();
  });
}
