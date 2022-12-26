(function(app) {
  'use strict';

  var Base64 = require('js-base64').Base64;
  var helper = app.helper || require('../helper.js');
  var dom = app.dom || require('../dom.js');
  var Attributes = app.Attributes || require('../base/attributes.js');
  var ClockLocations = app.ClockLocations || require('../models/clock-locations.js');
  var Collection = app.Collection || require('../base/collection.js');
  var GeoNamesData = app.GeoNamesData || require('../models/geonames-data.js');
  var Main = app.Main || require('./main.js');
  var Location = app.Location || require('../models/location.js');

  var DEFAULT_LOCATION_KEYS = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
  var THEME_KEY = 'loclock.theme';

  var Root = function() {
    this._locations = new Collection();
    this._selectedLocations = new Collection();
    this._themeAttrs = new Attributes({ value: this._loadTheme() });
    this._geonamesAttrs = new Attributes({ enabled: this._loadGeoNamesEnabled() });
    this._geonamesData = new GeoNamesData('./data/geonames.json');
    this._geonamesLocations = new Collection();
    this._clockLocations = new ClockLocations(this._selectedLocations, this._geonamesLocations, this._geonamesAttrs);
    this._main = new Main(document.querySelector('.main'), {
      locations: this._locations,
      selectedLocations: this._selectedLocations,
      themeAttrs: this._themeAttrs,
      geonamesAttrs: this._geonamesAttrs,
      geonamesData: this._geonamesData,
      geonamesLocations: this._geonamesLocations,
      clockLocations: this._clockLocations,
    });
  };

  Root.prototype.init = function() {
    this._clockLocations.init();
    this._main.init();

    window.addEventListener('resize', helper.debounce(this._main.resize.bind(this._main), 100));
    this._disableTouchScrolling();

    this._selectedLocations.on('reset', this._saveSelectedLocations.bind(this));
    this._selectedLocations.on('add', this._saveSelectedLocations.bind(this));
    this._selectedLocations.on('remove', this._saveSelectedLocations.bind(this));
    this._themeAttrs.on('change:value', this._saveTheme.bind(this));
    this._geonamesAttrs.on('change:enabled', this._saveGeoNamesEnabled.bind(this));
    this._geonamesLocations.on('add', this._saveGeoNamesLocations.bind(this));
    this._geonamesLocations.on('remove', this._saveGeoNamesLocations.bind(this));

    this._locations.reset(this._createLocations(Location.PRESET_KEYS));
    this._selectedLocations.reset(this._loadSelectedLocations());

    this._resetGeoNamesLocations();
  };

  Root.prototype._getDefaultLocationKeys = function() {
    var isGeoNamesUsed = (dom.getURLSearchParam('geonamesEnabled') !== null) || (dom.getURLSearchParam('geonamesLocations') !== null);
    return (isGeoNamesUsed ? [] : DEFAULT_LOCATION_KEYS);
  };

  Root.prototype._createLocations = function(keys) {
    return keys.map(function(key) {
      return Location.get(key);
    }).sort(function(a, b) {
      if (a.key === Location.KEY_CURRENT_LOCATION) {
        return -1;
      }
      if (b.key === Location.KEY_CURRENT_LOCATION) {
        return 1;
      }
      return a.name.localeCompare(b.name);
    });
  };

  Root.prototype._loadSelectedLocations = function() {
    var fragment = window.location.hash.substring(1);
    var keys = (fragment ? this._decodeLocationKeys(fragment) : this._getDefaultLocationKeys());
    return keys.filter(function(key, index, keys) {
      var isUnique = (keys.indexOf(key) === index);
      return isUnique;
    }).reduce(function(locations, key) {
      var location = this._locations.find(function(location) {
        return location.match(key);
      });
      if (location) {
        locations.push(location);
      }
      return locations;
    }.bind(this), []);
  };

  Root.prototype._saveSelectedLocations = function() {
    var keys = this._selectedLocations.map(function(location) {
      return location.key;
    });
    window.location.replace('#' + this._encodeLocationKeys(keys));
  };

  Root.prototype._loadTheme = function() {
    return localStorage.getItem(THEME_KEY) || 'light';
  };

  Root.prototype._saveTheme = function(value) {
    localStorage.setItem(THEME_KEY, value);
  };

  Root.prototype._loadGeoNamesEnabled = function() {
    return (dom.getURLSearchParam('geonamesEnabled') !== null);
  };

  Root.prototype._saveGeoNamesEnabled = function(enabled) {
    if (enabled) {
      dom.setURLSearchParam('geonamesEnabled', '');
    } else {
      dom.deleteURLSearchParam('geonamesEnabled');
    }
  };

  Root.prototype._resetGeoNamesLocations = function() {
    var param = dom.getURLSearchParam('geonamesLocations');
    if (!param) {
      return;
    }
    this._geonamesData.load().then(function() {
      var keys = this._decodeLocationKeys(param);
      var locations = keys.reduce(function(locations, key) {
        var cityID = key.split('#!gn')[1];
        if (!cityID || !this._geonamesData.findCity(cityID)) {
          return locations;
        }
        var location = Location.get(key);
        if (location) {
          locations.push(location);
        }
        return locations;
      }.bind(this), []);
      this._geonamesLocations.reset(locations);
    }.bind(this));
  };

  Root.prototype._saveGeoNamesLocations = function() {
    if (this._geonamesLocations.length === 0) {
      dom.deleteURLSearchParam('geonamesLocations');
      return;
    }
    var keys = this._geonamesLocations.map(function(location) {
      return location.key;
    });
    dom.setURLSearchParam('geonamesLocations', this._encodeLocationKeys(keys));
  };

  Root.prototype._encodeLocationKeys = function(keys) {
    return Base64.encodeURI(keys.join(','))
  };

  Root.prototype._decodeLocationKeys = function(s) {
    return Base64.decode(s).split(',');
  };

  Root.prototype._disableTouchScrolling = function() {
    this._main.disableTouchScrolling();
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Root;
  } else {
    app.Root = Root;
  }
})(this.app || (this.app = {}));
