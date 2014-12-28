var test = require('tape');
var fs = require('../../');
var util = require('../util');
var Buffer = global.Buffer || require('buffer').Buffer;

test('write stream simple', function(t) {
  t.plan(1);

  var ws = fs.createWriteStream('foo')
  ws.on('close', function() {
    t.equal(fs.readFileSync('foo').toString(), 'barbaz');
    util.reset();
  });
  
  ws.write('bar');
  ws.write('baz');
  ws.end();
});

test('write stream replace', function(t) {
  t.plan(1);

  var ws = fs.createWriteStream('foo');
  ws.on('close', function() {
    var ws2 = fs.createWriteStream('foo');
    ws2.on('close', function() {
      t.equal(fs.readFileSync('foo').toString(), 'baz');
      util.reset();
    });
    
    ws2.write('baz');
    ws2.end();
  });
  
  ws.write('bar');
  ws.end();
});

test('write stream append', function(t) {
  t.plan(1);

  var ws = fs.createWriteStream('foo');
  ws.on('close', function() {
    var ws2 = fs.createWriteStream('foo', { flag: 'a' });
    ws2.on('close', function() {
      t.equal(fs.readFileSync('foo').toString(), 'barbaz');
      util.reset();
    });
    
    ws2.write('baz');
    ws2.end();
  });
  
  ws.write('bar');
  ws.end();
});
