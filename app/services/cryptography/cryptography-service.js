export default function cryptography(sjcl) {
  let credentials;

  const ENCRYPTED_OBJECT = {
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

  const KEY_STRENGTH = 128;

  let getHmac = function getHmac(message) {
    //implemented similarly as in sjcl convenience function .encrypt
    let key = sjcl.misc.cachedPbkdf2(
      credentials.password,
      {salt: credentials.id}
    ).key;

    let derivedKey = key.slice(0, KEY_STRENGTH/32);

    let hmac = (new sjcl.misc.hmac(derivedKey)).mac(message);

    return sjcl.codec.hex.fromBits(hmac);
  };

  let encrypt = function encrypt(object) {
    //TODO: progressively replace with webcrypto implementation
    let plaintext = JSON.stringify(object);

    let options = {
      salt: credentials.id,
      mode: 'gcm'
    };

    let ciphertext = sjcl.encrypt(
      credentials.password,
      plaintext,
      options
    );

    return {
      ct: ciphertext
    };
  };

  let decrypt = function decrypt(encryptedObject) {
    let plaintext = sjcl.decrypt(
      credentials.password,
      encryptedObject.ct
    );

    return JSON.parse(plaintext);
  };

  let initialize = function initializeCryptography(userCredentials) {
    credentials = {
      id: userCredentials.id,
      password: userCredentials.password
    };
  };

  return {
    ENCRYPTED_OBJECT,
    getHmac,
    encrypt,
    decrypt,
    initialize
  };
}
