export default function cryptography(sjcl) {
  let cryptographyService = {};

  cryptographyService.initialize = function initializeCryptography() {
    cryptographyService.password = 'test';
  };

  cryptographyService.ENCRYPTED_OBJECT = {
    name: 'tocEncryptedObject',
    //TODO: use JSON Schema URI for versioning
    schema: {
      type: 'object',
      properties: {
        ct: {
          type: 'string'
        }
      },
      required: ['ct']
    }
  };

  cryptographyService.encrypt = function encrypt(object) {
    //TODO: progressively replace with webcrypto implementation
    let plainText = JSON.stringify(object);
    //TODO: save space by keeping only ct and iv in ciphertext
    //  every other setting is default
    let cipherText = sjcl.encrypt(cryptographyService.password, plainText);

    return {
      ct: cipherText
    };
  };

  cryptographyService.decrypt = function decrypt(encryptedObject) {
    let cipherText = encryptedObject.ct;

    let plainText = sjcl.decrypt(cryptographyService.password, cipherText);

    return JSON.parse(plainText);
  };

  return cryptographyService;
}
