let service = function contacts($log, R, storage) {
  storage.defineModule('contacts', function(privateClient) {
    privateClient.declareType('contact', {
      'description': 'a contact',
      'type': 'object',
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
      'required': ['id', 'firstname', 'lastname']
    });

    return {
      //TODO: encryption
      exports: {
        addContact: function addContact(contact) {
          return privateClient.storeObject('contact', contact.id, contact);
        }
      }
    };
  });

  storage.store.contacts.addContact({
    id: '1235',
    firstname: 'lewis',
    lastname: 'hoon'
  }).catch($log.error);

  let ids = [1, 2, 3];
  return R.map(id => {
    return {
      id: id,
      name: 'contact ' + id
    };
  })(ids);
};

export default service;
