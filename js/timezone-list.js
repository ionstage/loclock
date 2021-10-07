(function(app) {
  'use strict';

  var moment = require('moment-timezone');
  var Timezone = app.Timezone || require('./timezone.js');

  var TimezoneList = function() {
    this.KEY_CURRENT_LOCATION = 'Current_Location';
    this.data = {};
    this.selected = [];
  };

  TimezoneList.prototype.get = function() {
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

  TimezoneList.prototype.updateData = function() {
    this.data = this._createTimezoneData(Timezone.DEFAULT_LOCATION_KEYS);
  };

  TimezoneList.prototype.getLocationName = function(tzName) {
    return tzName.substring(tzName.lastIndexOf('/') + 1).replace(/_/g, ' ');
  };

  TimezoneList.prototype._createTimezoneData = function(defaultList) {
    var data  = {};
    var now = Date.now();

    defaultList.forEach(function(name) {
      data[name] = moment.tz.zone(name.split('#/')[0]).utcOffset(now) * (-60);
    });

    data[this.KEY_CURRENT_LOCATION] = new Date().getTimezoneOffset() * (-60);

    return data;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimezoneList;
  } else {
    app.TimezoneList = TimezoneList;
  }
})(this.app || (this.app = {}));
