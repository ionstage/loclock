(function(app) {
  'use strict';

  var moment = require('moment-timezone');
  var LocationData = app.LocationData || require('./location-data.js');

  var Location = function(key) {
    this.key = key;
    this.name = this._createName(key);
    this._currentTimezoneOffset = NaN;
    this._timezoneOffset = NaN;
  };

  Location.KEY_CURRENT_LOCATION = 'Current_Location';

  Location.PRESET_KEYS = LocationData.TZ_LOCATION_KEYS.concat(LocationData.ADDITIONAL_LOCATION_KEYS, [Location.KEY_CURRENT_LOCATION]);

  Location.get = (function() {
    var cache = {};
    return function(key) {
      if (!Location._isValidKey(key)) {
        return null;
      }
      if (!cache[key]) {
        cache[key] = new Location(key);
      }
      return cache[key];
    };
  })();

  Location._isValidKey = function(key) {
    return (key === Location.KEY_CURRENT_LOCATION) || (moment.tz.zone(Location._keyToTzname(key)) !== null);
  };

  Location._keyToTzname = function(key) {
    return key.split('#/')[0];
  };

  Location.prototype.match = function(key) {
    return (key === this.key || key === this._getFullKey());
  };

  Location.prototype.updateTimezoneOffset = function(time) {
    this._currentTimezoneOffset = new Date(time).getTimezoneOffset();
    this._timezoneOffset = this._createTimezoneOffset(time);
  };

  Location.prototype.getLocalTime = function(time) {
    return time + this._timezoneOffset * 1000 + this._currentTimezoneOffset * 60 * 1000;
  };

  Location.prototype._createName = function(key) {
    if (key === Location.KEY_CURRENT_LOCATION) {
      return 'Current Location';
    }
    if (key in LocationData.TZ_LOCATION_NAME_MAP) {
      return LocationData.TZ_LOCATION_NAME_MAP[key];
    }
    return key.split('#!')[0].substring(key.lastIndexOf('/') + 1).replace(/_/g, ' ');
  };

  Location.prototype._createTimezoneOffset = function(time) {
    if (this.key === Location.KEY_CURRENT_LOCATION) {
      return this._currentTimezoneOffset * (-60);
    }
    return moment.tz.zone(Location._keyToTzname(this.key)).utcOffset(time) * (-60);
  };

  Location.prototype._getFullKey = function() {
    return (this.key.indexOf('#/') === -1 ? this.key + '#/' + this.name : this.key);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Location;
  } else {
    app.Location = Location;
  }
})(this.app || (this.app = {}));
