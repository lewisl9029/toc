
// just for the example so we get a clean disk every time
process.env.FS_MOUNT_POINT = 'example';
for (var k in localStorage) {
  if (k.match(/example(-meta)?:\/\//)) {
    localStorage.removeItem(k);
  }
}

// the example
var example = function() {
  window.fs = require('../');
  window.process = require('process');

  fs.writeFileSync('hello.txt', 'the code above just ran');
  console.log(fs.readFileSync('hello.txt', 'utf8'));

  fs.mkdirSync('dir');

  var ws = fs.createWriteStream('dir/tryme.txt');
  ws.write('fs and process should be defined globally\n');
  ws.end("try fs.readdirSync('.') and process.chdir('dir')");

  var rs = fs.createReadStream('dir/tryme.txt');
  console.log(rs.read().toString());
};


// print example source to console
var src = example.toString();
src = src.split('\n');
src.pop();
src.shift();
src = '\n\n' + src.join('\n') + '\n\n';
console.log('%c' + src, 'color:#0064FF');

// go
example();