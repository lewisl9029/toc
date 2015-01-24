import STORAGE_CONSTANTS from 'services/storage/storage-constants';

let identityModel = {
  name: 'identity',
  accessLevel: STORAGE_CONSTANTS.ACCESS_LEVELS.FULL,
  builder: function buildIdentityModel(privateClient) {
    let defineIdentityFunctions =
      function defineIdentityFunctions(privateClient) {
        let identityFunctions = {};

        identityFunctions.putIdentityContactId =
          function putIdentityContactId(contactId) {
            return privateClient
              .storeObject('string', 'contactId', contactId);
          };

        identityFunctions.getIdentityContactId =
          function getIdentityContactId() {
            return privateClient.getObject('contactId');
          };

        identityFunctions.putIdentityStorageId =
          function putIdentityStorageId(storageId) {
            return privateClient
              .storeObject('string', 'storageId', storageId);
          };

        identityFunctions.getIdentityStorageId =
          function getIdentityStorageId() {
            return privateClient.getObject('storageId');
          };

        return identityFunctions;
      };

    return {
      exports: defineIdentityFunctions(privateClient)
    };
  }
};

export default identityModel;