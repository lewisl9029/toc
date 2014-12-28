var process = global.process || require('process');
var Buffer = global.Buffer || require('buffer').Buffer;
var pathutil = require('path');
var constants = require('constants');
var Stats = require('fs-stats');
var inherits = require('inherits');
var mountpoint = process.env.FS_MOUNT_POINT || 'file';

var fs = module.exports = {
  Stats: Stats,
  FSWatcher: notImplemented('FSWatcher')
};

var mounted = false;
var permissionsMask = constants.S_IRWXU
                    | constants.S_IRWXG
                    | constants.S_IRWXO;

fs.renameSync = function(oldPath, newPath) {
  oldPath = normalizePath(oldPath);
  newPath = normalizePath(newPath);
  
  var oldStats = fs.statSync(oldPath);
  if (fs.existsSync(newPath)) {
    var newStats = fs.statSync(newPath);
    if (oldStats.isDirectory()) {
      if (!newStats.isDirectory()) {
        error('ENOTDIR', "not a directory '" + newPath + "'");
      }
    }
    else {
      if (newStats.isDirectory()) {
        error('EISDIR', "illegal operation on a directory '" + newPath + "'");
      }
    }
  }
  
  var oldData = localStorage.getItem(mountpoint + '://' + oldPath);
  localStorage.setItem(mountpoint + '://' + oldPath, oldData);
  localStorage.removeItem(mountpoint + '://' + oldPath);
  
  var oldMeta = localStorage.getItem(mountpoint + '-meta://' + oldPath);
  localStorage.setItem(mountpoint + '-meta://' + oldPath, oldMeta);
  localStorage.removeItem(mountpoint + '-meta://' + oldPath);
};
fs.rename = trySync(fs.renameSync);

fs.truncateSync = function(path, len) {
  path = normalizePath(path);
  var stats = fs.statSync(path);
  if (stats.isDirectory()) {
    error('EISDIR', "illegal operation on a directory '" + path + "'");
  }
  
  len = len || 0;
  
  var buf = Buffer(localStorage.getItem(mountpoint + '://' + path), 'base64');
  fs.writeFileSync(path, buf.slice(0, len));
};
fs.truncate = trySync(fs.truncateSync);

fs.chmodSync = function(path, mode) {
  path = normalizePath(path);
  
  var stats = fs.statSync(path);
  var unmasked = stats.mode & ~permissionsMask;
  stats.mode = unmasked | modeNum(mode);
  
  localStorage.setItem(mountpoint + '-meta://' + path, JSON.stringify(stats));
};
fs.chmod = trySync(fs.chmodSync);

fs.statSync = function(path) {
  path = normalizePath(path);
  var data = localStorage.getItem(mountpoint + '-meta://' + path);
  if (data === null) {
    error('ENOENT', "no such file or directory '" + path + "'");
  }
  data = JSON.parse(data);
  
  var stats = new Stats();
  for (var key in data) {
    stats[key] = data[key];
  }
  return stats;
};
fs.stat = trySync(fs.statSync);

fs.unlinkSync = function(path) {
  path = normalizePath(path);
  var stats = fs.statSync(path);
  if (stats.isDirectory()) {
    error('EPERM', "operation not permitted '" + path + "'");
  }
  
  localStorage.removeItem(mountpoint + '://' + path);
  localStorage.removeItem(mountpoint + '-meta://' + path);
  
  removeDirectoryListing(path);
};
fs.unlink = trySync(fs.unlinkSync);

fs.rmdirSync = function(path) {
  path = normalizePath(path);
  var ls = fs.readdirSync(path);
  if (ls.length > 0) {
    error('ENOTEMPTY', "directory not empty '" + path + "'");
  }
  
  localStorage.removeItem(mountpoint + '://' + path);
  localStorage.removeItem(mountpoint + '-meta://' + path);
  
  removeDirectoryListing(path);
};
fs.rmdir = trySync(fs.rmdirSync);

