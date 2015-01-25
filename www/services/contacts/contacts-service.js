import contactsModel from 'services/contacts/contacts-model';

let contactsService = function contacts(storage) {
  let contactsService = {};

  contactsService.initialize = function initializeContacts() {
    contactsService.storage = storage.createModel(contactsModel);
    contactsService.model = contactsService.storage.getAllContacts();
  };

  return contactsService;
};

export default contactsService;
