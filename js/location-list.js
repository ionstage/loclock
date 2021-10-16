(function(app) {
  'use strict';

  var helper = app.helper || require('./helper.js');
  var Location = app.Location || require('./location.js');

  var LocationList = function() {
    this.locations = this._createLocations(Location.DEFAULT_KEYS);
  };

  LocationList.prototype.findLocations = function(keys) {
    return keys.map(function(key) {
      return helper.find(this.locations, function(location) {
        return (location.key === key);
      });
    }.bind(this));
  };

  LocationList.prototype.updateTimezoneOffset = function(now) {
    this.locations.forEach(function(location) {
      location.updateTimezoneOffset(now);
    });
  };

  LocationList.prototype._createLocations = function(keys) {
    return keys.map(function(key) {
      return new Location(key);
    });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocationList;
  } else {
    app.LocationList = LocationList;
  }
})(this.app || (this.app = {}));
