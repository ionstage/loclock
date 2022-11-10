(function(app) {
  'use strict';

  var Button = app.Button || require('./button.js');
  var Events = app.Events || require('../base/events.js');
  var GeoNamesInputs = app.GeoNamesInputs || require('./geonames-inputs.js');
  var ThemeInputs = app.ThemeInputs || require('./theme-inputs.js');

  var Preferences = function(el, props) {
    this.el = el;
    this._events = new Events();
    this._hideButton = new Button(this.el.querySelector('.preferences-hide-button'));
    this._themeInputs = new ThemeInputs(this.el.querySelector('.preferences-inputs-theme'), props);
    this._geonamesInputs = new GeoNamesInputs(this.el.querySelector('.preferences-inputs-geonames'), props);
  };

  Preferences.prototype.init = function() {
    this._hideButton.init();
    this._themeInputs.init();
    this._geonamesInputs.init();
    this._hideButton.on('click', this._events.emit.bind(this._events, 'hide'));
  };

  Preferences.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Preferences;
  } else {
    app.Preferences = Preferences;
  }
})(this.app || (this.app = {}));
