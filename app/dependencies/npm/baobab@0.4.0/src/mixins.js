/* */ 
var Combination = require("./combination"),
    type = require("./type");
module.exports = {
  baobab: function(baobab) {
    return {mixins: [{
        getInitialState: function() {
          this.tree = baobab;
          if (!this.cursor && !this.cursors)
            return {};
          if (this.cursor && this.cursors)
            throw Error('baobab.mixin: you cannot have both ' + '`component.cursor` and `component.cursors`. Please ' + 'make up your mind.');
          this.__type = null;
          this.__updateHandler = (function() {
            this.setState(this.__getCursorData());
          }).bind(this);
          if (this.cursor) {
            if (!type.MixinCursor(this.cursor))
              throw Error('baobab.mixin.cursor: invalid data (cursor, string or array).');
            if (!type.Cursor(this.cursor))
              this.cursor = baobab.select(this.cursor);
            this.__getCursorData = (function() {
              return {cursor: this.cursor.get()};
            }).bind(this);
            this.__type = 'single';
          } else if (this.cursors) {
            if (['object', 'array'].indexOf(type(this.cursors)) === -1)
              throw Error('baobab.mixin.cursor: invalid data (object or array).');
            if (type.Array(this.cursors)) {
              this.cursors = this.cursors.map(function(path) {
                return type.Cursor(path) ? path : baobab.select(path);
              });
              this.__getCursorData = (function() {
                return {cursors: this.cursors.map(function(cursor) {
                    return cursor.get();
                  })};
              }).bind(this);
              this.__type = 'array';
            } else {
              for (var k in this.cursors) {
                if (!type.Cursor(this.cursors[k]))
                  this.cursors[k] = baobab.select(this.cursors[k]);
              }
              this.__getCursorData = (function() {
                var d = {};
                for (k in this.cursors)
                  d[k] = this.cursors[k].get();
                return {cursors: d};
              }).bind(this);
              this.__type = 'object';
            }
          }
          return this.__getCursorData();
        },
        componentDidMount: function() {
          if (this.__type === 'single') {
            this.__combination = new Combination('or', [this.cursor]);
            this.__combination.on('update', this.__updateHandler);
          } else if (this.__type === 'array') {
            this.__combination = new Combination('or', this.cursors);
            this.__combination.on('update', this.__updateHandler);
          } else if (this.__type === 'object') {
            this.__combination = new Combination('or', Object.keys(this.cursors).map(function(k) {
              return this.cursors[k];
            }, this));
            this.__combination.on('update', this.__updateHandler);
          }
        },
        componentWillUnmount: function() {
          if (this.__combination)
            this.__combination.release();
        }
      }].concat(baobab.options.mixins)};
  },
  cursor: function(cursor) {
    return {mixins: [{
        getInitialState: function() {
          this.cursor = cursor;
          this.__updateHandler = (function() {
            this.setState({cursor: this.cursor.get()});
          }).bind(this);
          return {cursor: this.cursor.get()};
        },
        componentDidMount: function() {
          this.cursor.on('update', this.__updateHandler);
        },
        componentWillUnmount: function() {
          this.cursor.off('update', this.__updateHandler);
        }
      }].concat(cursor.root.options.mixins)};
  }
};