fs.mkdirSync = function(path, mode) {
  path = normalizePath(path);
  if (localStorage.getItem(mountpoint + '://' + path) !== null) {
    error('EEXIST', "file already exists '" + path + "'");
  }
  
  var stats = fs.statSync(pathutil.dirname(path));
  if (!stats.isDirectory()) {
    error('ENOTDIR', "not a directory '" + path + "'");
  }
  
  mode = mode === undefined ? 0777 : modeNum(mode);
  mode = mode & ~process.umask();
  stats = { mode: mode | constants.S_IFDIR };
  localStorage.setItem(mountpoint + '-meta://' + path, JSON.stringify(stats));
  
  localStorage.setItem(mountpoint + '://' + path, '');
  
  addDirectoryListing(path);
};
fs.mkdir = trySync(fs.mkdirSync);

fs.readdirSync = function(path) {
  path = normalizePath(path);
  var stats = fs.statSync(path);
  if (!stats.isDirectory()) {
    error('ENOTDIR', "not a directory '" + path + "'");
  }
  
  var ls = localStorage.getItem(mountpoint + '://' + path);
  if (ls) return ls.split('\n');
  return [];
};
fs.readdir = trySync(fs.readdirSync);

fs.readFileSync = function(path, options) {
  path = normalizePath(path);
  try {
    var stats = fs.statSync(path);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  if (stats && stats.isDirectory()) {
    error('EISDIR', "illegal operation on a directory '" + path + "'");
  }
  
  options = options || {};
  if (typeof options === 'string') {
    options = { encoding: options };
  }
  if (typeof options !== 'object') {
    throw new TypeError('Bad arguments');
  }
  var opts = {};
  for (var k in options) opts[k] = options[k];
  opts.flag = opts.flag || 'r';
  opts.mode = opts.mode === undefined ? 0666
                                      : opts.mode;
  
  openFile(path, stats, opts);
  
  var buf = Buffer(localStorage.getItem(mountpoint + '://' + path), 'base64');
  if (opts.encoding) return buf.toString(opts.encoding);
  return buf;
};
fs.readFile = trySync(fs.readFileSync);

fs.writeFileSync = function(path, data, options) {
  path = normalizePath(path);
  try {
    var stats = fs.statSync(path);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err;
    }
  }
  if (stats && stats.isDirectory()) {
    error('EISDIR', "illegal operation on a directory '" + path + "'");
  }
  
  options = options || {};
  if (typeof options === 'string') {
    options = { encoding: options };
  }
  else if (typeof options !== 'object') {
    throw new TypeError('Bad arguments');
  }
  var opts = {};
  for (var k in options) opts[k] = options[k];
  opts.flag = opts.flag || 'w';
  opts.mode = opts.mode === undefined ? 0666
                                      : opts.mode;
  
  openFile(path, stats, opts, true);
  
  if (!Buffer.isBuffer(data)) data = Buffer(data, opts.encoding);
  if (stats && opts.flag.match(/^a/)) {
    var prepend = Buffer(localStorage.getItem(mountpoint + '://' + path), 'base64');
    data = Buffer.concat([ prepend, data ]);
  }
  localStorage.setItem(mountpoint + '://' + path, data.toString('base64'));
  
  addDirectoryListing(path);
};
fs.writeFile = trySync(fs.writeFileSync);

fs.appendFileSync = function(path, data, options) {
  options = options || {};
  options.flag = options.flag || 'a';
  fs.writeFileSync(path, data, options);
};
fs.appendFile = trySync(fs.appendFileSync);

fs.existsSync = function(path) {
  path = normalizePath(path);
  return localStorage.getItem(mountpoint + '://' + path) !== null;
};
fs.exists = trySync(fs.existsSync, false);


// not yet implemented

fs.ftruncateSync = notImplemented('ftruncate');
fs.ftruncate = trySync(fs.ftruncateSync);

fs.chownSync = notImplemented('chown');
fs.chown = trySync(fs.chownSync);

fs.fchownSync = notImplemented('fchown');
fs.fchown = trySync(fs.fchownSync);

fs.lchownSync = notImplemented('lchown');
fs.lchown = trySync(fs.lchownSync);

fs.lchmodSync = notImplemented('lchmod');
fs.lchmod = trySync(fs.lchmodSync);

fs.fchmodSync = notImplemented('fchmod');
fs.fchmod = trySync(fs.fchmodSync);

