(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');
  var Draggable = app.Draggable || require('../draggable.js');
  var Button = app.Button || require('./button.js');
  var Events = app.Events || require('../base/events.js');

  var Clock = function(el, props) {
    this.el = el;
    this._locations = props.locations;
    this._attrs = props.attrs;
    this._events = new Events();
    this._cx = this.el.viewBox.baseVal.width / 2;
    this._cy = this.el.viewBox.baseVal.height / 2;
    this._r = Math.min(this._cx, this._cy) * 0.6;
    this._time = Date.now();
    this._timeOffset = 0;
    this._isRightHanded = true;
    this._boardElement = this._createBoard(this._cx, this._cy, this._r);
    this._centerElement = this._createCenter(this._cx, this._cy, this._r);
    this._pointsElement = this._createPoints(this._cx, this._cy, this._r, this._locations, this._time, this._timeOffset);
    this._timeOffsetButton = new Button(this._centerElement.querySelector('.clock-time-offset-button'));
    this._resetButton = new Button(this._centerElement.querySelector('.clock-reset-button'));
    this._draggable = new Draggable(this.el, {
      onstart: this._dragstart.bind(this),
      onmove: this._dragmove.bind(this),
      onend: this._dragend.bind(this),
    });
    this._dragStartX = 0;
    this._dragStartY = 0;
    this._dragStartTimeOffset = 0;
    this._isDragging = false;
  };

  Clock.prototype.init = function() {
    this._timeOffsetButton.init();
    this._resetButton.init();

    this.el.addEventListener((dom.supportsTouch() ? 'touchstart' : 'mousedown'), this._events.emit.bind(this._events, 'pointerdown'));

    this._attrs.on('change:dragEnabled', this._updateDragEnabled.bind(this));
    this._locations.on('reset', this._resetLocations.bind(this));
    this._locations.on('add', this._addLocation.bind(this));
    this._locations.on('remove', this._removeLocation.bind(this));
    this._timeOffsetButton.on('click', this._toggleTimeOffset.bind(this));
    this._resetButton.on('click', this._reset.bind(this));

    setInterval(this._updateTime.bind(this), 30000);

    this.el.appendChild(this._boardElement);
    this._adjustBoard(this._boardElement);
    this.el.appendChild(this._centerElement);
    this._adjustCenter(this._centerElement);
    this.el.appendChild(this._pointsElement);

    this._updateDragEnabled(this._attrs.get('dragEnabled'));
  };

  Clock.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  Clock.prototype.resize = function() {
    this._updatePoints();
  };

  Clock.prototype._updateDragEnabled = function(dragEnabled) {
    if (dragEnabled) {
      this._draggable.enable();
    } else {
      this._draggable.disable();
    }
  };

  Clock.prototype._updatePoints = function() {
    var points = this._createPoints(this._cx, this._cy, this._r, this._locations, this._time, this._timeOffset);
    this.el.replaceChild(points, this._pointsElement);
    this._adjustPointTexts(points, this._cx, this._cy, this._r, window.innerWidth, window.innerHeight);
    this._pointsElement = points;
  };

  Clock.prototype._updateCenter = function() {
    var timeOffset = this._timeOffset;
    var h = ('00' + Math.abs((timeOffset - timeOffset % 60) / 60)).slice(-2);
    var m = ('00' + Math.abs(timeOffset % 60)).slice(-2);
    var text = (timeOffset >= 0 ? '+' : '-') + h + ':' + m;
    this._timeOffsetButton.el.textContent = text;
    dom.toggleClass(this.el, 'rotating', timeOffset || this._isDragging);
  };

  Clock.prototype._globalBBox = function(bb) {
    var p = this.el.createSVGPoint();
    p.x = bb.x;
    p.y = bb.y;
    var p0 = p.matrixTransform(this.el.getCTM() || this.el.getScreenCTM());
    p.x = bb.x + bb.width;
    p.y = bb.y + bb.height;
    var p1 = p.matrixTransform(this.el.getCTM() || this.el.getScreenCTM());
    return {
      x: p0.x,
      y: p0.y,
      width: p1.x - p0.x,
      height: p1.y - p0.y,
    };
  };

  Clock.prototype._createBoard = function(cx, cy, r) {
    var texts = [
      '<svg><g class="clock-component">',
        '<circle class="clock-bezel" cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-width="' + (r / 30).toFixed(1) + '"></circle>',
    ];
    var dif = Math.PI / 12;
    var deg = 0;
    for (var i = 0; i < 24; i++) {
      var text = (i % 3 === 0) ? String((i - 6 >= 0) ? i - 6 : i + 18) : '・';
      var fontSize = (text === '・') ? r / 12 : r / 4.5;
      var rate = (text === '18' || text === '15' || text === '21') ? 0.04 : 0;
      var dx = r * (0.8 - Math.abs(rate * Math.cos(deg))) * Math.cos(deg);
      var dy = r * (0.8 - Math.abs(rate * Math.sin(deg))) * Math.sin(deg);
      texts.push('<text class="clock-dial-text" x="' + (cx + dx).toFixed(1) + '" y="' + (cy + dy).toFixed(1) + '" font-size="' + fontSize.toFixed() + '">' + text + '</text>');
      deg += dif;
    }
    texts.push('</g></svg>');
    return dom.render(texts.join('')).childNodes[0];
  };

  Clock.prototype._adjustBoard = function(board) {
    Array.prototype.slice.call(board.childNodes).forEach(function(el) {
      if (el.nodeName !== 'text') {
        return
      }
      var bb = el.getBBox();
      var dy = +el.getAttribute('y') - (bb.y + bb.height / 2);
      el.setAttribute('dy', dy.toFixed(1));
    });
  };

  Clock.prototype._createCenter = function(cx, cy, r) {
    var texts = [
      '<svg><g class="clock-component">',
        '<circle class="clock-center-point" cx="' + cx + '" cy="' + cy + '" r="' + (r / 45).toFixed(1) + '"></circle>',
        '<g class="clock-button-container">',
          '<text class="clock-button clock-time-offset-button" x="' + (cx - 11) + '" y="' + (cy - 16) + '" font-size="' + (r / 6) + '">+00:00</text>',
          '<text class="clock-button clock-reset-button" x="' + cx + '" y="' + (cy + 32) + '" font-size="' + (r / 10) + '">RESET</text>',
        '</g>',
      '</g></svg>',
    ];
    return dom.render(texts.join('')).childNodes[0];
  };

  Clock.prototype._adjustCenter = function(center) {
    var buttons = center.querySelectorAll('.clock-button');
    Array.prototype.slice.call(buttons).forEach(function(el) {
      var bb = el.getBBox();
      var dy = +el.getAttribute('y') - (bb.y + bb.height / 2);
      el.setAttribute('dy', dy.toFixed(1));
    });
  };

  Clock.prototype._createPoints = function(cx, cy, r, locations, time, timeOffset) {
    var points = locations.reduce(function(points, location) {
      var text = location.name;
      var date = new Date(location.getLocalTime(time));
      var key = date.getTime() % (24 * 60 * 60 * 1000);
      var point = points[key];
      if (point) {
        point.text +=  ', ' + text;
        return points;
      }
      points[key] = {
        text: text,
        deg: (date.getHours() + (date.getMinutes() + timeOffset) / 60) / 24 * (Math.PI * 2) + Math.PI / 2,
      };
      return points;
    }, {});
    var texts = ['<svg><g class="clock-component">'];
    for (var key in points) {
      var point = points[key];
      var text = point.text;
      var deg = point.deg;
      texts.push('<circle class="clock-point-circle" cx="' + (cx + r * Math.cos(deg)).toFixed(1) + '" cy="' + (cy + r * Math.sin(deg)).toFixed(1) + '" r="' + (r / 20).toFixed(1) + '" stroke-width="' + (r / 90).toFixed(1) + '"></circle>');
      texts.push('<text class="clock-point-text" x="' + (cx + r * Math.cos(deg)).toFixed(1) + '" y="' + (cy + r * Math.sin(deg)).toFixed(1) + '" font-size="' + (r / 8).toFixed() + '" data-deg="' + deg + '">' + text + '</text>');
    }
    texts.push('</g></svg>');
    return dom.render(texts.join('')).childNodes[0];
  };

  Clock.prototype._hasIntersect = function(a, b) {
    return (a.x + a.width >= b.x) && (b.x + b.width >= a.x) && (a.y + a.height >= b.y) && (b.y + b.height >= a.y);
  };

  Clock.prototype._shrinkElement = function(el, width, height) {
    var bb = el.getBBox();
    var gbb = this._globalBBox(bb);
    var c = 0;
    if ((gbb.x < 0 && (c = 1)) ||
        (gbb.x + gbb.width > width && (c = 2)) ||
        (gbb.y < 0 && (c = 3)) ||
        (gbb.y + gbb.height > height && (c = 4))) {
      el.setAttribute('font-size', +el.getAttribute('font-size') / 1.5);
      var newbb = el.getBBox();
      var value;
      switch (c) {
        case 1:
          value = bb.x + bb.width - (newbb.x + newbb.width);
          el.setAttribute('x', (+el.getAttribute('x') + value).toFixed(1));
          break;
        case 2:
          value = newbb.x - bb.x;
          el.setAttribute('x', (+el.getAttribute('x') - value).toFixed(1));
          break;
        case 3:
          value = bb.y + bb.height - (newbb.y + newbb.height);
          el.setAttribute('y', (+el.getAttribute('y') + value).toFixed(1));
          break;
        case 4:
          value = newbb.y - bb.y;
          el.setAttribute('y', (+el.getAttribute('y') - value).toFixed(1));
          break;
        default:
          break;
      }
    }
  };

  Clock.prototype._adjustPointTexts = function(points, cx, cy, r, width, height) {
    var items = Array.prototype.slice.call(points.childNodes).reduce(function(items, el) {
      if (el.nodeName !== 'text') {
        return items;
      }
      var bb = el.getBBox();
      var deg = +el.getAttribute('data-deg');
      var dy = +el.getAttribute('y') - (bb.y + bb.height / 2);
      var sin = Math.sin(deg);
      var cos = Math.cos(deg);
      var x = cx + (r * 1.125 + bb.width / 2 + (bb.height / 2) * sin * sin) * cos;
      var y = cy + (r * 1.125 + bb.height / 2 + (bb.width / 8) * cos * cos) * sin;
      el.setAttribute('x', x.toFixed(1));
      el.setAttribute('y', y.toFixed(1));
      el.setAttribute('dy', dy.toFixed(1));
      this._shrinkElement(el, width, height);
      bb = el.getBBox();
      var array = (bb.y + bb.height / 2 < cy ? items.upper : items.down);
      array.push({ el: el, bb: bb });
      return items;
    }.bind(this), { upper: [], down: [] });

    items.upper.sort(function(a, b) {
      return b.bb.y - a.bb.y;
    }).forEach(function(item, i, array) {
      var bb0 = item.bb;
      for (var j = i + 1, len = array.length; j < len; j++) {
        var bb1 = array[j].bb;
        if (this._hasIntersect(bb0, bb1)) {
          var el = array[j].el;
          var dy = +el.getAttribute('dy') - ((bb1.y + bb1.height) - bb0.y);
          el.setAttribute('dy', dy.toFixed(1));
          array[j].bb = el.getBBox();
        }
      }
    }.bind(this));

    items.down.sort(function(a, b) {
      return a.bb.y - b.bb.y;
    }).forEach(function(item, i, array) {
      var bb0 = item.bb;
      for (var j = i + 1, len = array.length; j < len; j++) {
        var bb1 = array[j].bb;
        if (this._hasIntersect(bb0, bb1)) {
          var el = array[j].el;
          var dy = +el.getAttribute('dy') + ((bb0.y + bb0.height) - bb1.y);
          el.setAttribute('dy', dy.toFixed(1));
          array[j].bb = el.getBBox();
        }
      }
    }.bind(this));
  };

  Clock.prototype._resetLocations = function(locations) {
    locations.forEach(function(location) {
      location.updateTimezoneOffset(this._time);
    }.bind(this));
    this._updatePoints();
  };

  Clock.prototype._addLocation = function(location) {
    location.updateTimezoneOffset(this._time);
    this._updatePoints();
  };

  Clock.prototype._removeLocation = function() {
    this._updatePoints();
  };

  Clock.prototype._toggleTimeOffset = function() {
    this._timeOffset = (this._timeOffset + (this._timeOffset >= 0 ? -1 : 1) * 1440) % 1440;
    this._isRightHanded = (this._timeOffset >= 0);
    this._updateCenter();
  };

  Clock.prototype._reset = function() {
    var offset = this._timeOffset;
    if (!offset) {
      return;
    }
    var dt = (offset >= 0 ? -1 : 1) * Math.ceil(Math.ceil(Math.abs(offset / 6)) / 10) * 10;
    var callback = function() {
      if (dt && Math.abs(this._timeOffset) > Math.abs(dt)) {
        this._timeOffset += dt;
        requestAnimationFrame(callback);
      } else {
        this._timeOffset = 0;
        this._draggable.enable();
      }
      this._updatePoints();
      this._updateCenter();
    }.bind(this);
    this._draggable.disable();
    requestAnimationFrame(callback);
  };

  Clock.prototype._updateTime = function() {
    this._time = Date.now();
    this._locations.forEach(function(location) {
      location.updateTimezoneOffset(this._time);
    }.bind(this));
    this._updatePoints();
  };

  Clock.prototype._dragstart = function(event) {
    event.preventDefault();
    var supportsTouch = dom.supportsTouch();
    this._dragStartX = (supportsTouch ? event.changedTouches[0].clientX : event.clientX);
    this._dragStartY = (supportsTouch ? event.changedTouches[0].clientY : event.clientY);
    this._dragStartTimeOffset = this._timeOffset;
    this._isDragging = true;
    this._updateCenter();
  };

  Clock.prototype._dragmove = function(dx, dy) {
    var rect = this.el.getBoundingClientRect();
    var cx = rect.width / 2;
    var cy = rect.height / 2;
    var x1 = this._dragStartX + dx;
    var y1 = this._dragStartY + dy;
    var a1 = this._dragStartX - cx;
    var a2 = this._dragStartY - cy;
    var b1 = x1 - cx;
    var b2 = y1 - cy;
    var cos = (a1 * b1 + a2 * b2) / (Math.sqrt(a1 * a1 + a2 * a2) * Math.sqrt(b1 * b1 + b2 * b2));
    var acos = Math.acos(cos) || 0;
    var offset = acos / Math.PI * 12 * 60;
    var direction = (a1 * b2 - b1 * a2 >= 0 ? 1 : -1);
    var timeOffset = this._dragStartTimeOffset + direction * Math.round(offset / 10) * 10;
    timeOffset = timeOffset % 1440;

    /* -720 < timeOffset <= 720 */
    if (timeOffset > 720) {
      timeOffset -= 1440;
    } else if (timeOffset <= -720) {
      timeOffset += 1440;
    }

    /* determine rotation direction */
    if (this._timeOffset <= 0 && this._timeOffset > -360 && timeOffset > 0 && timeOffset < 360) {
      this._isRightHanded = true;
    } else if (this._timeOffset >= 0 && this._timeOffset < 360 && timeOffset < 0 && timeOffset > -360) {
      this._isRightHanded = false;
    }

    /* -1440 < timeOffset <= 0 or 0 <= timeOffset < 1440 */
    if (this._isRightHanded && timeOffset < 0) {
      timeOffset += 1440;
    } else if (!this._isRightHanded && timeOffset > 0) {
      timeOffset -= 1440;
    }

    if (timeOffset === this._timeOffset) {
      return;
    }

    this._timeOffset = timeOffset;
    this._updatePoints();
    this._updateCenter();
  };

  Clock.prototype._dragend = function() {
    this._isDragging = false;
    this._updateCenter();
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Clock;
  } else {
    app.Clock = Clock;
  }
})(this.app || (this.app = {}));
