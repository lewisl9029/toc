let declareContactEndpointType =
  function declareContactEndpointType(privateClient) {
    privateClient.declareType('contactEndpoint', {
      'description': 'a telehash hashname',
      'type': 'contactEndpoint',
      'properties': {
        'id': {
          'type': 'string'
        },
        'friendlyName': {
          'type': 'string'
        },
        'lastUpdate': {
          'type': 'number'
        }
      }
    });
  };

export default declareContactEndpointType;
