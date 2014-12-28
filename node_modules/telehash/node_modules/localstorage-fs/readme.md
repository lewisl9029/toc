# localstorage-fs
node's [`fs`](http://nodejs.org/api/fs.html) module backed by [`localStorage`](http://www.w3.org/TR/webstorage/#the-localstorage-attribute)

[![Browser Support](http://ci.testling.com/jessetane/localstorage-fs.png)](http://ci.testling.com/jessetane/localstorage-fs)

## why
[this](https://github.com/juliangruber/level-fs-browser) would be way better, but i needed the sync methods

## how
browserify and use like you would in node land

## api coverage
* `fs.rename(oldPath, newPath, callback)`
* `fs.renameSync(oldPath, newPath)`
* `fs.truncate(path, len, callback)`
* `fs.truncateSync(path, len)`
* `fs.chmod(path, mode, callback)`
* `fs.chmodSync(path, mode)`
* `fs.stat(path, callback)`
* `fs.statSync(path)`
* `fs.unlink(path, callback)`
* `fs.unlinkSync(path)`
* `fs.rmdir(path, callback)`
* `fs.rmdirSync(path)`
* `fs.mkdir(path, callback)`
* `fs.mkdirSync(path, mode)`
* `fs.readdir(path, callback)`
* `fs.readdirSync(path)`
* `fs.readFile(path, options, callback)`
* `fs.readFileSync(path, options)`
* `fs.writeFile(path, data, options, callback)`
* `fs.writeFileSync(path, data, options)`
* `fs.appendFile(path, data, options, callback)`
* `fs.appendFileSync(path, data, options)`
* `fs.exists(path, callback)`
* `fs.existsSync(path)`
* `fs.createWriteStream(path, options)`
* `fs.createReadStream(path, options)`

others that could probably be implemented [here](https://github.com/jessetane/localstorage-fs/blob/master/index.js#L235)

## tests / example
* get browserify
* get bash
* `npm run test`
* `npm run example`

## implementation
* file data and directory listings are keyed by `'/path/name'` under the prefix: `'file://'`
* meta data (also keyed by path name) is stored as JSON stringified `fs.Stats` instances under `'file-meta://'`
* file contents are stored as base64 encoded strings which means binary files work
* directory listings are stored as newline delimited plain strings (like `ls(1)`)
* async methods are faked with `process.nextTick`
* streams are faked by buffering into memory

## notes
* some `fs` related [`process`](https://github.com/jessetane/localstorage-fs/blob/master/index.js#L547) methods are shimmed out by this module for now

## license
WTFPL