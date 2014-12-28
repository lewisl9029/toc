if(!expect){
  function expect(a){
    return {
      toBe: function(b){
        require('assert').strictEqual(a, b);
      }
    };
  }
}
var base32 = require('../index');

describe('rfc-3548', function() {
  it('should encode', function() {
    expect(base32.encode('a')).toBe('ME======');
    expect(base32.encode('be')).toBe('MJSQ====');
    expect(base32.encode('bee')).toBe('MJSWK===');
    expect(base32.encode('beer')).toBe('MJSWK4Q=');
    expect(base32.encode('beers')).toBe('MJSWK4TT');
    expect(base32.encode('beers 1')).toBe('MJSWK4TTEAYQ====');
    expect(base32.encode('shockingly dismissed')).toBe('ONUG6Y3LNFXGO3DZEBSGS43NNFZXGZLE');    
  });
  
  
  it('should decode', function() {
    expect(base32.decode('ME======').toString()).toBe('a');
    expect(base32.decode('MJSQ====').toString()).toBe('be');
    expect(base32.decode('ONXW4===').toString()).toBe('son');
    expect(base32.decode('MJSWK===').toString()).toBe('bee');
    expect(base32.decode('MJSWK4Q=').toString()).toBe('beer');
    expect(base32.decode('MJSWK4TT').toString()).toBe('beers');
    expect(base32.decode('mjswK4TT').toString()).toBe('beers');
    expect(base32.decode('MJSWK4TTN5XA====').toString()).toBe('beerson');
    expect(base32.decode('MJSWK4TTEAYQ====').toString()).toBe('beers 1');
    expect(base32.decode('ONUG6Y3LNFXGO3DZEBSGS43NNFZXGZLE').toString()).toBe('shockingly dismissed');
  });
  
  it('should be binary safe', function() {
    var bytes = [];
    for(var i=0;i<256;i++) {
      bytes.push(i);
    }
    var binaryBuf = new Buffer(bytes);
    expect(base32.decode(base32.encode(binaryBuf)).toString('hex')).toBe(binaryBuf.toString('hex'));
  });
});
