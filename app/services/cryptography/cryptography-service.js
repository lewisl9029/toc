export default function cryptography($q, sjcl, forge) {
  //TODO: progressively replace with webcrypto implementation
  //TODO: add user setting to disable encryption
  let cachedCredentials;

  // for encryption + authentication with a single key
  const AES_ENCRYPTION_MODE = 'AES-GCM';

  // default key strength used by sjcl.encrypt
  const AES_KEY_STRENGTH = 128;

  // From Forge docs:
  // Note: a key size of 16 bytes will use AES-128, 24 => AES-192, 32 => AES-256
  const PBKDF2_KEY_LENGTH = AES_KEY_STRENGTH / 8;

  // may not be enough?
  const PBKDF2_ITERATIONS = 10000;

  const ENCRYPTED_OBJECT = {
    name: 'tocEncryptedObject',
    //TODO: use JSON Schema URI for versioning
    schema: {
      type: 'object',
      properties: {
        ct: {
          type: 'string'
        },
        tag: {
          type: 'string'
        },
        iv: {
          type: 'string'
        }
      },
      required: ['ct', 'tag', 'iv']
    }
  };

  // replaces forwardslash in base64 string for use in paths for indexeddb
  let escapeCiphertext = function escapeCiphertext(ciphertext) {
    return ciphertext.replace(/\//g, '.');
  };

  let unescapeCiphertext = function unescapeCiphertext(ciphertext) {
    return ciphertext.replace(/\./g, '/');
  };

  let checkCredentials =
    function checkCredentials(credentials) {
      if (credentials && credentials.salt && credentials.key) {
        return;
      }
      //FIXME: Throw error object instead?
      throw 'cryptography: mising credentials';
    };

  let getHmac = function getHmac(object, credentials = cachedCredentials) {
    checkCredentials(credentials);

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

  let encryptBase =
    function encryptBase(object, options, credentials = cachedCredentials) {
      let plaintext = JSON.stringify(object);

      let ciphertext = sjcl.encrypt(
        credentials.password,
        plaintext,
        options
      );

      return {
        ct: escapeCiphertext(ciphertext)
      };
    };

  // using the synthetic initialization vector (SIV) variant of AES
  // will need an audit of the implementation
  let encryptDeterministic =
    function encryptDeterministic(object, credentials = cachedCredentials) {
      checkCredentials(credentials);

      let options = {
        salt: credentials.id,
        mode: AES_ENCRYPTION_MODE,
        iv: getHmac(object)
      };

      return encryptBase(object, options, credentials);
    };

  let encrypt = function encrypt(object, credentials = cachedCredentials) {
    checkCredentials(credentials);

    let plaintext = JSON.stringify(object);
    let iv = forge.random.getBytesSync(16);

    let cipher = forge.cipher.createCipher(
      AES_ENCRYPTION_MODE,
      credentials.key
    );

    cipher.start({iv});
    cipher.update(forge.util.createBuffer(plaintext));
    cipher.finish();

    iv = forge.util.encode64(iv);
    let ct = forge.util.encode64(cipher.output.getBytes());
    let tag = forge.util.encode64(cipher.mode.tag.getBytes());

    return { iv, ct, tag };
  };

  let decrypt =
    function decrypt(encryptedObject, credentials = cachedCredentials) {
      checkCredentials(credentials);

      let ciphertext = forge.util.decode64(encryptedObject.ct);
      let iv = forge.util.decode64(encryptedObject.iv);
      let tag = forge.util.decode64(encryptedObject.tag);

      let decipher = forge.cipher.createDecipher(
        AES_ENCRYPTION_MODE,
        credentials.key
      );

      decipher.start({
        iv: forge.util.createBuffer(iv),
        tag: forge.util.createBuffer(tag)
      });

      decipher.update(forge.util.createBuffer(ciphertext));

      let result = decipher.finish();

      if (!result) {
        throw 'cryptography: decryption failed';
      }

      return JSON.parse(decipher.output.getBytes());
    };

  let deriveCredentials = function deriveCredentials(userCredentials) {
    let salt = forge.util.hexToBytes(userCredentials.id);
    let key = forge.pkcs5.pbkdf2(
      userCredentials.password,
      salt,
      PBKDF2_ITERATIONS,
      PBKDF2_KEY_LENGTH
    );

    return { salt, key };
  };

  let initialize = function initializeCryptography(userCredentials) {
    cachedCredentials = deriveCredentials(userCredentials);
  };

  let destroy = function destroyCryptography() {
    cachedCredentials = undefined;
  };

  return {
    ENCRYPTED_OBJECT,
    getHmac,
    encryptDeterministic,
    encrypt,
    decrypt,
    deriveCredentials,
    initialize,
    destroy
  };
}
