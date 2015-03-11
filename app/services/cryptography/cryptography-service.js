export default function cryptography(sjcl) {
  //TODO: progressively replace with webcrypto implementation

  let credentials;

  // for encryption + authentication with a single key
  const AES_ENCRYPTION_MODE = 'gcm';

  // default key strength used by sjcl.encrypt
  const AES_KEY_STRENGTH = 128;

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

  let checkCredentials = function checkCredentials(credentials) {
    if (credentials) {
      return;
    }

    throw 'cryptography: mising credentials';
  };

  let getHmac = function getHmac(object) {
    let plaintext = JSON.stringify(object);

    let options = {
      salt: credentials.id
    };

    let derivedKey = sjcl.misc.cachedPbkdf2(
      credentials.password,
      options
    ).key;

    let hmac = (new sjcl.misc.hmac(derivedKey)).mac(plaintext);

    // iv cannot be longer than 4 bytes for sjcl?
    // see source for sjcl.encrypt
    return hmac.slice(0, AES_KEY_STRENGTH/32);
  };

  let encryptBase = function encryptBase(object, options) {
    let plaintext = JSON.stringify(object);

    let ciphertext = sjcl.encrypt(
      credentials.password,
      plaintext,
      options
    );

    return {
      ct: ciphertext
    };
  };

  let encryptDeterministic = function encryptDeterministic(object) {
    checkCredentials(credentials);

    let options = {
      salt: credentials.id,
      mode: AES_ENCRYPTION_MODE,
      iv: getHmac(object)
    };

    return encryptBase(object, options);
  };

  let encrypt = function encrypt(object) {
    checkCredentials(credentials);

    let options = {
      salt: credentials.id,
      mode: AES_ENCRYPTION_MODE
    };

    return encryptBase(object, options);
  };

  let decrypt = function decrypt(encryptedObject) {
    checkCredentials(credentials);

    let plaintext = sjcl.decrypt(
      credentials.password,
      encryptedObject.ct
    );

    return JSON.parse(plaintext);
  };

  let initialize = function initializeCryptography(userCredentials) {
    // only piece of mutable local state in the app
    // credentials shouldn't be stored in state trees
    //   because trees are versioned and sent with bug reports, etc
    credentials = {
      id: userCredentials.id,
      password: userCredentials.password
    };
  };

  return {
    ENCRYPTED_OBJECT,
    encryptDeterministic,
    encrypt,
    decrypt,
    initialize
  };
}
