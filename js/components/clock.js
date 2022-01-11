(function(app) {
  'use strict';

  var dom = app.dom || require('../dom.js');
  var Draggable = app.Draggable || require('../draggable.js');
  var Attributes = app.Attributes || require('../base/attributes.js');
  var Button = app.Button || require('./button.js');
  var Events = app.Events || require('../base/events.js');

  var Clock = function(el, props) {
    this.el = el;
    this._locations = props.locations;
    this._attrs = new Attributes({ dragEnabled: false });
    this._events = new Events();
    this._cx = this.el.viewBox.baseVal.width / 2;
    this._cy = this.el.viewBox.baseVal.height / 2;
    this._r = Math.min(this._cx, this._cy) * 0.6;
    this._time = Date.now();
    this._timeOffset = 0;
    this._isRightHanded = true;
    this._boardElement = this._createBoard(this._cx, this._cy, this._r);
    this._pointsElement = this._createPoints(this._cx, this._cy, this._r, this._locations, this._time, this._timeOffset);
    this._timeOffsetButton = new Button(this._boardElement.querySelector('.center-time'));
    this._resetButton = new Button(this._boardElement.querySelector('.center-reset'));
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

    this.el.appendChild(this._boardElement);
    this.el.appendChild(this._pointsElement);
    this.el.addEventListener((dom.supportsTouch() ? 'touchstart' : 'mousedown'), this._events.emit.bind(this._events, 'pointerdown'));

    this._attrs.on('change:dragEnabled', this._updateDragEnabled.bind(this));

    this._adjustBoard(this._boardElement);

    this._attrs.set('dragEnabled', true);
    this._locations.on('reset', function(locations) {
      this._time = Date.now();
      locations.forEach(function(location) {
        location.updateTimezoneOffset(this._time);
      }.bind(this));
      this._updatePoints();
    }.bind(this));
    this._locations.on('add', function(location) {
      this._time = Date.now();
      location.updateTimezoneOffset(this._time);
      this._updatePoints();
    }.bind(this));
    this._locations.on('remove', function() {
      this._updatePoints();
    }.bind(this));

    this._timeOffsetButton.on('click', this._toggleTimeOffset.bind(this));
    this._resetButton.on('click', this._reset.bind(this));

    setInterval(function() {
      this._time = Date.now();
      this._locations.forEach(function(location) {
        location.updateTimezoneOffset(this._time);
      }.bind(this));
      this._updatePoints();
    }.bind(this), 30000);
  };

  Clock.prototype.on = function() {
    return Events.prototype.on.apply(this._events, arguments);
  };

  Clock.prototype.resize = function() {
    this._updatePoints();
  };

  Clock.prototype.setDragEnabled = function(dragEnabled) {
    this._attrs.set('dragEnabled', dragEnabled);
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
    this.el.setAttribute('class', (timeOffset || this._isDragging ? 'clock spin' : 'clock'));
  };

  Clock.prototype._globalBBox = function(bb) {
    var stageElement = this.el;
    var lpt = stageElement.createSVGPoint();
    lpt.x = bb.x;
    lpt.y = bb.y;
    var pt0 = lpt.matrixTransform(stageElement.getCTM() || stageElement.getScreenCTM());
    lpt.x = bb.x + bb.width;
    lpt.y = bb.y + bb.height;
    var pt1 = lpt.matrixTransform(stageElement.getCTM() || stageElement.getScreenCTM());
    return {
      x: pt0.x,
      y: pt0.y,
      width: pt1.x - pt0.x,
      height: pt1.y - pt0.y,
    };
  };

  Clock.prototype._createBoard = function(cx, cy, r) {
    var texts = [
      '<svg><g>',
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" stroke-width="' + (r / 30).toFixed(1) + '" class="circle"></circle>',
        '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r / 45).toFixed(1) + '" fill="black" class="center-point"></circle>',
        '<g class="center-spin">',
          '<text x="' + (cx - 11) + '" y="' + (cy - 16) + '" font-size="' + (r / 6) + '" class="text center-time">+00:00</text>',
          '<text x="' + cx + '" y="' + (cy + 32) + '" font-size="' + (r / 10) + '" class="text center-reset">RESET</text>',
        '</g>',
    ];
    var dif = Math.PI / 12;
    var deg = 0;
    for (var i = 0; i < 24; i++) {
      var text = (i % 3 === 0) ? String((i - 6 >= 0) ? i - 6 : i + 18) : '・';
      var fontSize = (text === '・') ? r / 12 : r / 4.5;
      var rate = (text === '18' || text === '15' || text === '21') ? 0.04 : 0;
      var difX = r * (0.8 - Math.abs(rate * Math.cos(deg))) * Math.cos(deg);
      var difY = r * (0.8 - Math.abs(rate * Math.sin(deg))) * Math.sin(deg);
      texts.push('<text x="' + (cx + difX).toFixed(1) + '" y="' + (cy + difY).toFixed(1) + '" font-size="' + fontSize.toFixed() + '" class="text">' + text + '</text>');
      deg += dif;
    }
    texts.push('</g></svg>');
    return dom.render(texts.join('')).childNodes[0];
  };

  Clock.prototype._adjustBoard = function(board) {
    Array.prototype.slice.call(board.childNodes).forEach(function(element) {
      if (element.nodeName !== 'text') {
        return
      }
      var textBBox = element.getBBox();
      var dy = +element.getAttribute('y') - (textBBox.y + textBBox.height / 2);
      element.setAttribute('dy', dy);
    });
  };

  Clock.prototype._createPoints = function(cx, cy, r, locations, time, timeOffset) {
    var points = locations.reduce(function(ret, location) {
      var text = location.name;
      var date = new Date(location.getLocalTime(time));
      var key = date.getTime() % (24 * 60 * 60 * 1000);
      var point = ret[key];
      if (point) {
        point.text +=  ', ' + text;
        return ret;
      }
      ret[key] = {
        text: text,
        deg: (date.getHours() + (date.getMinutes() + timeOffset) / 60) / 24 * (Math.PI * 2) + Math.PI / 2,
      };
      return ret;
    }, {});
    var texts = ['<svg><g>'];
    for (var key in points) {
      var point = points[key];
      var text = point.text;
      var deg = point.deg;
      texts.push('<circle cx="' + (cx + r * Math.cos(deg)).toFixed(1) + '" cy="' + (cy + r * Math.sin(deg)).toFixed(1) + '" r="' + (r / 20).toFixed(1) + '" stroke-width="' + (r / 90).toFixed(1) + '" class="circle"></circle>');
      texts.push('<text x="' + (cx + r * Math.cos(deg)) + '" y="' + (cy + r * Math.sin(deg)) + '" font-size="' + (r / 8).toFixed() + '" class="text" data-deg="' + deg + '">' + text + '</text>');
    }
    texts.push('</g></svg>');
    return dom.render(texts.join('')).childNodes[0];
  };

  Clock.prototype._isBBoxOverlaid = function(bb0, bb1) {
    return ((bb0.x <= bb1.x && bb0.x + bb0.width >= bb1.x) ||
              (bb0.x >= bb1.x && bb1.x + bb1.width >= bb0.x)) &&
            ((bb0.y <= bb1.y && bb0.y + bb0.height >= bb1.y) ||
              (bb0.y >= bb1.y && bb1.y + bb1.height >= bb0.y));
  };

  Clock.prototype._shrinkElement = function(element, width, height) {
    var bb = element.getBBox();
    var gbb = this._globalBBox(bb);
    var pattern = 0;

    if ((gbb.x < 0 && (pattern = 1)) ||
        (gbb.x + gbb.width > width && (pattern = 2)) ||
        (gbb.y < 0 && (pattern = 3)) ||
        (gbb.y + gbb.height > height && (pattern = 4))) {
      element.setAttribute('font-size', +element.getAttribute('font-size') / 1.5);

      var newbb = element.getBBox();
      var value;

      switch (pattern) {
        case 1:
          value = bb.x + bb.width - (newbb.x + newbb.width);
          element.setAttribute('x', +element.getAttribute('x') + value);
          break;
        case 2:
          value = newbb.x - bb.x;
          element.setAttribute('x', +element.getAttribute('x') - value);
          break;
        case 3:
          value = bb.y + bb.height - (newbb.y + newbb.height);
          element.setAttribute('y', +element.getAttribute('y') + value);
          break;
        case 4:
          value = newbb.y - bb.y;
          element.setAttribute('y', +element.getAttribute('y') - value);
          break;
        default:
          break;
      }
    }
  };

  Clock.prototype._adjustPointTexts = function(points, cx, cy, r, width, height) {
    var items = Array.prototype.slice.call(points.childNodes).reduce(function(ret, element) {
      if (element.nodeName !== 'text') {
        return ret;
      }
      var bb = element.getBBox();
      var deg = +element.getAttribute('data-deg');
      var dy = +element.getAttribute('y') - (bb.y + bb.height / 2);
      var sin = Math.sin(deg);
      var cos = Math.cos(deg);
      element.setAttribute('x', cx + (r * 1.125 + bb.width / 2 + (bb.height / 2) * sin * sin) * cos);
      element.setAttribute('y', cy + (r * 1.125 + bb.height / 2 + (bb.width / 8) * cos * cos) * sin);
      element.setAttribute('dy', dy);
      bb = element.getBBox();
      if (bb.y + bb.height / 2 < cy) {
        ret.upper.push([element, bb]);
      } else {
        ret.down.push([element, bb]);
      }
      return ret;
    }, { upper: [], down: [] });

    items.upper.sort(function(a, b) {
      return (a[1].y < b[1].y) ? -1 : 1;
    }).forEach(function(item, i, array) {
      var el = item[0];
      var bb0 = item[1];
      for (var j = i + 1, len = array.length; j < len; j++) {
        var bb1 = array[j][1];
        if (!this._isBBoxOverlaid(bb0, bb1)) {
          continue;
        }
        var dy = +el.getAttribute('dy') - ((bb0.y + bb0.height) - bb1.y);
        el.setAttribute('dy', dy);
      }
      this._shrinkElement(el, width, height);
    }.bind(this));

    items.down.sort(function(a, b) {
      return (a[1].y > b[1].y) ? -1 : 1;
    }).forEach(function(item, i, array) {
      var el = item[0];
      var bb0 = item[1];
      for (var j = i + 1, len = array.length; j < len; j++) {
        var bb1 = array[j][1];
        if (!this._isBBoxOverlaid(bb0, bb1)) {
          continue;
        }
        var dy = +el.getAttribute('dy') + ((bb1.y + bb1.height) - bb0.y);
        el.setAttribute('dy', dy);
      }
      this._shrinkElement(el, width, height);
    }.bind(this));
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
