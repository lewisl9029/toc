# rfc-3548-b32

Implementation of [RFC-3548] Base32 encoding/decoding for node that uses [Buffers] for input/output so it's binary safe.

## Installation
    
    npm install rfc-3548-b32 --save

## Usage

    var base32 = require('rfc-3548-b32');

    // Arbitrary binary data:
    var bytes = new Buffer([1, 2, 3, 4, 5]);

    // bytes (hex): 0102030405
    console.log("bytes (hex): %s", bytes.toString('hex'));

    // Encode it as base32 string:
    var bytesAsBase32 = base32.encode(bytes);

    // bytes (b32): AEBAGBAF
    console.log("bytes (b32): %s", bytesAsBase32);

    // Decode it back to a buffer:
    var decodedBytes = base32.decode(bytesAsBase32);

    // bytes (hex): 0102030405
    console.log("bytes (hex): %s", decodedBytes.toString('hex'));

## Functions

### encode(Buffer)
Encodes the supplied Buffer in base32. Returns a String.

### decode(String)
Decodes the supplied base32 String. Returns a Buffer.

## Testing
Tests are in the ./test directory (mocha default). You can run the tests via make:

    $ make test

## Thanks
Thanks to [https://github.com/chrisumbel/thirty-two](https://github.com/chrisumbel/thirty-two) and [https://github.com/OhJeez/thirty-two](https://github.com/OhJeez/thirty-two) for the real work in writing the base32 code. This module is just a repackaged version of the latter with the encode return type changed to return a String.

[RFC-3548]: http://tools.ietf.org/html/rfc3548
[Buffers]: http://nodejs.org/api/buffer.html
