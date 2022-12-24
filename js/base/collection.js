(function(app) {
  'use strict';

  var Events = app.Events || require('./events.js');

  var Collection = function(items) {
    this._items = items || [];
    this._events = new Events();
  };

  Object.defineProperty(Collection.prototype, 'length', {
    get: function() {
      return this._items.length;
    },
  });

  Collection.prototype.add = function(item) {
    this._items.push(item);
    this._events.emit('add', item);
  };

  Collection.prototype.remove = function(item) {
    var index = this._items.lastIndexOf(item);
    if (index === -1) {
      return;
    }
    this._items.splice(index, 1);
    this._events.emit('remove', item);
  };

  Collection.prototype.reset = function(items) {
    this._items = items || [];
    this._events.emit('reset', this._items);
  };

  Collection.prototype.forEach = function() {
    return Array.prototype.forEach.apply(this._items, arguments);
  };

  Collection.prototype.map = function() {
    return Array.prototype.map.apply(this._items, arguments);
  };

  Collection.prototype.reduce = function() {
    return Array.prototype.reduce.apply(this._items, arguments);
  };

  Collection.prototype.find = function(callback) {
    for (var i = 0, len = this._items.length; i < len; i++) {
      if (callback(this._items[i], i, this._items)) {
        return this._items[i];
      }
    }
    return null;
  };

  Collection.prototype.includes = function(item) {
    return (this._items.indexOf(item) !== -1);
  };

  Collection.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  Collection.prototype.off = function() {
    return Events.prototype.off.apply(this._events, arguments);
  };

  Collection.prototype.toArray = function() {
    return this._items.slice();
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Collection;
  } else {
    app.Collection = Collection;
  }
})(this.app || (this.app = {}));
