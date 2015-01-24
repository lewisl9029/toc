let MODEL_TYPE = 'contact';

let contactsModel = {
  name: 'contacts',
  type: MODEL_TYPE,
  schema: {
    'description': 'a contact',
    'type': MODEL_TYPE,
    'properties': {
      'id': {
        'type': 'string'
          // 'format': 'hashname'
      },
      'lastname': {
        'type': 'string'
      },
      'firstname': {
        'type': 'string'
      },
      'email': {
        'type': 'string'
      }
    },
    'required': ['id', 'firstname']
  },
  defineFunctions: function defineContactsFunctions(privateClient) {
    let contactsFunctions = {};

    contactsFunctions.addContact = function addContact(contact) {
      return privateClient.storeObject(MODEL_TYPE, contact.id, contact);
    };

    contactsFunctions.getContact = function getContact(contactId) {
      return privateClient.getObject(contactId);
    };

    contactsFunctions.getAllContacts = function getAllContacts() {
      return privateClient.getAll('');
    };

    return contactsFunctions;
  }
};

export default contactsModel;
