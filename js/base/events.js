(function(app) {
  'use strict';

  var Events = function() {
    this._events = {};
  };

  Events.prototype.on = function(eventName, listener) {
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push(listener);
  };

  Events.prototype.off = function(eventName, listener) {
    if (!this._events[eventName]) {
      return;
    }
    var index = this._events[eventName].lastIndexOf(listener);
    if (index !== -1) {
      this._events[eventName].splice(index, 1);
    }
  };

  Events.prototype.emit = function(eventName) {
    var listeners = this._events[eventName];
    if (!listeners) {
      return;
    }
    var args = Array.prototype.slice.call(arguments, 1);
    for (var i = 0, len = listeners.length; i < len; i++) {
      listeners[i].apply(null, args);
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Events;
  } else {
    app.Events = Events;
  }
})(this.app || (this.app = {}));
