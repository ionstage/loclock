(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');
  var Attributes = app.Attributes || require('../base/attributes.js');
  var Button = app.Button || require('./button.js');
  var Clock = app.Clock || require('./clock.js');
  var Events = app.Events || require('../base/events.js');
  var List = app.List || require('./list.js');

  var Main = function(el, props) {
    this.el = el;
    this._attrs = new Attributes({
      listVisible: false,
      preferencesVisible: false,
    });
    this._events = new Events();
    this._menuButton = new Button(this.el.querySelector('.menu-button'));
    this._settingsButton = new Button(this.el.querySelector('.settings-button'));
    this._list = new List(this.el.querySelector('.list'), props);
    this._clock = new Clock(this.el.querySelector('.clock'), { locations: props.selectedLocations });
  };

  Main.prototype.init = function() {
    this._menuButton.init();
    this._settingsButton.init();
    this._list.init();
    this._clock.init();

    this._attrs.on('change:listVisible', this._updateListVisibility.bind(this));
    this._attrs.on('change:preferencesVisible', this._updatePreferencesVisibility.bind(this));
    this._menuButton.on('click', this._toggleList.bind(this));
    this._settingsButton.on('click', this._events.emit.bind(this._events, 'click:settingsButton'));
    this._clock.on('pointerdown', this._hideList.bind(this));
  };

  Main.prototype.resize = function() {
    this._clock.resize();
  };

  Main.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  Main.prototype._toggleList = function() {
    var visible = !this._attrs.get('listVisible');
    this._attrs.set('listVisible', visible);
    this._clock.setDragEnabled(!visible);
  };

  Main.prototype._hideList = function() {
    this._attrs.set('listVisible', false);
    this._clock.setDragEnabled(true);
  };

  Main.prototype._updateListVisibility = function(visible) {
    dom.toggleClass(this.el, 'list-visible', visible);
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
