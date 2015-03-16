export default function contacts(state) {
  let contactsService = {};

  contactsService.initialize = function initializeContacts() {
    contactsService.storage = storage.createModel(contactsModel);
    contactsService.model = contactsService.storage.getAllContacts();
  };

  return contactsService;
}
