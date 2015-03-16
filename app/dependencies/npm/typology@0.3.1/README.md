# Typology

Typology is a lightweight data validation library for Node.js and the browser (with or without [Browserify](http://browserify.org/)).

It can validate variables against native JavaScript types as well as against custom types you can define.

## Installation

Install with npm:

```bash
// Latest release
npm install typology

// Development version
npm install git+https://github.com/jacomyal/typology.git
```

Include the [`typology.js`](./typology.js) (or the minified version [`typology.min.js`](./typology.min.js)) file client-side if you do not want to use Browserify or a similar library.

## Usage

### Get the native type of a given variable

```js
var types = require('typology');

types.get(true);
>>> 'boolean'

types.get(/abc/);
>>> 'regexp'

// Native types being:
// 'boolean', 'number', 'string'
// 'function', 'array', 'arguments'
// 'regexp', 'date', 'object'
// 'null', 'undefined', 'primitive'
```

### Deal with custom types

A custom type can be either be defined by a function returning a boolean or an expressive string or object describing the type you want to check.

*Example*

```js
// Type defined by a function
var customType = function(variable) {
  // Here is an example to know if a variable is an integer:
  return typeof variable === 'number' && variable === (variable | 0);
};

// Type defined by an expressive string
var customType = '?string'; // Means you want an optional string
var customType = 'string|number'; // Means you want either a string or a number

// Type defined by a complex object
var customType = {
  firstname: 'string',
  lastname: 'string',
  age: 'number'
};
```

#### Custom types syntax

<table>
  <tr>
    <td><b>Expression</b></td>
    <td><b>Description</b></td>
    <td><b>Examples</b></td>
    <td><b>Validates</b></td>
  </tr>
  <tr>
    <td><code>'type'</code></td>
    <td>required</td>
    <td><code>'string'</code></td>
    <td><code>'hello'</code></td>
  </tr>
  <tr>
    <td><code>'?type'</code></td>
    <td>optional</td>
    <td><code>'?string'</code></td>
    <td><code>'hello'</code>, <code>undefined</code>, <code>null</code></td>
  </tr>
  <tr>
    <td><code>'type1|type2'</code></td>
    <td>multi-types</td>
    <td><code>'string|number'</code></td>
    <td><code>'hello'</code>, <code>45</code>, <code>2.34</code></td>
  </tr>
  <tr>
    <td><code>{prop: 'type'}</code></td>
    <td>complex</td>
    <td><code>{firstname: 'string'}</code></td>
    <td><code>{firstname: 'Joachim'}</code></td>
  </tr>
  <tr>
    <td><code>['type']</code></td>
    <td>lists</td>
    <td><code>['number']</code></td>
    <td><code>[1, 2, 3]</code></td>
  </tr>
  <tr>
    <td><code>'!type'</code></td>
    <td>exclusive</td>
    <td><code>'!string'</code></td>
    <td><code>42</code></td>
  </tr>
</table>

Note also that expression can be combined. For instance `'?string|number'` means an optional string or number variable and `'!string|object'` means anything but a string or an object.

*Overkill example*

```js
var myCustomType = {
  firstname: 'string',
  pseudo: '?string',
  account: {
    total: '?number|string',
    bills: ['number']
  }
}
```

#### Validate a variable against a custom type

```js
var types = require('typology');

types.check(myVariable, myType);

// Example
types.check(1, 'number');
>>> true

types.check(
  {
    firstname: 'Joachim',
    lastname: 'Murat'
  },
  {
    firstname: 'string',
    lastname: 'string',
    age: 'number'
  }
);
>>> false
```

#### Create your own typology to add custom types

```js
var Typology = require('typology');

var myTypology = new Typology();

// Then add custom definitions
myTypology.add(myCustomType);

// Example
myTypology.add('User', {
  firstname: 'string',
  lastname: 'string',
  age: '?number'
});

// Then you can use it likewise
myTypology.check({hello: 'world'}, 'User');
>>> false

// And use it in other types' definition
myTypology.check(myVar, 'User|number');
```

#### Checking whether a custom type's definition is valid

```js
var types = require('typology');

types.isValid(customType);

// Example
types.isValid('?string');
>>> true

types.isValid('randomcrap');
>>> false
```

## Contribution

[![Build Status](https://travis-ci.org/jacomyal/typology.svg)](https://travis-ci.org/jacomyal/typology)

Contributions are welcome. Please be sure to add and pass unit tests if relevant before submitting any code.

To setup the project, just install npm dependencies with `npm install` and run tests with `npm test`.

## License

Typology is under a MIT license.
