export default function HomeController(state, identity, network) {
  let currentUserCursor = identity.IDENTITY_CURSORS.synchronized;

  this.currentUser = currentUserCursor.get();

  currentUserCursor.on('update', () => {
    this.currentUser = currentUserCursor.get();
  });

  this.listen = () => network.listen({id: 'toc-test'});

  this.send = () => network.send({
    id: 'toc-test',
    contacts: [this.contactId]
  }, {js:{m: this.message}});
}
