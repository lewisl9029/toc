var expect = require('chai').expect;
var ext = require('../index.js');


describe('http', function(){

  it('exports an object', function(){
    expect(ext).to.be.a('object');
  });

  it('is an extension', function(){
    expect(ext.mesh).to.be.a('function');
    expect(ext.name).to.be.equal('http');
  });

});