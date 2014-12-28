var process = global.process || require('process');
process.env.FS_MOUNT_POINT = 'testfs';

var fs = require('../');
process.umask(0);

var util = require('./util');
util.reset();

require('./tests/write-file');
require('./tests/read-file');
require('./tests/append');
require('./tests/truncate');
require('./tests/mkdir');
require('./tests/stat');
require('./tests/chmod');
require('./tests/exists');
require('./tests/readdir');
require('./tests/unlink');
require('./tests/rmdir');
require('./tests/read-stream');
require('./tests/write-stream');
