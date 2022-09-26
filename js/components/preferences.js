(function(app) {
  'use strict';

  var Button = app.Button || require('./button.js');
  var Events = app.Events || require('../base/events.js');

  var Preferences = function(el, props) {
    this.el = el;
    this._theme = props.theme;
    this._events = new Events();
    this._hideButton = new Button(this.el.querySelector('.preferences-hide-button'));
    this._themeFieldsetElement = this.el.querySelector('.preferences-fieldset-theme');
  };

  Preferences.prototype.init = function() {
    this._hideButton.init();
    this._themeFieldsetElement.addEventListener('change', this._changeTheme.bind(this));
    this._theme.on('change:value', this._updateTheme.bind(this));
    this._hideButton.on('click', this._events.emit.bind(this._events, 'hide'));
  };

  Preferences.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  Preferences.prototype._changeTheme = function() {
    var el = this._themeFieldsetElement.querySelector('input:checked');
    this._theme.set('value', el.value);
  };

  Preferences.prototype._updateTheme = function(value) {
    var el = this._themeFieldsetElement.querySelector('input[value=\'' + value + '\']');
    el.checked = true;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Preferences;
  } else {
    app.Preferences = Preferences;
  }
})(this.app || (this.app = {}));
