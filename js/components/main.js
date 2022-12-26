(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');
  var Attributes = app.Attributes || require('../base/attributes.js');
  var Button = app.Button || require('./button.js');
  var Clock = app.Clock || require('./clock.js');
  var Events = app.Events || require('../base/events.js');
  var List = app.List || require('./list.js');
  var Preferences = app.Preferences || require('./preferences.js');

  var Main = function(el, props) {
    this.el = el;
    this._themeAttrs = props.themeAttrs;
    this._geonamesData = props.geonamesData;
    this._attrs = new Attributes({
      listVisible: false,
      preferencesVisible: false,
    });
    this._events = new Events();
    this._clockAttrs = new Attributes({ dragEnabled: true });
    this._menuButton = new Button(this.el.querySelector('.menu-button'));
    this._settingsButton = new Button(this.el.querySelector('.settings-button'));
    this._list = new List(this.el.querySelector('.list'), props);
    this._clock = new Clock(this.el.querySelector('.clock'), {
      locations: props.clockLocations,
      attrs: this._clockAttrs,
    });
    this._preferences = new Preferences(this.el.querySelector('.preferences'), props);
  };

  Main.prototype.init = function() {
    this._menuButton.init();
    this._settingsButton.init();
    this._list.init();
    this._clock.init();
    this._preferences.init();

    this._themeAttrs.on('change:value', this._changeTheme.bind(this));
    this._attrs.on('change:listVisible', this._updateListVisibility.bind(this));
    this._attrs.on('change:preferencesVisible', this._updatePreferencesVisibility.bind(this));
    this._menuButton.on('click', this._toggleList.bind(this));
    this._settingsButton.on('click', this._togglePreferences.bind(this));
    this._clock.on('pointerdown', this._hideList.bind(this));
    this._clock.on('pointerdown', this._hidePreferences.bind(this));
    this._preferences.on('hide', this._hidePreferences.bind(this));

    this._changeTheme(this._themeAttrs.get('value'));
  };

  Main.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  Main.prototype.resize = function() {
    this._clock.resize();
  };

  Main.prototype.disableTouchScrolling = function() {
    if (!dom.supportsTouch()) {
      return;
    }
    window.addEventListener('touchmove', function(event) {
      if (event.touches.length === 1) {
        var target = event.changedTouches[0].target;
        while (target) {
          // enable scrolling on preferences
          if (target === this._preferences.el) {
            return;
          }
          target = target.parentElement;
        }
      }
      event.preventDefault();
    }.bind(this), { passive: false });
  };

  Main.prototype._changeTheme = function(value) {
    this.el.setAttribute('data-theme', value);
  };

  Main.prototype._toggleList = function() {
    var visible = !this._attrs.get('listVisible');
    this._attrs.set('listVisible', visible);
    this._clockAttrs.set('dragEnabled', !visible);
  };

  Main.prototype._hideList = function() {
    this._attrs.set('listVisible', false);
    this._clockAttrs.set('dragEnabled', true);
  };

  Main.prototype._updateListVisibility = function(visible) {
    dom.toggleClass(this.el, 'list-visible', visible);
  };

  Main.prototype._togglePreferences = function() {
    var visible = !this._attrs.get('preferencesVisible');
    this._attrs.set('preferencesVisible', visible);
    this._clockAttrs.set('dragEnabled', !visible);
    if (visible) {
      this._geonamesData.load();
    }
  };

  Main.prototype._hidePreferences = function() {
    this._attrs.set('preferencesVisible', false);
    this._clockAttrs.set('dragEnabled', true);
  };

  Main.prototype._updatePreferencesVisibility = function(visible) {
    dom.toggleClass(this.el, 'preferences-visible', visible);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Main;
  } else {
    app.Main = Main;
  }
})(this.app || (this.app = {}));
