(function(app) {
  'use strict';

  var Base64 = require('js-base64').Base64;
  var helper = app.helper || require('../helper.js');
  var dom = app.dom || require('../dom.js');
  var Collection = app.Collection || require('../base/collection.js');
  var Main = app.Main || require('./main.js');
  var Location = app.Location || require('../models/location.js');

  var DEFAULT_LOCATION_KEYS = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

  var Root = function() {
    this._locations = new Collection();
    this._selectedLocations = new Collection();
    this._main = new Main(document.querySelector('.main'), {
      locations: this._locations,
      selectedLocations: this._selectedLocations,
    });
  };

  Root.prototype.init = function() {
    this._main.init();

    window.addEventListener('resize', helper.debounce(this._main.resize.bind(this._main), 100));
    this._disableTouchScrolling();

    this._selectedLocations.on('reset', this._saveSelectedLocations.bind(this));
    this._selectedLocations.on('add', this._saveSelectedLocations.bind(this));
    this._selectedLocations.on('remove', this._saveSelectedLocations.bind(this));

    this._locations.reset(this._createLocations(Location.PRESET_KEYS));
    this._selectedLocations.reset(this._loadSelectedLocations());
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
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  };

  Root.prototype._loadSelectedLocations = function() {
    var fragment = location.hash.substring(1);
    var keys = (fragment ? this._decodeLocationKeys(fragment) : DEFAULT_LOCATION_KEYS);
    return keys.filter(function(key, index, keys) {
      var isUnique = (keys.indexOf(key) === index);
      return isUnique && Location.isValidKey(key);
    }).reduce(function(ret, key) {
      var location = this._locations.find(function(location) {
        return location.match(key);
      });
      if (location) {
        ret.push(location);
      }
      return ret;
    }.bind(this), []);
  };

  Root.prototype._saveSelectedLocations = function() {
    var keys = this._selectedLocations.map(function(location) {
      return location.key;
    });
    location.replace('#' + this._encodeLocationKeys(keys));
  };

  Root.prototype._encodeLocationKeys = function(keys) {
    return Base64.encodeURI(keys.join(','))
  };

  Root.prototype._decodeLocationKeys = function(s) {
    return Base64.decode(s).split(',');
  };

  Root.prototype._disableTouchScrolling = function() {
    if (!dom.supportsTouch()) {
      return;
    }
    window.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, { passive: false });
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Root;
  } else {
    app.Root = Root;
  }
})(this.app || (this.app = {}));
