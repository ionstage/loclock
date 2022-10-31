(function(app) {
  'use strict';

  var Collection = app.Collection || require('../base/collection.js');
  var Events = app.Events || require('../base/events.js');

  var GeoNamesLocations = function() {
    this._enabled = false;
    this._events = new Events();
    this._items = this._createItems(this._events);
  };

  GeoNamesLocations.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  GeoNamesLocations.prototype.setEnabled = function(enabled) {
    if (enabled === this._enabled) {
      return;
    }
    this._enabled = enabled;
    this._events.emit(enabled ? 'enabled' : 'disabled');
  };

  GeoNamesLocations.prototype._createItems = function(events) {
    var items = new Collection();
    items.on('add', events.emit.bind(events, 'add'));
    items.on('remove', events.emit.bind(events, 'remove'));
    items.on('reset', events.emit.bind(events, 'reset'));
    return items;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesLocations;
  } else {
    app.GeoNamesLocations = GeoNamesLocations;
  }
})(this.app || (this.app = {}));
