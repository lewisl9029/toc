var asp = require('rsvp').denodeify;
var fs = require('graceful-fs');
var path = require('path');
var which = require('which');
var auth = require('./auth');

var isWindows = process.platform.match(/^win/);

function getFilepaths() {
  var home = isWindows ? process.env.USERPROFILE : process.env.HOME;
  var proj = process.env.jspmConfigPath ? path.dirname(process.env.jspmConfigPath) : process.cwd();
  var paths = [path.resolve(proj, '.npmrc'), path.resolve(home, '.npmrc')];

  return paths;
}

function getOptionExact(contents, key) {
  var regex = new RegExp('^' + key + ' ?= ?(.+)', 'm');
  var result;
  for (var i = 0; i <= contents.length; i++) {
    var content = contents[i];
    result = content && content.match(regex);
    if (result)
      return result[1];
  }
}

function getOption(contents, key, registry) {
  if (registry) {
    var prefix = registry.replace(/^.+:/, '') + '/:';
    return getOptionExact(contents, prefix + key) || getOptionExact(contents, key);
  }
  else
    return getOptionExact(contents, key);
}

function safeRead(filepath) {
  if (fs.existsSync(filepath))
    return fs.readFileSync(filepath).toString();
}

function Npmrc() {}

Npmrc.prototype.init = function() {
  this.contents = getFilepaths().map(safeRead);
  this.initialized = true;
};

Npmrc.prototype.getAuth = function(registry) {
  if (!registry)
    registry = this.getRegistry();

  if (!this.initialized)
    this.init();

  var _authToken = getOption(this.contents, '_authToken', registry);
  if (_authToken)
    return { token: _authToken };

  var _auth = getOption(this.contents, '_auth', registry);
  if (_auth)
    return auth.decodeCredentials(_auth);

  return {
    username: getOption(this.contents, 'username', registry),
    password: getOption(this.contents, '_password', registry)
  };
};

Npmrc.prototype.getRegistry = function() {
  if (!this.initialized)
    this.init();

  return getOption(this.contents, 'registry');
};

module.exports = Npmrc;
