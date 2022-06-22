(function(app) {
  'use strict';

  var Draggable = function(el, props) {
    this.el = el;
    this._onstart = props.onstart;
    this._onmove = props.onmove;
    this._onend = props.onend;
    this._onmousedown = this._onmousedown.bind(this);
    this._onmousemove = this._onmousemove.bind(this);
    this._onmouseup = this._onmouseup.bind(this);
    this._ontouchstart = this._ontouchstart.bind(this);
    this._ontouchmove = this._ontouchmove.bind(this);
    this._ontouchend = this._ontouchend.bind(this);
    this._identifier = null;
    this._startPageX = 0;
    this._startPageY = 0;
  };

  Draggable._supportsTouch = function() {
    return 'ontouchstart' in window || (typeof DocumentTouch !== 'undefined' && document instanceof DocumentTouch);
  };

  Draggable.prototype.enable = function() {
    var type = (Draggable._supportsTouch() ? 'touchstart' : 'mousedown');
    this.el.addEventListener(type, this['_on' + type], { passive: false });
  };

  Draggable.prototype.disable = function() {
    var supportsTouch = Draggable._supportsTouch();
    var startType = (supportsTouch ? 'touchstart' : 'mousedown');
    var moveType = (supportsTouch ? 'touchmove' : 'mousemove');
    var endType = (supportsTouch ? 'touchend' : 'mouseup');
    this.el.removeEventListener(startType, this['_on' + startType], { passive: false });
    document.removeEventListener(moveType, this['_on' + moveType]);
    document.removeEventListener(endType, this['_on' + endType]);
  };

  Draggable.prototype._onmousedown = function(event) {
    this._startPageX = event.pageX;
    this._startPageY = event.pageY;
    this._onstart.call(null, event);
    document.addEventListener('mousemove', this._onmousemove);
    document.addEventListener('mouseup', this._onmouseup);
  };

  Draggable.prototype._onmousemove = function(event) {
    var dx = event.pageX - this._startPageX;
    var dy = event.pageY - this._startPageY;
    this._onmove.call(null, dx, dy, event);
  };

  Draggable.prototype._onmouseup = function(event) {
    document.removeEventListener('mousemove', this._onmousemove);
    document.removeEventListener('mouseup', this._onmouseup);
    this._onend.call(null, event);
  };

  Draggable.prototype._ontouchstart = function(event) {
    if (event.touches.length > 1) {
      return;
    }
    var touch = event.changedTouches[0];
    this._identifier = touch.identifier;
    this._startPageX = touch.pageX;
    this._startPageY = touch.pageY;
    this._onstart.call(null, event);
    document.addEventListener('touchmove', this._ontouchmove);
    document.addEventListener('touchend', this._ontouchend);
  };

  Draggable.prototype._ontouchmove = function(event) {
    var touch = event.changedTouches[0];
    if (touch.identifier !== this._identifier) {
      return;
    }
    var dx = touch.pageX - this._startPageX;
    var dy = touch.pageY - this._startPageY;
    this._onmove.call(null, dx, dy, event);
  };

  Draggable.prototype._ontouchend = function(event) {
    var touch = event.changedTouches[0];
    if (touch.identifier !== this._identifier) {
      return;
    }
    document.removeEventListener('touchmove', this._ontouchmove);
    document.removeEventListener('touchend', this._ontouchend);
    this._onend.call(null, event);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Draggable;
  } else {
    app.Draggable = Draggable;
  }
})(this.app || (this.app = {}));
