(function(app) {
  'use strict';

  var Button = app.Button || require('./button.js');
  var Events = app.Events || require('../base/events.js');

  var Preferences = function(el) {
    this.el = el;
    this._events = new Events();
    this._closeButton = new Button(this.el.querySelector('.preferences-close-button'));
  };

  Preferences.prototype.init = function() {
    this._closeButton.init();
    this._closeButton.on('click', this._events.emit.bind(this._events, 'close'));
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
