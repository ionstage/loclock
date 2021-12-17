(function(app) {
  'use strict';

  var Base64 = require('js-base64').Base64;
  var helper = app.helper || require('./helper.js');
  var dom = app.dom || require('./dom.js');
  var Attributes = app.Attributes || require('../models/attributes.js');
  var Button = app.Button || require('./button.js');
  var Collection = app.Collection || require('../models/collection.js');
  var Clock = app.Clock || require('./clock.js');
  var List = app.List || require('./list.js');
  var Location = app.Location || require('../models/location.js');

  var DEFAULT_LOCATION_KEYS = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

  var Main = function(el) {
    this.el = el;
    this._locations = new Collection();
    this.selectedLocations = [];
    this.menuButton = new Button(this.el.querySelector('.menu-button'));
    this.list = new List(document.querySelector('.list'), this._toggleLocation.bind(this), { location: this._locations });
    this.clock = new Clock(document.querySelector('.clock'), this._hideList.bind(this));
    this._attrs = new Attributes({ listVisible: false });
  };

  Main.prototype.init = function() {
    window.addEventListener('resize', helper.debounce(this._onresize.bind(this), 100));
    this._disableTouchScrolling();
    this.menuButton.init();
    this.list.init();
    this.clock.init();

    this._attrs.on('change:listVisible', this._updateListVisibility.bind(this));
    this.menuButton.on('click', this._toggleList.bind(this));

    this._locations.reset(this._createLocations(Location.PRESET_KEYS));
    this._initTimezoneData();
    this._initClockTimer();
    this._initLocations();
  };

  Main.prototype._createLocations = function(keys) {
    return keys.map(function(key) {
      return new Location(key);
    });
  };

  Main.prototype._findLocations = function(keys) {
    return keys.map(function(key) {
      return this._locations.find(function(location) {
        return (location.key === key);
      });
    }.bind(this));
  };

  Main.prototype._updateTimezoneOffset = function(now) {
    this._locations.forEach(function(location) {
      location.updateTimezoneOffset(now);
    });
  };

  Main.prototype._setSelectedLocationKeys = function(keys) {
    location.replace('#' + this._encodeLocationKeys(keys));
    this.selectedLocations = this._findLocations(keys);
    this.list.update(this.selectedLocations);
    this.clock.setLocations(this.selectedLocations);
    this.clock.updatePoint(Date.now());
  };

  Main.prototype._getSelectedLocationKeys = function() {
    return this.selectedLocations.map(function(location) {
      return location.key;
    });
  };

  Main.prototype._toggleList = function() {
    this._attrs.set('listVisible', !this._attrs.get('listVisible'));
  };

  Main.prototype._hideList = function() {
    this._attrs.set('listVisible', false);
  };

  Main.prototype._updateListVisibility = function(visible) {
    if (visible) {
      this.el.classList.add('list-visible');
      this.clock.draggable.disable();
    } else {
      this.el.classList.remove('list-visible');
      this.clock.draggable.enable();
    }
  };

  Main.prototype._disableTouchScrolling = function() {
    if (!dom.supportsTouch()) {
      return;
    }
    window.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, { passive: false });
  };

  Main.prototype._toggleLocation = function(key) {
    if (!Location.isValidKey(key)) {
      return;
    }
    var keys = this._getSelectedLocationKeys();
    var index = keys.indexOf(key);

    if (index !== -1) {
      keys.splice(index, 1);
    } else {
      keys.push(key);
    }

    this._setSelectedLocationKeys(keys);
  };

  Main.prototype._initTimezoneData = function() {
    this._updateTimezoneOffset(Date.now());
  };

  Main.prototype._initClockTimer = function() {
    return setInterval(function() {
      var now = Date.now();
      var minutes = new Date().getMinutes();
      if (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45) {
        this._updateTimezoneOffset(now);
      }
      this.clock.updatePoint(now);
    }.bind(this), 30000);
  };

  Main.prototype._initLocations = function() {
    var fragment = location.hash.substring(1);
    var keys = (fragment ? this._decodeLocationKeys(fragment) : DEFAULT_LOCATION_KEYS);
    var validKeys = keys.filter(function(key) {
      return Location.isValidKey(key);
    });
    this._setSelectedLocationKeys(validKeys);
  };

  Main.prototype._encodeLocationKeys = function(keys) {
    return Base64.encodeURI(keys.join(','))
  };

  Main.prototype._decodeLocationKeys = function(s) {
    return Base64.decode(s).split(',');
  };

  Main.prototype._onresize = function() {
    this.clock.updatePoint(Date.now());
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Main;
  } else {
    app.Main = Main;
  }
})(this.app || (this.app = {}));
