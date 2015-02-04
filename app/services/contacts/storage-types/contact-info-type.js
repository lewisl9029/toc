let declareContactInfoType = function declareContactInfoType(privateClient) {
  privateClient.declareType('contactInfo', {
    'description': 'basic contact information',
    'type': 'contactInfo',
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
  });
};

export default declareContactInfoType;
