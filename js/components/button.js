(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');
  var Draggable = app.Draggable || require('../draggable.js');
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

  Button.prototype.deinit = function() {
    this._draggable.disable();
  };

  Button.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  Button.prototype.off = function() {
    return Events.prototype.off.apply(this._events, arguments);
  };

  Button.prototype._onstart = function(event) {
    event.preventDefault();
    event.stopPropagation();
    this._dragTarget = event.target;
    dom.toggleClass(this.el, 'active', true);
  };

  Button.prototype._onend = function(event) {
    if (this._dragTarget === event.target) {
      this._events.emit('click');
    }
    this._dragTarget = null;
    dom.toggleClass(this.el, 'active', false);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Button;
  } else {
    app.Button = Button;
  }
})(this.app || (this.app = {}));
