var test = require('tape');
var fs = require('../../');
var util = require('../util');

test('readdir', function(t) {
  t.plan(8);
  
  fs.mkdirSync('/home');
  fs.mkdirSync('/home/substack');
  
  fs.writeFileSync('/home/substack/robots.txt', 'beep boop');
  fs.writeFileSync('/home/substack/a.txt', 'aaaa\nbbbb\ncccc');
  fs.writeFileSync('/xyz.txt', 'x\ny\nz\n');

  var files = fs.readdirSync('/home/substack');
  t.deepEqual(files.sort(), [ 'a.txt', 'robots.txt' ]);
  
  fs.readdir('/home/substack', function(err, files) {
    t.deepEqual(files.sort(), [ 'a.txt', 'robots.txt' ]);
  });
  
  files = fs.readdirSync('/home');
  t.deepEqual(files.sort(), [ 'substack' ]);
  
  fs.readdir('/home', function(err, files) {
    t.deepEqual(files.sort(), [ 'substack' ]);
  });
  
  files = fs.readdirSync('/');
  t.deepEqual(files.sort(), [ 'home', 'xyz.txt' ]);
  
  fs.readdir('/', function(err, files) {
    t.deepEqual(files.sort(), [ 'home', 'xyz.txt' ]);
  });
  
  try {
    fs.readdirSync('/whatever');
  } catch (err) {
    t.ok(err);
  }
  
  fs.readdir('/whatever', function(err) {
    t.ok(err);
    util.reset();
  });
});
