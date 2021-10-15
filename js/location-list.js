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

  LocationList.prototype.getItems = function(locations) {
    var now = Date.now();
    return locations.map(function(location) {
      var name = location.name;
      var time = new Date(location.getLocalTime(now));
      return [name, time];
    }.bind(this));
  };

  LocationList.prototype.updateData = function() {
    var now = Date.now();
    this.locations.forEach(function(location) {
      location.updateTimezoneOffset(now);
    });
  };

  LocationList.prototype.getLocationName = function(tzName) {
    return tzName.substring(tzName.lastIndexOf('/') + 1).replace(/_/g, ' ');
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
