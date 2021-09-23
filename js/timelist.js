(function(app) {
  'use strict';

  var Base64 = require('js-base64').Base64;
  var moment = require('moment-timezone');
  var timezone = app.timezone || require('./timezone.js');

  var timelist = {
    KEY_CURRENT_LOCATION: 'Current_Location',
    data: {},
    selected: [],
    get: function() {
      if (Object.keys(this.data).length === 0 || this.selected.length === 0) {
        return [];
      }

      var selected_timezone = this.selected.map(function(key) {
        return [key, this.data[key]];
      }.bind(this));

      return this._getTimelist(selected_timezone);
    },
    updateData: function() {
      this.data = this._createTimezoneData();
    },
    setCustomTimezoneList: function(list) {
      this._setUrlSearchParam('custom_tzlist', Base64.encodeURI(list.join(',')));
    },
    setHiddenTimezoneList: function(list) {
      this._setUrlSearchParam('hidden_tzlist', Base64.encodeURI(list.join(',')));
    },
    getLocationName: function(tzName) {
      return tzName.substring(tzName.lastIndexOf('/') + 1).replace(/_/g, ' ');
    },
    _getTimelist: function(timezone) {
      var date = new Date();
      var currentTime = date.getTime();
      var currentTimezoneOffset = date.getTimezoneOffset();

      return timezone.map(function(item) {
        var name = this.getLocationName(item[0]);
        var time = parseInt(item[1], 10);
        time = new Date(currentTime + time * 1000 + currentTimezoneOffset * 60 * 1000);
        return [name, time];
      }.bind(this));
    },
    _createTimezoneData: function() {
      var data  = {};
      var now = Date.now();

      timezone.names.forEach(function(name) {
        data[name] = moment.tz.zone(name.split('#/')[0]).utcOffset(now) * (-60);
      });

      data[this.KEY_CURRENT_LOCATION] = new Date().getTimezoneOffset() * (-60);

      var params = this._getUrlSearchParams();
      this._getCustomTimezoneList(params).forEach(function(name) {
        if (name in data) {
          return;
        }
        var tz = moment.tz.zone(name.split('#/')[0]);
        if (tz) {
          data[name] = tz.utcOffset(now) * (-60);
        }
      });

      this._getHiddenTimezoneList(params).forEach(function(name) {
        delete data[name];
      });

      return data;
    },
    _getCustomTimezoneList: function(params) {
      return (params.custom_tzlist ? Base64.decode(params.custom_tzlist).split(',') : []);
    },
    _getHiddenTimezoneList: function(params) {
      return (params.hidden_tzlist ? Base64.decode(params.hidden_tzlist).split(',') : []);
    },
    _getUrlSearchParams: function() {
      var params = {};
      var pairs = location.search.substring(1).split('&');
      for (var i = 0, len = pairs.length; i < len; i++) {
        var pair = pairs[i];
        var index = pair.indexOf('=');
        if (index !== -1) {
          var name = decodeURIComponent(pair.slice(0, index));
          var value = decodeURIComponent(pair.slice(index + 1));
          params[name] = value;
        } else if (pair) {
          params[decodeURIComponent(pair)] = '';
        }
      }
      return params;
    },
    _setUrlSearchParam: function(name, value) {
      var params = this._getUrlSearchParams();
      params[name] = value;
      var search = '?' + Object.keys(params).map(function(name) {
        return encodeURIComponent(name) + '=' + encodeURIComponent(params[name]);
      }).join('&');
      history.replaceState(null, null, search + location.hash);
    },
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = timelist;
  } else {
    app.timelist = timelist;
  }
})(this.app || (this.app = {}));