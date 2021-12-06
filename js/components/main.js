(function(app) {
  'use strict';

  var Base64 = require('js-base64').Base64;
  var helper = app.helper || require('./helper.js');
  var dom = app.dom || require('./dom.js');
  var Button = app.Button || require('./button.js');
  var Clock = app.Clock || require('./clock.js');
  var List = app.List || require('./list.js');
  var Location = app.Location || require('../models/location.js');

  var DEFAULT_LOCATION_KEYS = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

  var Main = function(el) {
    this.el = el;
    this.locations = this._createLocations(Location.PRESET_KEYS);
    this.menuButton = new Button(this.el.querySelector('.menu-button'), this._toggleList.bind(this));
    this.list = new List(document.querySelector('.list'), this._toggleLocation.bind(this));
    this.clock = new Clock(document.querySelector('.clock'), this._closeList.bind(this));
    this.selectedLocations = [];
    this.isOpen = false;
  };

  Main.prototype.init = function() {
    window.addEventListener('resize', helper.debounce(this._onresize.bind(this), 100));
    this._disableTouchScrolling();
    this.menuButton.init();

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
      return helper.find(this.locations, function(location) {
        return (location.key === key);
      });
    }.bind(this));
  };

  Main.prototype._updateTimezoneOffset = function(now) {
    this.locations.forEach(function(location) {
      location.updateTimezoneOffset(now);
    });
  };

  Main.prototype._setSelectedKeys = function(keys) {
    keys = keys.filter(function(key) {
      return Location.isValidKey(key);
    });
    location.replace('#' + this._encodeLocationKeys(keys));
    this._selectTimezone(keys);
  };

  Main.prototype._getSelectedKeys = function() {
    return this.selectedLocations.map(function(location) {
      return location.key;
    });
  };

  Main.prototype._toggleList = function() {
    if (this.isOpen) {
      this._closeList();
    } else {
      this._openList();
    }
  };

  Main.prototype._openList = function() {
    if (this.isOpen) {
      return;
    }
    this.el.classList.add('open');
    this.clock.draggable.disable();
    this.isOpen = true;
  };

  Main.prototype._closeList = function() {
    if (!this.isOpen) {
      return;
    }
    this.el.classList.remove('open');
    this.clock.draggable.enable();
    this.isOpen = false;
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
    var keys = this._getSelectedKeys();
    var index = keys.indexOf(key);

    if (index !== -1) {
      keys.splice(index, 1);
    } else {
      keys.push(key);
    }

    this._setSelectedKeys(keys);
  };

  Main.prototype._initTimezoneData = function() {
    this._updateTimezoneOffset(Date.now());
    this.list.setList(this.locations);
    this.list.update(this.selectedLocations);
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
    this._setSelectedKeys(keys);
  };

  Main.prototype._updateTimezoneList = function() {
    this._initTimezoneData();
    this._setSelectedKeys(this._getSelectedKeys());
  };

  Main.prototype._encodeLocationKeys = function(keys) {
    return Base64.encodeURI(keys.join(','))
  };

  Main.prototype._decodeLocationKeys = function(s) {
    return Base64.decode(s).split(',');
  };

  Main.prototype._selectTimezone = function(keys) {
    this.selectedLocations = this._findLocations(keys);
    this.list.update(this.selectedLocations);
    this.clock.setLocations(this.selectedLocations);
    this.clock.updatePoint(Date.now());
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
