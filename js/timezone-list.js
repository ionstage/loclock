(function(app) {
  'use strict';

  var Base64 = require('js-base64').Base64;
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

    var selected_timezone = this.selected.map(function(key) {
      return [key, this.data[key]];
    }.bind(this));

    return this._getTimelist(selected_timezone);
  };

  TimezoneList.prototype.updateData = function() {
    var params = this._getUrlSearchParams();
    var customList = this._decodeTimezoneList(params.custom_tzlist);
    var hiddenList = this._decodeTimezoneList(params.hidden_tzlist);
    this.data = this._createTimezoneData(Timezone.LOCATION_NAMES, customList, hiddenList);
  };

  TimezoneList.prototype.setCustomTimezoneList = function(list) {
    this._setUrlSearchParam('custom_tzlist', Base64.encodeURI(list.join(',')));
  };

  TimezoneList.prototype.setHiddenTimezoneList = function(list) {
    this._setUrlSearchParam('hidden_tzlist', Base64.encodeURI(list.join(',')));
  };

  TimezoneList.prototype.getLocationName = function(tzName) {
    return tzName.substring(tzName.lastIndexOf('/') + 1).replace(/_/g, ' ');
  };

  TimezoneList.prototype._getTimelist = function(timezone) {
    var date = new Date();
    var currentTime = date.getTime();
    var currentTimezoneOffset = date.getTimezoneOffset();

    return timezone.map(function(item) {
      var name = this.getLocationName(item[0]);
      var time = parseInt(item[1], 10);
      time = new Date(currentTime + time * 1000 + currentTimezoneOffset * 60 * 1000);
      return [name, time];
    }.bind(this));
  };

  TimezoneList.prototype._createTimezoneData = function(defaultList, customList, hiddenList) {
    var data  = {};
    var now = Date.now();

    defaultList.forEach(function(name) {
      data[name] = moment.tz.zone(name.split('#/')[0]).utcOffset(now) * (-60);
    });

    data[this.KEY_CURRENT_LOCATION] = new Date().getTimezoneOffset() * (-60);

    customList.forEach(function(name) {
      if (name in data) {
        return;
      }
      var tz = moment.tz.zone(name.split('#/')[0]);
      if (tz) {
        data[name] = tz.utcOffset(now) * (-60);
      }
    });

    hiddenList.forEach(function(name) {
      delete data[name];
    });

    return data;
  };

  TimezoneList.prototype._decodeTimezoneList = function(value) {
    return (value ? Base64.decode(value).split(',') : []);
  };

  TimezoneList.prototype._getUrlSearchParams = function() {
    return location.search.substring(1).split('&').reduce(function(ret, pair) {
      var items = pair.split('=');
      var key = decodeURIComponent(items[0] || '');
      var value = decodeURIComponent(items[1] || '');
      ret[key] = value;
      return ret;
    }, {});
  };

  TimezoneList.prototype._setUrlSearchParam = function(name, value) {
    var params = this._getUrlSearchParams();
    params[name] = value;
    var search = '?' + Object.keys(params).map(function(name) {
      return encodeURIComponent(name) + '=' + encodeURIComponent(params[name]);
    }).join('&');
    history.replaceState(null, null, search + location.hash);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = TimezoneList;
  } else {
    app.TimezoneList = TimezoneList;
  }
})(this.app || (this.app = {}));