fs.lstatSync = notImplemented('lstat');
fs.lstat = trySync(fs.lstatSync);

fs.fstatSync = notImplemented('fstat');
fs.fstat = trySync(fs.fstatSync);

fs.linkSync = notImplemented('readlink');
fs.link = trySync(fs.linkSync);

fs.symlinkSync = notImplemented('readlink');
fs.symlink = trySync(fs.symlinkSync);

fs.readlinkSync = notImplemented('readlink');
fs.readlink = trySync(fs.readlinkSync);

fs.realpathSync = notImplemented('realpath');
fs.realpath = trySync(fs.realpathSync);

fs.closeSync = notImplemented('close');
fs.close = trySync(fs.closeSync);

fs.openSync = notImplemented('open');
fs.open = trySync(fs.openSync);

fs.utimesSync = notImplemented('utimes');
fs.utimes = trySync(fs.utimesSync);

fs.futimesSync = notImplemented('futimes');
fs.futimes = trySync(fs.futimesSync);

fs.fsyncSync = notImplemented('fsync');
fs.fsync = trySync(fs.fsyncSync);

fs.writeSync = notImplemented('write');
fs.write = trySync(fs.writeSync);

fs.readSync = notImplemented('read');
fs.read = trySync(fs.readSync);

fs.watchFile = notImplemented('watchFile');
fs.unwatchFile = notImplemented('unwatchFile');
fs.watch = notImplemented('watch');


// streams

fs.createReadStream = function(path, options) {
  if (!fs.ReadStream) initStreams();
  return new fs.ReadStream(path, options);
};

fs.createWriteStream = function(path, options) {
  if (!fs.ReadStream) initStreams();
  return new fs.WriteStream(path, options)
}

function initStreams() {
  var stream = global.require ? global.require('stream') 
                              : require('stream');
  
  fs.ReadStream = ReadStream;
  
  function ReadStream(path, options) {
    var self = this;
    this._path = normalizePath(path);
    this._options = options || {};
    
    process.nextTick(function() {
      self.emit('open');
    });
    
    this.on('end', function() {
      self.emit('close');
    });
    
    stream.Readable.call(this, options);
  }
  inherits(ReadStream, stream.Readable);

  ReadStream.prototype._read = function(n) {
    try {
      this._buf = this._buf || fs.readFileSync(this._path, this._options);
    } catch (err) {
      return this.emit('error', err);
    }
    n = n || Infinity;
    var chunk = this._buf.slice(0, n);
    this.push(chunk.length > 0 ? chunk : null);
    this._buf = this._buf.slice(n);
  };

  fs.WriteStream = WriteStream;

  function WriteStream(path, options) {
    var self = this;
    this._path = normalizePath(path);
    this._options = options || {};
    this._firstWrite = true;
    this._buf;
    
    this.on('finish', function() {
      self.emit('close');
    });
    
    stream.Writable.call(this, options);
  }
  inherits(WriteStream, stream.Writable);

  WriteStream.prototype._write = function(chunk, enc, cb) {
    try {
      this.emit('open');
      var action = 'appendFileSync';
      if (this._firstWrite) {
        this._firstWrite = false;
        if (!this._options.flag ||
            !this._options.flag.match(/^a/)) {
          action = 'writeFileSync';
        }
      }
      fs[action](this._path, chunk, this._options);
    } catch (err) {
      this.emit('error', err);
    }
    cb();
  };
}


// helpers

