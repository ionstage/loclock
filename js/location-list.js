(function(app) {
  'use strict';

  var moment = require('moment-timezone');
  var Location = app.Location || require('./location.js');

  var LocationList = function() {
    this.KEY_CURRENT_LOCATION = 'Current_Location';
    this.data = {};
    this.selected = [];
  };

  LocationList.prototype.get = function() {
    if (Object.keys(this.data).length === 0 || this.selected.length === 0) {
      return [];
    }

    var date = new Date();
    var currentTime = date.getTime();
    var currentTimezoneOffset = date.getTimezoneOffset();

    return this.selected.map(function(key) {
      var name = this.getLocationName(key);
      var time = parseInt(this.data[key], 10);
      time = new Date(currentTime + time * 1000 + currentTimezoneOffset * 60 * 1000);
      return [name, time];
    }.bind(this));
  };

  LocationList.prototype.updateData = function() {
    this.data = this._createTimezoneData(Location.DEFAULT_KEYS);
  };

  LocationList.prototype.getLocationName = function(tzName) {
    return tzName.substring(tzName.lastIndexOf('/') + 1).replace(/_/g, ' ');
  };

  LocationList.prototype._createTimezoneData = function(defaultList) {
    var data  = {};
    var now = Date.now();

    defaultList.forEach(function(name) {
      if (name === Location.KEY_CURRENT_LOCATION) {
        data[Location.KEY_CURRENT_LOCATION] = new Date().getTimezoneOffset() * (-60);
      } else {
        data[name] = moment.tz.zone(name.split('#/')[0]).utcOffset(now) * (-60);
      }
    });
    return data;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocationList;
  } else {
    app.LocationList = LocationList;
  }
})(this.app || (this.app = {}));
