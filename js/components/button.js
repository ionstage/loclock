(function(app) {
  'use strict';

  var Events = app.Events || require('../models/events.js');

  var Button = function(el) {
    this.el = el;
    this._events = new Events();
  };

  Button.prototype.init = function() {
    this.el.addEventListener('click', this._onclick.bind(this));
  };

  Button.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  Button.prototype._onclick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    this._events.emit('click');
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Button;
  } else {
    app.Button = Button;
  }
})(this.app || (this.app = {}));
