let contactsSchema = {
  'description': 'a contact',
  'type': 'contact',
  'properties': {
    'id': {
      'type': 'string'
    },
    'displayName': {
      'type': 'string'
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
  'required': ['id', 'displayName']
};

export default contactsSchema;
