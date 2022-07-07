(function(app) {
  'use strict';

  var Events = app.Events || require('./events.js');

  var isPlainObject = function(obj) {
    return (typeof obj === 'object' && obj !== null &&
            Object.prototype.toString.call(obj) === '[object Object]');
  };

  var Attributes = function(attrs) {
    this._attrs = attrs || {};
    this._events = new Events();
  };

  Attributes.prototype.get = function(name) {
    return this._attrs[name];
  };

  Attributes.prototype.set = function(name, value) {
    var changes = null;
    if (isPlainObject(name)) {
      var obj = name;
      for (var key in obj) {
        if (this._set(key, obj[key])) {
          this._events.emit('change:' + key, obj[key]);
          if (!changes) {
            changes = {};
          }
          changes[key] = obj[key];
        }
      }
    } else {
      if (this._set(name, value)) {
        this._events.emit('change:' + name, value);
        changes = {};
        changes[name] = value;
      }
    }
    if (!changes) {
      return;
    }
    this._events.emit('change', changes);
  };

  Attributes.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  Attributes.prototype.off = function() {
    return Events.prototype.off.apply(this._events, arguments);
  };

  Attributes.prototype._set = function(name, value) {
    if (this._attrs[name] === value) {
      return false;
    }
    this._attrs[name] = value;
    return true;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Attributes;
  } else {
    app.Attributes = Attributes;
  }
})(this.app || (this.app = {}));
