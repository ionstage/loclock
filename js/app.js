(function(app) {
  'use strict';

  var IScroll = require('iscroll');
  var Base64 = require('js-base64').Base64;
  var helper = app.helper || require('./helper.js');
  var dom = app.dom || require('./dom.js');
  var Draggable = app.Draggable || require('./draggable.js');
  var Location = app.Location || require('./location.js');
  var LocationList = app.LocationList || require('./location-list.js');

  var NS_SVG = 'http://www.w3.org/2000/svg';
  var DEFAULT_LOCATION_KEYS = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

  var dialSpinner = {
    init: function(clockElement, props) {
      this.timeOffset = 0;
      this.isRightHanded = true;
      this.clockElement = clockElement;
      this.centerTimeElement = clockElement.querySelector('.center-time');
      this.centerResetElement = clockElement.querySelector('.center-reset');
      this.ontimeoffsetinvert = props.ontimeoffsetinvert;
      this.ontimeoffsetupdate = props.ontimeoffsetupdate;
      this.onresetstart = props.onresetstart;
      this.onresetend = props.onresetend;
      this.ondragstart = props.ondragstart;
      this.ondragend = props.ondragend;
    },
    toggleTimeOffset: function() {
      this.timeOffset = (this.timeOffset + (this.timeOffset >= 0 ? -1 : 1) * 1440) % 1440;
      this.isRightHanded = (this.timeOffset >= 0);
      this.ontimeoffsetinvert(this.timeOffset);
    },
    reset: function() {
      var offset = this.timeOffset;
      if (!offset) {
        return;
      }
      var dt = (offset >= 0 ? -1 : 1) * Math.ceil(Math.ceil(Math.abs(offset / 6)) / 10) * 10;
      var callback = function() {
        if (dt && Math.abs(this.timeOffset) > Math.abs(dt)) {
          this.timeOffset += dt;
          requestAnimationFrame(callback);
        } else {
          this.timeOffset = 0;
          this.onresetend();
        }
        this.ontimeoffsetupdate(this.timeOffset);
      }.bind(this);
      this.onresetstart();
      requestAnimationFrame(callback);
    },
    dragstart: function(event) {
      event.preventDefault();
      this.startClassName = event.target.getAttribute('class') || '';
      if (this.startClassName.indexOf('center-time') !== -1) {
        this.isDragCanceled = true;
        this.centerTimeElement.setAttribute('fill', 'lightgray');
        return;
      }
      if (this.startClassName.indexOf('center-reset') !== -1) {
        this.isDragCanceled = true;
        this.centerResetElement.setAttribute('fill', 'lightgray');
        return;
      }
      this.isDragCanceled = false;
      this.x0 = (event.touches ? event.changedTouches[0].clientX : event.clientX);
      this.y0 = (event.touches ? event.changedTouches[0].clientY : event.clientY);
      this.startTimeOffset = this.timeOffset;
      this.ondragstart();
    },
    dragmove: function(dx, dy) {
      if (this.isDragCanceled) {
        return;
      }

      var rect = this.clockElement.getBoundingClientRect();
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var x1 = this.x0 + dx;
      var y1 = this.y0 + dy;
      var a1 = this.x0 - cx;
      var a2 = this.y0 - cy;
      var b1 = x1 - cx;
      var b2 = y1 - cy;
      var cos = (a1 * b1 + a2 * b2) / (Math.sqrt(a1 * a1 + a2 * a2) * Math.sqrt(b1 * b1 + b2 * b2));
      var acos = Math.acos(cos) || 0;
      var offset = acos / Math.PI * 12 * 60;
      var direction = (a1 * b2 - b1 * a2 >= 0 ? 1 : -1);
      var timeOffset = this.startTimeOffset + direction * Math.round(offset / 10) * 10;
      timeOffset = timeOffset % 1440;

      /* -720 < timeOffset <= 720 */
      if (timeOffset > 720) {
        timeOffset -= 1440;
      } else if (timeOffset <= -720) {
        timeOffset += 1440;
      }

      /* determine rotation direction */
      if (this.timeOffset <= 0 && this.timeOffset > -360 && timeOffset > 0 && timeOffset < 360) {
        this.isRightHanded = true;
      } else if (this.timeOffset >= 0 && this.timeOffset < 360 && timeOffset < 0 && timeOffset > -360) {
        this.isRightHanded = false;
      }

      /* -1440 < timeOffset <= 0 or 0 <= timeOffset < 1440 */
      if (this.isRightHanded && timeOffset < 0) {
        timeOffset += 1440;
      } else if (!this.isRightHanded && timeOffset > 0) {
        timeOffset -= 1440;
      }

      if (timeOffset === this.timeOffset) {
        return;
      }

      this.timeOffset = timeOffset;
      this.ontimeoffsetupdate(this.timeOffset);
    },
    dragend: function(event) {
      var target = event.target;
      if (dom.supportsTouch()) {
        var x = (event.touches ? event.changedTouches[0].clientX : event.clientX);
        var y = (event.touches ? event.changedTouches[0].clientY : event.clientY);
        target = document.elementFromPoint(x, y);
      }
      var className = target.getAttribute('class') || '';
      if (this.startClassName === className) {
        if (className.indexOf('center-time') !== -1) {
          this.toggleTimeOffset();
        } else if (className.indexOf('center-reset') !== -1) {
          this.reset();
        }
      }
      if (this.isDragCanceled) {
        this.centerTimeElement.setAttribute('fill', 'gray');
        this.centerResetElement.setAttribute('fill', 'gray');
      }
      this.ondragend();
    },
  };

  var list = {
    init: function(element, ontoggle) {
      this.items = {};
      this.currentSelectedItems = [];
      this.element = element;
      this.scrolling = false;
      this.clickable = true;
      this.ontoggle = ontoggle;

      element.parentNode.addEventListener('click', function(event) {
        event.preventDefault();
        if (this.scrolling || !this.clickable) {
          this.scrolling = false;
          this.clickable = true;
          return;
        }
        this.onclick(event);
      }.bind(this));

      element.parentNode.addEventListener('touchstart', function() {
        this.clickable = !this.scrolling;
      }.bind(this));

      if (dom.supportsTouch()) {
        element.parentNode.setAttribute('class', 'unscrollable');
      }
    },
    setList: function(locations) {
      var element = document.createElement('div');
      var listItems = [];
      var needsCurrentLocation = false;

      locations.forEach(function(location) {
        var key = location.key;
        if (key === Location.KEY_CURRENT_LOCATION) {
          needsCurrentLocation = true;
          return;
        }
        var name = location.name;
        listItems.push([key, name]);
      });

      listItems.sort(function(a, b) {
        return (a[1] < b[1]) ? -1 : 1;
      });

      if (needsCurrentLocation) {
        listItems.unshift([Location.KEY_CURRENT_LOCATION, 'Current Location']);
      }

      listItems.forEach(function(listitem) {
        var item = document.createElement('div');
        var key = listitem[0];
        item.setAttribute('data-key', key);
        item.setAttribute('class', 'list-item');
        var textLength = listitem[1].length;
        if (textLength >= 20) {
          item.style.fontSize = '11px';
        } else if (textLength >= 17) {
          item.style.fontSize = '14px';
        }
        item.innerHTML = listitem[1];
        element.appendChild(item);
        this.items[key] = item;
      }.bind(this));

      this.element.parentNode.replaceChild(element, this.element);
      this.element = element;

      if (dom.supportsTouch()) {
        if (this.scroll) {
          this.scroll.destroy();
          this.scroll = null;
        }

        this.scroll = new IScroll(element.parentNode, {
          click: true,
          scrollbars: true,
          shrinkScrollbars: 'scale',
          fadeScrollbars: true,
        });

        this.scroll.on('scrollStart', function() {
          this.scrolling = true;
        }.bind(this));

        this.scroll.on('scrollEnd', function() {
          this.scrolling = false;
        }.bind(this));
      }
    },
    update: function(selectedLocations) {
      if (this.currentSelectedItems.length > selectedLocations.length) {
        this.currentSelectedItems.forEach(function(item) {
          item.setAttribute('class', 'list-item');
        });
      }

      this.currentSelectedItems = selectedLocations.map(function(location) {
        var item = this.items[location.key];
        item.setAttribute('class', 'list-item list-selected');
        return item;
      }.bind(this));
    },
    onclick: function(event) {
      var key = event.target.getAttribute('data-key');
      this.ontoggle(key);
    },
  };

  var clock = {
    init: function(element, onpointerdown) {
      var width = 720, height = 720;
      this.element = element;
      this.boardElement = document.createElementNS(NS_SVG, 'g');
      this.pointElement = document.createElementNS(NS_SVG, 'g');
      this.element.appendChild(this.boardElement);
      this.element.appendChild(this.pointElement);
      this.x = width / 2;
      this.y = height / 2;
      this.r = Math.min(width, height) / 2 * 0.6;
      this.draggable = new Draggable({
        element: element,
        onstart: dialSpinner.dragstart.bind(dialSpinner),
        onmove: dialSpinner.dragmove.bind(dialSpinner),
        onend: dialSpinner.dragend.bind(dialSpinner),
      });
      this.locations = [];
      this.timeOffset = 0;
      this.isDragging = false;

      this.draggable.enable();
      element.addEventListener((dom.supportsTouch() ? 'touchstart' : 'mousedown'), onpointerdown);

      this.updateBoard();

      dialSpinner.init(this.element, {
        ontimeoffsetinvert: function(timeOffset) {
          this.setTimeoffset(timeOffset);
          this.updateCenter();
        }.bind(this),
        ontimeoffsetupdate: function(timeOffset) {
          this.setTimeoffset(timeOffset);
          this.updatePoint(Date.now());
          this.updateCenter();
        }.bind(this),
        onresetstart: function() {
          this.draggable.disable();
        }.bind(this),
        onresetend: function() {
          this.draggable.enable();
        }.bind(this),
        ondragstart: function() {
          this.isDragging = true;
          this.updateCenter();
        }.bind(this),
        ondragend: function() {
          this.isDragging = false;
          this.updateCenter();
        }.bind(this),
      });
    },
    setLocations: function(locations) {
      this.locations = locations;
    },
    setTimeoffset: function(offset) {
      this.timeOffset = offset;
    },
    updateBoard: function() {
      var newBoard = this.createBoard(this.x, this.y, this.r);
      this.element.replaceChild(newBoard, this.boardElement);
      this.adjustBoard(newBoard);
      this.boardElement = newBoard;
      this.centerTimeElement = this.boardElement.querySelector('.center-time');
    },
    updatePoint: function(now) {
      var newPoint = this.createPoint(this.x, this.y, this.r, this.locations, now, this.timeOffset);
      this.element.replaceChild(newPoint, this.pointElement);
      this.adjustPointText(newPoint, this.x, this.y, this.r, window.innerWidth, window.innerHeight);
      this.pointElement = newPoint;
    },
    updateCenter: function() {
      var timeOffset = this.timeOffset;
      var h = ('00' + Math.abs((timeOffset - timeOffset % 60) / 60)).slice(-2);
      var m = ('00' + Math.abs(timeOffset % 60)).slice(-2);
      var text = (timeOffset >= 0 ? '+' : '-') + h + ':' + m;
      this.centerTimeElement.textContent = text;
      this.element.setAttribute('class', (timeOffset || this.isDragging ? 'clock spin' : 'clock'));
    },
    globalBBox: function(bb) {
      var stageElement = this.element;
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
    },
    createCircle: function(o) {
      var element = document.createElementNS(NS_SVG, 'circle');
      for (var key in o) {
        element.setAttribute(key, o[key]);
      }
      return element;
    },
    createText: function(text, o) {
      var element = document.createElementNS(NS_SVG, 'text');
      element.appendChild(document.createTextNode(text));
      for (var key in o) {
        element.setAttribute(key, o[key]);
      }
      return element;
    },
    createBoard: function(x, y, r) {
      var board = document.createElementNS(NS_SVG, 'g');

      board.appendChild(this.createCircle({
        cx: x,
        cy: y,
        r: r,
        'stroke-width': (r / 30).toFixed(1),
        'class': 'circle',
      }));

      board.appendChild(this.createCircle({
        cx: x,
        cy: y,
        r: (r / 45).toFixed(1),
        fill: 'black',
        'class': 'center-point',
      }));

      var centerSpin = document.createElementNS(NS_SVG, 'g');
      centerSpin.setAttribute('class', 'center-spin');

      centerSpin.appendChild(this.createText('+00:00', {
        x: x - 11,
        y: y - 16,
        'font-size': r / 6,
        'class': 'text center-time',
      }));

      centerSpin.appendChild(this.createText('RESET', {
        x: x,
        y: y + 32,
        'font-size': r / 10,
        'class': 'text center-reset',
      }));

      board.appendChild(centerSpin);

      var dif = Math.PI / 12;
      var deg = 0;

      for (var i = 0; i < 24; i++) {
        var text = (i % 3 === 0) ? String((i - 6 >= 0) ? i - 6 : i + 18) : '・';
        var fontSize = (text === '・') ? r / 12 : r / 4.5;
        var rate = (text === '18' || text === '15' || text === '21') ? 0.04 : 0;
        var difX = r * (0.8 - Math.abs(rate * Math.cos(deg))) * Math.cos(deg);
        var difY = r * (0.8 - Math.abs(rate * Math.sin(deg))) * Math.sin(deg);

        board.appendChild(this.createText(text, {
          x: (x + difX).toFixed(1),
          y: (y + difY).toFixed(1),
          'font-size': fontSize.toFixed(),
          'class': 'text',
        }));

        deg += dif;
      }

      return board;
    },
    adjustBoard: function(board) {
      this.forEachTextElement(board, function(element) {
        var textBBox = element.getBBox();
        var dy = +element.getAttribute('y') - (textBBox.y + textBBox.height / 2);
        element.setAttribute('dy', dy);
      });
    },
    createPoint: function(x, y, r, locations, now, timeOffset) {
      var containerElement = document.createElementNS(NS_SVG, 'g');
      var pointItemMap = {};

      locations.forEach(function(location) {
        var locationName = location.name;
        var date = new Date(location.getLocalTime(now));
        var key = date.getTime() % (24 * 60 * 60 * 1000);
        var pointItem = pointItemMap[key];

        if (pointItem) {
          pointItem.text +=  ', ' + locationName;
          return;
        }

        pointItemMap[key] = {
          text: locationName,
          deg: (date.getHours() + (date.getMinutes() + timeOffset) / 60) / 24 * (Math.PI * 2) + Math.PI / 2,
        };
      });

      for (var key in pointItemMap) {
        var pointItem = pointItemMap[key];
        var text = pointItem.text;
        var deg = pointItem.deg;

        containerElement.appendChild(this.createCircle({
          cx: (x + r * Math.cos(deg)).toFixed(1),
          cy: (y + r * Math.sin(deg)).toFixed(1),
          r: (r / 20).toFixed(1),
          'stroke-width': (r / 90).toFixed(1),
          'class': 'circle',
        }));

        containerElement.appendChild(this.createText(text, {
          x: x + r * Math.cos(deg),
          y: y + r * Math.sin(deg),
          'font-size': (r / 8).toFixed(),
          'class': 'text',
          'data-deg': deg,
        }));
      }

      return containerElement;
    },
    forEachTextElement: function(parent, method) {
      var children = Array.prototype.slice.call(parent.childNodes);
      children.forEach(function(element) {
        if (element.nodeName === 'text') {
          method(element);
        }
      });
    },
    isBBoxOverlaid: function(bb0, bb1) {
      return ((bb0.x <= bb1.x && bb0.x + bb0.width >= bb1.x) ||
                (bb0.x >= bb1.x && bb1.x + bb1.width >= bb0.x)) &&
              ((bb0.y <= bb1.y && bb0.y + bb0.height >= bb1.y) ||
                (bb0.y >= bb1.y && bb1.y + bb1.height >= bb0.y));
    },
    shrinkElement: function(element, width, height) {
      var bb = element.getBBox();
      var gbb = this.globalBBox(bb);
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
    },
    adjustPointText: function(point, x, y, r, width, height) {
      var upperElements = [];
      var downElements = [];
      var elements = [];

      this.forEachTextElement(point, function(element) {
        var textBBox = element.getBBox();
        var deg = +element.getAttribute('data-deg');
        var dy = +element.getAttribute('y') - (textBBox.y + textBBox.height / 2);
        var sin = Math.sin(deg);
        var cos = Math.cos(deg);

        element.setAttribute('x', x + (r * 1.125 + textBBox.width / 2 + (textBBox.height / 2) * sin * sin) * cos);
        element.setAttribute('y', y + (r * 1.125 + textBBox.height / 2 + (textBBox.width / 8) * cos * cos) * sin);
        element.setAttribute('dy', dy);
        textBBox = element.getBBox();

        if (textBBox.y + textBBox.height / 2 < y) {
          upperElements.push([element, textBBox]);
        } else {
          downElements.push([element, textBBox]);
        }
      });

      var ulen = upperElements.length;
      var dlen = downElements.length;

      upperElements.sort(function(a, b) {
        return (a[1].y < b[1].y) ? -1 : 1;
      }).forEach(function(item, i) {
        var el = item[0];
        for (var j = i + 1; j < ulen; j++) {
          var bb0 = item[1];
          var bb1 = upperElements[j][1];
          if (!this.isBBoxOverlaid(bb0, bb1)) {
            continue;
          }
          var dy = +el.getAttribute('dy') - ((bb0.y + bb0.height) - bb1.y);
          el.setAttribute('dy', dy);
        }
        elements.push(el);
      }.bind(this));

      downElements.sort(function(a, b) {
        return (a[1].y > b[1].y) ? -1 : 1;
      }).forEach(function(item, i) {
        var el = item[0];
        for (var j = i + 1; j < dlen; j++) {
          var bb0 = item[1];
          var bb1 = downElements[j][1];
          if (!this.isBBoxOverlaid(bb0, bb1)) {
            continue;
          }
          var dy = +el.getAttribute('dy') + ((bb1.y + bb1.height) - bb0.y);
          el.setAttribute('dy', dy);
        }
        elements.push(el);
      }.bind(this));

      elements.forEach(function(element) {
        this.shrinkElement(element, width, height);
      }.bind(this));
    },
  };

  var Button = function(el, onclick) {
    this.el = el;
    this.onclick = onclick;
  };

  Button.prototype.init = function() {
    this.el.addEventListener('click', this._onclick.bind(this));
  };

  Button.prototype._onclick = function(event) {
    event.preventDefault();
    event.stopPropagation();
    this.onclick();
  };

  var Main = function(el) {
    this.el = el;
    this.menuButton = new Button(this.el.querySelector('.menu-button'), this._toggleList.bind(this));
    this.locationList = new LocationList();
    this.selectedLocations = [];
    this.isOpen = false;
  };

  Main.prototype.init = function() {
    document.addEventListener('DOMContentLoaded', this._onready.bind(this));
    window.addEventListener('resize', helper.debounce(this._onresize.bind(this), 100));
    this._disableTouchScrolling();
    this.menuButton.init();
  };

  Main.prototype._setLocations = function(keys) {
    keys = keys.filter(function(key) {
      return Location.isValidKey(key);
    });
    location.replace('#' + this._encodeLocationKeys(keys));
    this._selectTimezone(keys);
  };

  Main.prototype._getSelectedKeys = function() {
    return this.selectedLocations.map(function(location) {
      return location.key;
    });
  };

  Main.prototype._closeList = function() {
    if (this.isOpen) {
      this._toggleList();
    }
  };

  Main.prototype._toggleList = function() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.el.setAttribute('class', 'main open');
      clock.draggable.disable();
    } else {
      this.el.setAttribute('class', 'main');
      clock.draggable.enable();
    }
  };

  Main.prototype._disableTouchScrolling = function() {
    if (!dom.supportsTouch()) {
      return;
    }
    window.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, { passive: false });
  };

  Main.prototype._toggleLocation = function(key) {
    var keys = this._getSelectedKeys();
    var index = keys.indexOf(key);

    if (index !== -1) {
      keys.splice(index, 1);
    } else {
      keys.push(key);
    }

    this._setLocations(keys);
  };

  Main.prototype._initTimezoneData = function() {
    this.locationList.updateTimezoneOffset(Date.now());
    list.setList(this.locationList.locations);
    list.update(this.selectedLocations);
  };

  Main.prototype._initClockTimer = function() {
    return setInterval(function() {
      var now = Date.now();
      var minutes = new Date().getMinutes();
      if (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45) {
        this.locationList.updateTimezoneOffset(now);
      }
      clock.updatePoint(now);
    }.bind(this), 30000);
  };

  Main.prototype._initLocations = function() {
    var fragment = location.hash.substring(1);
    var keys = (fragment ? this._decodeLocationKeys(fragment) : DEFAULT_LOCATION_KEYS);
    this._setLocations(keys);
  };

  Main.prototype._updateTimezoneList = function() {
    this._initTimezoneData();
    this._setLocations(this._getSelectedKeys());
  };

  Main.prototype._encodeLocationKeys = function(keys) {
    return Base64.encodeURI(keys.join(','))
  };

  Main.prototype._decodeLocationKeys = function(s) {
    return Base64.decode(s).split(',');
  };

  Main.prototype._selectTimezone = function(keys) {
    this.selectedLocations = this.locationList.findLocations(keys);
    list.update(this.selectedLocations);
    clock.setLocations(this.selectedLocations);
    clock.updatePoint(Date.now());
  };

  Main.prototype._onready = function() {
    list.init(document.querySelector('.list-content'), this._toggleLocation.bind(this));
    clock.init(document.querySelector('.clock'), this._closeList.bind(this));

    this._initTimezoneData();
    this._initClockTimer();
    this._initLocations();
  };

  Main.prototype._onresize = function() {
    clock.updatePoint(Date.now());
  };

  var main = new Main(document.querySelector('.main'));
  main.init();
})(this.app || (this.app = {}));
