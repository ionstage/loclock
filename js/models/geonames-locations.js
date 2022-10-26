(function(app) {
  'use strict';

  var Events = app.Events || require('../base/events.js');

  var GeoNamesLocations = function() {
    this._enabled = false;
    this._events = new Events();
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

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeoNamesLocations;
  } else {
    app.GeoNamesLocations = GeoNamesLocations;
  }
})(this.app || (this.app = {}));
