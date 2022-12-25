(function(app) {
  'use strict';

  var Events = app.Events || require('../base/events.js');

  var ClockLocations = function(presetLocations, geonamesLocations, geonamesAttrs) {
    this._presetLocations = presetLocations;
    this._geonamesLocations = geonamesLocations;
    this._geonamesAttrs = geonamesAttrs;
    this._events = new Events();
  };

  ClockLocations.prototype.init = function() {
    this._presetLocations.on('reset', this._emitResetEvent.bind(this));
    this._presetLocations.on('add', this._events.emit.bind(this._events, 'add'));
    this._presetLocations.on('remove', this._events.emit.bind(this._events, 'remove'));
    this._geonamesLocations.on('reset', this._emitResetEvent.bind(this));
    this._geonamesLocations.on('add', this._events.emit.bind(this._events, 'add'));
    this._geonamesLocations.on('remove', this._events.emit.bind(this._events, 'remove'));
    this._geonamesAttrs.on('change:enabled', this._emitResetEvent.bind(this));
  };

  ClockLocations.prototype.forEach = function() {
    return Array.prototype.forEach.apply(this._toArray(), arguments);
  };

  ClockLocations.prototype.reduce = function() {
    return Array.prototype.reduce.apply(this._toArray(), arguments);
  };

  ClockLocations.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  ClockLocations.prototype._emitResetEvent = function() {
    this._events.emit('reset', this._toArray());
  };

  ClockLocations.prototype._toArray = function() {
    if (this._geonamesAttrs.get('enabled')) {
      return this._presetLocations.toArray().concat(this._geonamesLocations.toArray());
    } else {
      return this._presetLocations.toArray();
    }
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClockLocations;
  } else {
    app.ClockLocations = ClockLocations;
  }
})(this.app || (this.app = {}));
