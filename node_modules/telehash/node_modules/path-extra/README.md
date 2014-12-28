Node.js: path-extra
===================

This module simply modifies the Node.js 'path' object with extra methods. It is a drop in replacement for the `path` module.



Installation
------------

    $ npm install path-extra



Usage
-----

```javascript
var path = require('path-extra');
```

You can still use all of the vanilla Node.js path methods. 

Methods:

```javascript
path.tempdir() //returns a temporary directory that is operating system specific.
path.homedir() //return the user's home directory
path.datadir()
```



License
-------

(The MIT License)

Copyright (c) 2011-2012 JP Richardson

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files 
(the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify,
 merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS 
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


