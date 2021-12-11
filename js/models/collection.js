(function(app) {
  'use strict';

  var Events = app.Events || require('./events.js');

  var Collection = function() {
    this.items = [];
    this.events = new Events();
  };

  Collection.prototype.add = function(item) {
    this.items.push(item);
    this.events.emit('add', item);
  };

  Collection.prototype.remove = function(item) {
    var index = this.items.lastIndexOf(item);
    if (index === -1) {
      return;
    }
    this.items.splice(index, 1);
    this.events.emit('remove', item);
  };

  Collection.prototype.reset = function(items) {
    this.items = items || [];
    this.events.emit('reset', this.items);
  };

  Collection.prototype.forEach = function() {
    return Array.prototype.forEach.apply(this.items, arguments);
  };

  Collection.prototype.map = function() {
    return Array.prototype.map.apply(this.items, arguments);
  };

  Collection.prototype.find = function(callback) {
    for (var i = 0, len = this.items.length; i < len; i++) {
      if (callback(this.items[i], i, this.items)) {
        return this.items[i];
      }
    }
    return null;
  };

  Collection.prototype.on = function() {
    return Events.prototype.on.apply(this.events, arguments);
  };

  Collection.prototype.off = function() {
    return Events.prototype.off.apply(this.events, arguments);
  };

  Collection.prototype.removeAllListeners = function() {
    return Events.prototype.removeAllListeners.apply(this.events, arguments);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Collection;
  } else {
    app.Collection = Collection;
  }
})(this.app || (this.app = {}));
