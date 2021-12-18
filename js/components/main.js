(function(app) {
  'use strict';

  var Base64 = require('js-base64').Base64;
  var helper = app.helper || require('./helper.js');
  var dom = app.dom || require('./dom.js');
  var Attributes = app.Attributes || require('../base/attributes.js');
  var Button = app.Button || require('./button.js');
  var Collection = app.Collection || require('../base/collection.js');
  var Clock = app.Clock || require('./clock.js');
  var List = app.List || require('./list.js');
  var Location = app.Location || require('../models/location.js');

  var DEFAULT_LOCATION_KEYS = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

  var Main = function(el) {
    this.el = el;
    this._locations = new Collection();
    this._selectedLocations = new Collection();
    this.menuButton = new Button(this.el.querySelector('.menu-button'));
    this.list = new List(document.querySelector('.list'), {
      locations: this._locations,
      selectedLocations: this._selectedLocations,
    });
    this.clock = new Clock(document.querySelector('.clock'), this._hideList.bind(this), { locations: this._selectedLocations });
    this._attrs = new Attributes({ listVisible: false });
  };

  Main.prototype.init = function() {
    window.addEventListener('resize', helper.debounce(this._onresize.bind(this), 100));
    this._disableTouchScrolling();
    this.menuButton.init();
    this.list.init();
    this.clock.init();

    this._selectedLocations.on('reset', this._saveSelectedLocations.bind(this));
    this._selectedLocations.on('add', this._saveSelectedLocations.bind(this));
    this._selectedLocations.on('remove', this._saveSelectedLocations.bind(this));
    this._attrs.on('change:listVisible', this._updateListVisibility.bind(this));
    this.menuButton.on('click', this._toggleList.bind(this));

    this._locations.reset(this._createLocations(Location.PRESET_KEYS));
    this._selectedLocations.reset(this._loadSelectedLocations());
  };

  Main.prototype._createLocations = function(keys) {
    return keys.map(function(key) {
      return new Location(key);
    });
  };

  Main.prototype._toggleList = function() {
    var visible = !this._attrs.get('listVisible');
    this._attrs.set('listVisible', visible);
    this.clock.setDragEnabled(!visible);
  };

  Main.prototype._hideList = function() {
    this._attrs.set('listVisible', false);
    this.clock.setDragEnabled(true);
  };

  Main.prototype._updateListVisibility = function(visible) {
    dom.toggleClass(this.el, 'list-visible', visible);
  };

  Main.prototype._disableTouchScrolling = function() {
    if (!dom.supportsTouch()) {
      return;
    }
    window.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, { passive: false });
  };

  Main.prototype._loadSelectedLocations = function() {
    var fragment = location.hash.substring(1);
    var keys = (fragment ? this._decodeLocationKeys(fragment) : DEFAULT_LOCATION_KEYS);
    return keys.filter(function(key) {
      return Location.isValidKey(key);
    }).reduce(function(ret, key) {
      var location = this._locations.find(function(location) {
        return (location.key === key);
      });
      if (location) {
        ret.push(location);
      }
      return ret;
    }.bind(this), []);
  };

  Main.prototype._saveSelectedLocations = function() {
    var keys = this._selectedLocations.map(function(location) {
      return location.key;
    });
    location.replace('#' + this._encodeLocationKeys(keys));
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
