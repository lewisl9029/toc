export default function cryptography(sjcl) {
  let cryptographyService = {};

  cryptographyService.initialize = function initializeCryptography() {
  };

  cryptographyService.ENCRYPTED_OBJECT = {
    name: 'tocEncryptedObject',
    //TODO: use JSON Schema URI for versioning
    schema: {
      type: 'object',
      properties: {
        iv: {
          type: 'string'
        },
        ct: {
          type: 'string'
        }
      },
      required: ['iv', 'ct']
    }
  };

  cryptographyService.password = 'test';

  cryptographyService.encrypt = function encrypt(object) {
    //TODO: progressively replace with window.crypto.getRandomValues
    let initializationVector = sjcl.prng();
    let cypherText = sjcl.encrypt(object);

    return {
      iv: initializationVector,
      ct: cypherText
    };
  };

  cryptographyService.decrypt = function decrypt(encryptedObject) {
    let initializationVector = encryptedObject.iv;
    let cypherText = encryptedObject.ct;

    let plainText = sjcl.decrypt(cypherText, initializationVector);

    return plainText;
  };

  return cryptographyService;
}
