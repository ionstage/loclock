(function(app) {
  'use strict';

  var Draggable = function(el, props) {
    this.el = el;
    this.onstart = props.onstart;
    this.onmove = props.onmove;
    this.onend = props.onend;
    this.onmousedown = this.onmousedown.bind(this);
    this.onmousemove = this.onmousemove.bind(this);
    this.onmouseup = this.onmouseup.bind(this);
    this.ontouchstart = this.ontouchstart.bind(this);
    this.ontouchmove = this.ontouchmove.bind(this);
    this.ontouchend = this.ontouchend.bind(this);
    this.identifier = null;
    this.startPageX = 0;
    this.startPageY = 0;
  };

  Draggable.supportsTouch = function() {
    return 'ontouchstart' in window || (typeof DocumentTouch !== 'undefined' && document instanceof DocumentTouch);
  };

  Draggable.prototype.enable = function() {
    var type = (Draggable.supportsTouch() ? 'touchstart' : 'mousedown');
    this.el.addEventListener(type, this['on' + type], { passive: false });
  };

  Draggable.prototype.disable = function() {
    var supportsTouch = Draggable.supportsTouch();
    var startType = (supportsTouch ? 'touchstart' : 'mousedown');
    var moveType = (supportsTouch ? 'touchmove' : 'mousemove');
    var endType = (supportsTouch ? 'touchend' : 'mouseup');
    this.el.removeEventListener(startType, this['on' + startType], { passive: false });
    document.removeEventListener(moveType, this['on' + moveType]);
    document.removeEventListener(endType, this['on' + endType]);
  };

  Draggable.prototype.onmousedown = function(event) {
    this.startPageX = event.pageX;
    this.startPageY = event.pageY;
    this.onstart.call(null, event);
    document.addEventListener('mousemove', this.onmousemove);
    document.addEventListener('mouseup', this.onmouseup);
  };

  Draggable.prototype.onmousemove = function(event) {
    var dx = event.pageX - this.startPageX;
    var dy = event.pageY - this.startPageY;
    this.onmove.call(null, dx, dy, event);
  };

  Draggable.prototype.onmouseup = function(event) {
    document.removeEventListener('mousemove', this.onmousemove);
    document.removeEventListener('mouseup', this.onmouseup);
    this.onend.call(null, event);
  };

  Draggable.prototype.ontouchstart = function(event) {
    if (event.touches.length > 1) {
      return;
    }
    var touch = event.changedTouches[0];
    this.identifier = touch.identifier;
    this.startPageX = touch.pageX;
    this.startPageY = touch.pageY;
    this.onstart.call(null, event);
    document.addEventListener('touchmove', this.ontouchmove);
    document.addEventListener('touchend', this.ontouchend);
  };

  Draggable.prototype.ontouchmove = function(event) {
    var touch = event.changedTouches[0];
    if (touch.identifier !== this.identifier) {
      return;
    }
    var dx = touch.pageX - this.startPageX;
    var dy = touch.pageY - this.startPageY;
    this.onmove.call(null, dx, dy, event);
  };

  Draggable.prototype.ontouchend = function(event) {
    var touch = event.changedTouches[0];
    if (touch.identifier !== this.identifier) {
      return;
    }
    document.removeEventListener('touchmove', this.ontouchmove);
    document.removeEventListener('touchend', this.ontouchend);
    this.onend.call(null, event);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Draggable;
  } else {
    app.Draggable = Draggable;
  }
})(this.app || (this.app = {}));