function normalizePath(path) {
  if (typeof path !== 'string') throw new TypeError('path must be a string');
  if (!path) error('ENOENT', "no such file or directory ''");
  if (!mounted) mount();
  if (path.match(/^\//)) {
    return pathutil.normalize(path);
  }
  else {
    return pathutil.normalize(process.cwd() + '/' + path);
  }
}

function mount() {
  if (localStorage.getItem(mountpoint + ':///') === null) {
    var mode = 0777 & ~process.umask();
    localStorage.setItem(mountpoint + '-meta:///', JSON.stringify({ mode: mode | constants.S_IFDIR }));
    localStorage.setItem(mountpoint + ':///', '');
  }
  mounted = true;
}

function openFile(path, stats, options, write) {
  var flag = options.flag;
  switch (flag) {
    
    // file must exist
    case 'r':
    case 'r+':
    case 'rs':
    case 'rs+':
      if (!stats) {
        error('ENOENT', "no such file or directory '" + path + "'");
      }
      break;
    
    // file must not exist
    case 'wx':
    case 'wx+':
    case 'ax':
    case 'ax+':
      if (stats) {
        error('EEXIST', "file already exists '" + path + "'");
      }
      break;
    
    // move along
    case 'w':
    case 'w+':
    case 'a':
    case 'a+':
      break;
    
    default:
      throw new TypeError('Unknown flag');
  }
  
  if (write) {
    if (flag.match(/^r/) &&
        flag.match(/[^\+]$/)) {
      error('EBADF', 'bad file descriptor');
    }
  }
  else {
    if (flag.match(/^[w|a]/) &&
        flag.match(/[^\+]$/)) {
      error('EBADF', 'bad file descriptor');
    }
  }
  
  if (!stats) {
    var mode = options.mode & ~process.umask();
    stats = { mode: mode | constants.S_IFREG };
    localStorage.setItem(mountpoint + '://' + path, '');
    localStorage.setItem(mountpoint + '-meta://' + path, JSON.stringify(stats));
  }
}

function trySync(method, catchErrors) {
  return function() {
    var args = Array.prototype.slice.call(arguments);
    var syncArgs = args.slice(0, -1);
    var callback = args.slice(-1)[0];
    
    var error, retval;
    if (catchErrors === false) {
      retval = method.apply(fs, syncArgs);
    }
    else {
      try {
        retval = method.apply(fs, syncArgs);
      } catch (err) {
        error = err;
      }
    }
    
    process.nextTick(function() {
      if (catchErrors === false) callback(retval);
      else callback(error, retval);
    });
  }
}

function addDirectoryListing(path) {
  var lastslash = path.lastIndexOf('/');
  var filename = path.slice(lastslash + 1);
  var dirname = path.slice(0, lastslash) || '/';
  var ls = fs.readdirSync(dirname);
  var listed = false;
  for (var i=0; i<ls.length; i++) {
    var file = ls[i];
    if (file === filename) {
      listed = true;
      break;
    }
  }
  if (!listed) {
    ls.push(filename);
    localStorage.setItem(mountpoint + '://' + dirname, ls.join('\n'));
  }
}

function removeDirectoryListing(path) {
  var lastslash = path.lastIndexOf('/');
  var filename = path.slice(lastslash + 1);
  var dirname = path.slice(0, lastslash) || '/';
  var ls = fs.readdirSync(dirname);
  var newls = [];
  for (var i=0; i<ls.length; i++) {
    var file = ls[i];
    if (file !== filename) {
      newls.push(file);
    }
  }
  localStorage.setItem(mountpoint + '://' + dirname, newls.join('\n'));
}

function modeNum(mode) {
  if (typeof mode !== 'number') {
    if (typeof mode === 'string') {
      mode = parseInt(mode, 8);
    }
    else {
      error('EPERM', mode + ' is not a valid permission mode');
    }
  }
  return mode & permissionsMask;
}

function notImplemented(name) {
  return function() {
    error('ENOTIMPLEMENTED', name + ' has not yet been implemented by localstorage-fs, you should submit a pull request');
  }
}

function error(code, message) {
  message = code + ', ' + message;
  var err = new Error(message);
  err.code = code;
  throw err;
}


// browserland shims for process that maybe shouldn't be in this module

if (typeof window !== undefined) {
  var cwd = '/';
  var umask = 022;
  
  process.cwd = function() { 
    return cwd;
  };
  
  process.chdir = function(dirpath) {
    dirpath = normalizePath(dirpath);
    var s = fs.statSync(dirpath);
    if (!s.isDirectory()) {
      error('ENOTDIR', 'not a directory');
    }
    cwd = dirpath;
  };
  
  process.umask = function(newMask) {
    if (typeof umask === 'string') umask()
    umask = newMask;
    return umask;
  }; 
}
