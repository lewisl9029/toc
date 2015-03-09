export default function WelcomeController(identity) {
  this.users = identity.localUsers;
}
