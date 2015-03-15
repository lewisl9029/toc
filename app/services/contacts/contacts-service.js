export default function contacts(storage) {
  let contactsService = {};

  contactsService.initialize = function initializeContacts() {
    contactsService.storage = storage.createModel(contactsModel);
    contactsService.model = contactsService.storage.getAllContacts();
  };

  return contactsService;
}
