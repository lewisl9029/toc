/* */ 
(function(Buffer) {
  var assert = require("assert");
  var asn1 = require("../lib/asn1");
  var BN = require("bn.js");
  var Buffer = require("buffer").Buffer;
  describe('asn1.js DER encoder', function() {
    it('should code explicit tag as 0xA2', function() {
      var E = asn1.define('E', function() {
        this.explicit(2).octstr();
      });
      var encoded = E.encode('X', 'der');
      assert.equal(encoded.toString('hex'), 'a203040158');
      assert.equal(encoded.length, 5);
    });
    function test(name, model_definition, model_value, der_expected) {
      it(name, function() {
        var Model,
            der_actual;
        Model = asn1.define('Model', model_definition);
        der_actual = Model.encode(model_value, 'der');
        assert.deepEqual(der_actual, new Buffer(der_expected, 'hex'));
      });
    }
    test('should encode choice', function() {
      this.choice({apple: this.bool()});
    }, {
      type: 'apple',
      value: true
    }, '0101ff');
    test('should encode implicit seqof', function() {
      var Int = asn1.define('Int', function() {
        this.int();
      });
      this.implicit(0).seqof(Int);
    }, [1], 'A003020101');
    test('should encode explicit seqof', function() {
      var Int = asn1.define('Int', function() {
        this.int();
      });
      this.explicit(0).seqof(Int);
    }, [1], 'A0053003020101');
    test('should encode BN(128) properly', function() {
      this.int();
    }, new BN(128), '02020080');
    test('should encode int 128 properly', function() {
      this.int();
    }, 128, '02020080');
    test('should encode 0x8011 properly', function() {
      this.int();
    }, 0x8011, '0203008011');
    test('should omit default value in DER', function() {
      this.seq().obj(this.key('required').def(false).bool(), this.key('value').int());
    }, {
      required: false,
      value: 1
    }, '3003020101');
  });
})(require("buffer").Buffer);
