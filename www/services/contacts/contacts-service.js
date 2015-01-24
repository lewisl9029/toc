let contactsService = function contacts(storage) {
  let contactsService = {};

  contactsService.initialize = function initializeContacts() {
    contactsService.model = storage.contacts.getAllContacts();
  };

  return contactsService;
};

export default contactsService;