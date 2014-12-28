var expect = require('chai').expect;
var hashname = require('../index.js');


describe('hashname', function(){

  it('should generate from two keys', function(){
    var keys = {
      "3a":"hp6yglmmqwcbw5hno37uauh6fn6dx5oj7s5vtapaifrur2jv6zha",
      "1a": "vgjz3yjb6cevxjomdleilmzasbj6lcc7"
    };
    expect(hashname.fromKeys(keys)).to.be.equal('jvdoio6kjvf3yqnxfvck43twaibbg4pmb7y3mqnvxafb26rqllwa');
  })

  it('should generate from one key', function(){
    var keys = {
      "1a": "vgjz3yjb6cevxjomdleilmzasbj6lcc7"
    };
    expect(hashname.fromKeys(keys)).to.be.equal('echmb6eke2f6z2mqdwifrt6i6hkkfua7hiisgrms6pwttd6jubiq');
  })

  it('should generate from a buffer', function(){
    var keys = {
      "3a": new Buffer('3bfd832d8c85841b74ed76ff4050fe2b7c3bf5c9fcbb5981e0416348e935f64e','hex')
    };
    expect(hashname.fromKeys(keys)).to.be.equal('nzf4f6j7ylv53z3m4egrwltv2t2yks4rtpaimeg3avwqsoshqxba');
  })

  it('fails w/ no keys', function(){
    expect(hashname.fromKeys({})).to.be.equal(false);
  })

  it('fails w/ bad id', function(){
    expect(hashname.fromKeys({"bad":"8jze4merv08q6med3u21y460fjdcphkyuc858538mh48zu8az39t1vxdg9tadzun"})).to.be.equal(false);
  })

  it('returns buffer', function(){
    expect(hashname.buffer('4w0fh69ad6d1xhncwwd1020tqnhqm4y5zbdmtqdk7d3v36qk6wbg')).to.be.a('object');
  })

  it('returns packet', function(){
    var keys = {
      "3a":"hp6yglmmqwcbw5hno37uauh6fn6dx5oj7s5vtapaifrur2jv6zha",
      "1a": "vgjz3yjb6cevxjomdleilmzasbj6lcc7"
    };
    var packet = hashname.toPacket(keys,"3a");
    expect(packet).to.be.a('object');
    expect(Buffer.isBuffer(packet.body)).to.be.true;
    expect(packet.json["1a"]).to.be.equal('ym7p66flpzyncnwkzxv2qk5dtosgnnstgfhw6xj2wvbvm7oz5oaq');
    var packet = hashname.toPacket(keys,"1a");
    expect(packet.json["3a"]).to.be.equal('bmxelsxgecormqjlnati6chxqua7wzipxliw5le35ifwxlge2zva');
  });

  it('returns key buffer', function(){
    var keys = {
      "3a":"hp6yglmmqwcbw5hno37uauh6fn6dx5oj7s5vtapaifrur2jv6zha",
      "1a": "vgjz3yjb6cevxjomdleilmzasbj6lcc7"
    };
    var buf = hashname.key("3a",keys);
    expect(buf).to.be.a('object');
    expect(buf.toString('hex')).to.be.equal('3bfd832d8c85841b74ed76ff4050fe2b7c3bf5c9fcbb5981e0416348e935f64e');
  });
  
  it('generates from packet', function(){
    var json = { '1a': 'ym7p66flpzyncnwkzxv2qk5dtosgnnstgfhw6xj2wvbvm7oz5oaq', '3a':true };
    var key = new Buffer('3bfd832d8c85841b74ed76ff4050fe2b7c3bf5c9fcbb5981e0416348e935f64e','hex');
    expect(hashname.fromPacket({json:json,body:key})).to.be.equal('jvdoio6kjvf3yqnxfvck43twaibbg4pmb7y3mqnvxafb26rqllwa');
  });

  it('generates from packet and hint', function(){
    var json = { '1a': 'ym7p66flpzyncnwkzxv2qk5dtosgnnstgfhw6xj2wvbvm7oz5oaq'};
    var key = new Buffer('3bfd832d8c85841b74ed76ff4050fe2b7c3bf5c9fcbb5981e0416348e935f64e','hex');
    expect(hashname.fromPacket({json:json,body:key},'3a')).to.be.equal('jvdoio6kjvf3yqnxfvck43twaibbg4pmb7y3mqnvxafb26rqllwa');
  });

  it('returns sorted ids', function(){
    expect(hashname.ids(['1a','2a']).toString()).to.be.equal(['2a','1a'].toString());
  });

  it('finds best id', function(){
    expect(hashname.match(['1a','2a','44'],['1a','2a','55'])).to.be.equal('2a');
  });

  it('exposes base32 utility', function(){
    expect(hashname.base32).to.be.an('object');
    expect(hashname.base32.encode(new Buffer('foo'))).to.be.equal('mzxw6');
    expect(hashname.base32.decode('mzxw6').toString()).to.be.equal('foo');
  });

  it('verifies hashname', function(){
    expect(hashname.isHashname('anptpctxorixfzzj6dwwncwz3vzeessbhuokkfsdlx2upxw4qocq')).to.be.true;
    expect(hashname.isHashname({})).to.be.false;
    expect(hashname.isHashname('anptpctxorixfzzj6dwwncwz3vzeessbhuokkfsdlx2upxw4qoc')).to.be.false;
  });


})