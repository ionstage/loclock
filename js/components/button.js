(function(app) {
  'use strict';

  var Draggable = app.Draggable || require('./draggable.js');
  var Events = app.Events || require('../base/events.js');

  var Button = function(el) {
    this.el = el;
    this._events = new Events();
    this._draggable = new Draggable(this.el, {
      onstart: this._onstart.bind(this),
      onmove: function() { /* do nothing */ },
      onend: this._onend.bind(this),
    });
    this._dragTarget = null;
  };

  Button.prototype.init = function() {
    this._draggable.enable();
  };

  Button.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  Button.prototype._onstart = function(event) {
    event.preventDefault();
    this._dragTarget = event.target;
    this._events.emit('pointerdown');
  };

  Button.prototype._onend = function(event) {
    if (this._dragTarget === event.target) {
      this._events.emit('click');
    }
    this._dragTarget = null;
    this._events.emit('pointerup');
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Button;
  } else {
    app.Button = Button;
  }
})(this.app || (this.app = {}));
