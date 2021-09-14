(function(app) {
  'use strict';

  var IScroll = require('iscroll');
  var Base64 = require('js-base64').Base64;
  var moment = require('moment-timezone');
  var helper = app.helper || require('./helper.js');
  var Draggable = app.Draggable || require('./draggable.js');
  var timezone = app.timezone || require('./timezone.js');

  var NS_SVG = 'http://www.w3.org/2000/svg';
  var DEFAULT_LOCATIONS = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
  var DEFAULT_TIMEZONE_NAMES = timezone.names;
  var KEY_CURRENT_LOCATION = 'Current_Location';

  var supportsTouch = ('ontouchstart' in window || (typeof DocumentTouch !== 'undefined' && document instanceof DocumentTouch));

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      return setTimeout(callback, 1000 / 60);
    };
  }

  function getHashText() {
    var text = location.hash.substring(1);
    return (text ? Base64.decode(text) : '');
  }

  function setHashText(text) {
    location.replace('#' + Base64.encodeURI(text));
  }

  function getUrlSearchParams() {
    var params = {};
    var pairs = location.search.substring(1).split('&');
    for (var i = 0, len = pairs.length; i < len; i++) {
      var pair = pairs[i];
      var index = pair.indexOf('=');
      if (index !== -1) {
        var name = decodeURIComponent(pair.slice(0, index));
        var value = decodeURIComponent(pair.slice(index + 1));
        params[name] = value;
      } else if (pair) {
        params[decodeURIComponent(pair)] = '';
      }
    }
    return params;
  }

  function setUrlSearchParam(name, value) {
    var params = getUrlSearchParams();
    params[name] = value;
    var search = '?' + Object.keys(params).map(function(name) {
      return encodeURIComponent(name) + '=' + encodeURIComponent(params[name]);
    }).join('&');
    history.replaceState(null, null, search + location.hash);
  }

  function createCircle(o) {
    var element = document.createElementNS(NS_SVG, 'circle');
    for (var key in o) {
      element.setAttribute(key, o[key]);
    }
    return element;
  }

  function createText(text, o) {
    var element = document.createElementNS(NS_SVG, 'text');
    element.appendChild(document.createTextNode(text));
    for (var key in o) {
      element.setAttribute(key, o[key]);
    }
    return element;
  }

  function createBoard(x, y, r) {
    var board = document.createElementNS(NS_SVG, 'g');

    board.appendChild(createCircle({
      cx: x,
      cy: y,
      r: r,
      'stroke-width': (r / 30).toFixed(1),
      'class': 'circle',
    }));

    board.appendChild(createCircle({
      cx: x,
      cy: y,
      r: (r / 45).toFixed(1),
      fill: 'black',
      'class': 'center-point',
    }));

    var center_spin = document.createElementNS(NS_SVG, 'g');
    center_spin.setAttribute('class', 'center-spin');

    center_spin.appendChild(createText('+00:00', {
      x: x - 11,
      y: y - 16,
      'font-size': r / 6,
      'class': 'text center-time',
    }));

    center_spin.appendChild(createText('RESET', {
      x: x,
      y: y + 32,
      'font-size': r / 10,
      'class': 'text center-reset',
    }));

    board.appendChild(center_spin);

    var dif = Math.PI / 12;
    var deg = 0;

    for (var i = 0; i < 24; i++) {
      var text = (i % 3 === 0) ? String((i - 6 >= 0) ? i - 6 : i + 18) : '・';
      var fontSize = (text === '・') ? r / 12 : r / 4.5;
      var rate = (text === '18' || text === '15' || text === '21') ? 0.04 : 0;
      var dif_x = r * (0.8 - Math.abs(rate * Math.cos(deg))) * Math.cos(deg);
      var dif_y = r * (0.8 - Math.abs(rate * Math.sin(deg))) * Math.sin(deg);

      board.appendChild(createText(text, {
        x: (x + dif_x).toFixed(1),
        y: (y + dif_y).toFixed(1),
        'font-size': fontSize.toFixed(),
        'class': 'text',
      }));

      deg += dif;
    }

    return board;
  }

  function adjustBoard(board) {
    forEachTextElement(board, function(element) {
      var textBBox = element.getBBox();
      var dy = +element.getAttribute('y') - (textBBox.y + textBBox.height / 2);
      element.setAttribute('dy', dy);
    });
  }

  function createPoint(x, y, r, timelist, timeOffset) {
    var containerElement = document.createElementNS(NS_SVG, 'g');
    var pointItemMap = {};

    timelist.forEach(function(item) {
      var locationName = item[0];
      var date = item[1];
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

      containerElement.appendChild(createCircle({
        cx: (x + r * Math.cos(deg)).toFixed(1),
        cy: (y + r * Math.sin(deg)).toFixed(1),
        r: (r / 20).toFixed(1),
        'stroke-width': (r / 90).toFixed(1),
        'class': 'circle',
      }));

      containerElement.appendChild(createText(text, {
        x: x + r * Math.cos(deg),
        y: y + r * Math.sin(deg),
        'font-size': (r / 8).toFixed(),
        'class': 'text',
        'data-deg': deg,
      }));
    }

    return containerElement;
  }

  function forEachTextElement(parent, method) {
    var children = Array.prototype.slice.call(parent.childNodes);
    children.forEach(function(element) {
      if (element.nodeName === 'text') {
        method(element);
      }
    });
  }

  function isBBoxOverlaid(bb0, bb1) {
    return ((bb0.x <= bb1.x && bb0.x + bb0.width >= bb1.x) ||
              (bb0.x >= bb1.x && bb1.x + bb1.width >= bb0.x)) &&
            ((bb0.y <= bb1.y && bb0.y + bb0.height >= bb1.y) ||
              (bb0.y >= bb1.y && bb1.y + bb1.height >= bb0.y));
  }

  function shrinkElement(element, width, height) {
    var bb = element.getBBox();
    var gbb = clock_view.globalBBox(bb);
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
  }

  function adjustPointText(point, x, y, r, width, height) {
    var upper_elements = [];
    var down_elements = [];
    var elements = [];

    forEachTextElement(point, function(element) {
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
        upper_elements.push([element, textBBox]);
      } else {
        down_elements.push([element, textBBox]);
      }
    });

    var ulen = upper_elements.length;
    var dlen = down_elements.length;

    upper_elements.sort(function(a, b) {
      return (a[1].y < b[1].y) ? -1 : 1;
    }).forEach(function(item, i) {
      var el = item[0];
      for (var j = i + 1; j < ulen; j++) {
        var bb0 = item[1];
        var bb1 = upper_elements[j][1];
        if (!isBBoxOverlaid(bb0, bb1)) {
          continue;
        }
        var dy = +el.getAttribute('dy') - ((bb0.y + bb0.height) - bb1.y);
        el.setAttribute('dy', dy);
      }
      elements.push(el);
    });

    down_elements.sort(function(a, b) {
      return (a[1].y > b[1].y) ? -1 : 1;
    }).forEach(function(item, i) {
      var el = item[0];
      for (var j = i + 1; j < dlen; j++) {
        var bb0 = item[1];
        var bb1 = down_elements[j][1];
        if (!isBBoxOverlaid(bb0, bb1)) {
          continue;
        }
        var dy = +el.getAttribute('dy') + ((bb1.y + bb1.height) - bb0.y);
        el.setAttribute('dy', dy);
      }
      elements.push(el);
    });

    elements.forEach(function(element) {
      shrinkElement(element, width, height);
    });
  }

  function getLocationName(tzName) {
    return tzName.substring(tzName.lastIndexOf('/') + 1).replace(/_/g, ' ');
  }

  function getTimelist(timezone) {
    var date = new Date();
    var currentTime = date.getTime();
    var currentTimezoneOffset = date.getTimezoneOffset();

    return timezone.map(function(item) {
      var name = getLocationName(item[0]);
      var time = parseInt(item[1], 10);
      time = new Date(currentTime + time * 1000 + currentTimezoneOffset * 60 * 1000);
      return [name, time];
    });
  }

  function selectTimezone(list) {
    timelist.selected = list;
    clock_view.timelist = timelist.get();
    list_view.selected = timelist.selected;
    list_view.update();
    clock_view.updatePoint();
  }

  function createTimezoneData() {
    var data  = {};
    var now = Date.now();

    DEFAULT_TIMEZONE_NAMES.forEach(function(name) {
      data[name] = moment.tz.zone(name.split('#/')[0]).utcOffset(now) * (-60);
    });

    data[KEY_CURRENT_LOCATION] = new Date().getTimezoneOffset() * (-60);

    var params = getUrlSearchParams();
    getCustomTimezoneList(params).forEach(function(name) {
      if (name in data) {
        return;
      }
      var tz = moment.tz.zone(name.split('#/')[0]);
      if (tz) {
        data[name] = tz.utcOffset(now) * (-60);
      }
    });

    getHiddenTimezoneList(params).forEach(function(name) {
      delete data[name];
    });

    return data;
  }

  function getCustomTimezoneList(params) {
    return (params.custom_tzlist ? Base64.decode(params.custom_tzlist).split(',') : []);
  }

  function getHiddenTimezoneList(params) {
    return (params.hidden_tzlist ? Base64.decode(params.hidden_tzlist).split(',') : []);
  }

  function setCustomTimezoneList(list) {
    setUrlSearchParam('custom_tzlist', Base64.encodeURI(list.join(',')));
  }

  function setHiddenTimezoneList(list) {
    setUrlSearchParam('hidden_tzlist', Base64.encodeURI(list.join(',')));
  }

  function updateTimezoneList() {
    initTimezoneData();
    setLocations(timelist.selected);
  }

  var listToggle = (function() {
    var isOpen = false;
    return function() {
      isOpen = !isOpen;
      var element = document.querySelector('#container');
      element.setAttribute('class', (isOpen ? 'open' : null));
      if (isOpen) {
        clock_view.draggable.disable();
      } else {
        clock_view.draggable.enable();
      }
    };
  })();

  function initTimezoneData() {
    timelist.updateData();
    clock_view.timelist = timelist.get();
    list_view.setList(Object.keys(timelist.data));
    list_view.selected = timelist.selected;
    list_view.update();
  }

  function initClockTimer() {
    return setInterval(function() {
      var minutes = new Date().getMinutes();
      if (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45) {
        timelist.updateData();
      }
      clock_view.timelist = timelist.get();
      clock_view.updatePoint();
    }, 30000);
  }

  function initLocations() {
    setLocations(getLocations());
  }

  function initDialSpinner() {
    dial_spinner.init(clock_view.element);
  }

  function getLocations() {
    var hash = getHashText();
    var list = (hash ? hash.split(',') : DEFAULT_LOCATIONS);
    return list.filter(function(item) {
      return Object.keys(timelist.data).indexOf(item) !== -1;
    });
  }

  function setLocations(list) {
    list = list.filter(function(item) {
      return Object.keys(timelist.data).indexOf(item) !== -1;
    });
    setHashText(list.join(','));
    selectTimezone(list);
  }

  var timelist = {
    data: {},
    selected: [],
    get: function() {
      if (Object.keys(this.data).length === 0 || this.selected.length === 0) {
        return [];
      }

      var selected_timezone = this.selected.map(function(key) {
        return [key, this.data[key]];
      }.bind(this));

      return getTimelist(selected_timezone);
    },
    updateData: function() {
      this.data = createTimezoneData();
    },
  };

  var dial_spinner = {
    timeOffset: 0,
    isRightHanded: true,
    init: function(clock_element) {
      this.clock_element = clock_element;
      this.center_time_element = clock_element.querySelector('.center-time');
      this.center_reset_element = clock_element.querySelector('.center-reset');
    },
    toggleTimeOffset: function() {
      this.timeOffset = (this.timeOffset + (this.timeOffset >= 0 ? -1 : 1) * 1440) % 1440;
      this.isRightHanded = (this.timeOffset >= 0);
      clock_view.updateCenter();
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
          clock_view.draggable.enable();
        }
        clock_view.updatePoint();
        clock_view.updateCenter();
      }.bind(this);
      clock_view.draggable.disable();
      requestAnimationFrame(callback);
    },
    dragstart: function(event) {
      event.preventDefault();
      this.startClassName = event.target.getAttribute('class') || '';
      if (this.startClassName.indexOf('center-time') !== -1) {
        this.isDragCanceled = true;
        this.center_time_element.setAttribute('fill', 'lightgray');
        return;
      }
      if (this.startClassName.indexOf('center-reset') !== -1) {
        this.isDragCanceled = true;
        this.center_reset_element.setAttribute('fill', 'lightgray');
        return;
      }
      this.isDragCanceled = false;
      this.x0 = (event.touches ? event.changedTouches[0].clientX : event.clientX);
      this.y0 = (event.touches ? event.changedTouches[0].clientY : event.clientY);
      this.startTimeOffset = this.timeOffset;
      this.isDragging = true;
      clock_view.updateCenter();
    },
    dragmove: function(dx, dy) {
      if (this.isDragCanceled) {
        return;
      }

      var rect = this.clock_element.getBoundingClientRect();
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
      clock_view.updatePoint();
      clock_view.updateCenter();
    },
    dragend: function(event) {
      var target = event.target;
      if (supportsTouch) {
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
        this.center_time_element.setAttribute('fill', 'gray');
        this.center_reset_element.setAttribute('fill', 'gray');
      }
      this.isDragging = false;
      clock_view.updateCenter();
    },
  };

  var list_view = {
    items: {},
    selected: [],
    current_selected_items: [],
    init: function(element) {
      this.element = element;
      this.scrolling = false;
      this.clickable = true;

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

      if (supportsTouch) {
        element.parentNode.setAttribute('class', 'unscrollable');
      }
    },
    setList: function(list) {
      var element = document.createElement('div');
      var listitems = [];
      var needsCurrentLocation = false;

      list.forEach(function(item) {
        if (item === KEY_CURRENT_LOCATION) {
          needsCurrentLocation = true;
          return;
        }
        var name = getLocationName(item);
        listitems.push([item, name]);
      });

      listitems.sort(function(a, b) {
        return (a[1] < b[1]) ? -1 : 1;
      });

      if (needsCurrentLocation) {
        listitems.unshift([KEY_CURRENT_LOCATION, 'Current Location']);
      }

      listitems.forEach(function(listitem) {
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

      if (supportsTouch) {
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
    update: function() {
      if (this.current_selected_items.length > this.selected.length) {
        this.current_selected_items.forEach(function(item) {
          item.setAttribute('class', 'list-item');
        });
      }

      this.current_selected_items = this.selected.map(function(key) {
        var item = this.items[key];
        item.setAttribute('class', 'list-item list-selected');
        return item;
      }.bind(this));
    },
    onclick: function(event) {
      var key = event.target.getAttribute('data-key');
      var list = timelist.selected;
      var index = list.indexOf(key);

      if (index !== -1) {
        list.splice(index, 1);
      } else {
        list.push(key);
      }

      setLocations(list);
    },
  };

  var bars_view = {
    init: function(element) {
      element.addEventListener((supportsTouch ? 'touchend' : 'click'), function(event) {
        event.preventDefault();
        event.stopPropagation();
        listToggle();
      });
    },
  };

  var clock_view = {
    init: function(element, timelist) {
      var width = 720, height = 720;
      this.element = element;
      this.timelist = timelist;
      this.board_element = document.createElementNS(NS_SVG, 'g');
      this.point_element = document.createElementNS(NS_SVG, 'g');
      this.element.appendChild(this.board_element);
      this.element.appendChild(this.point_element);
      this.x = width / 2;
      this.y = height / 2;
      this.r = Math.min(width, height) / 2 * 0.6;
      this.draggable = new Draggable({
        element: element,
        onstart: dial_spinner.dragstart.bind(dial_spinner),
        onmove: dial_spinner.dragmove.bind(dial_spinner),
        onend: dial_spinner.dragend.bind(dial_spinner),
      });

      this.draggable.enable();
      element.addEventListener((supportsTouch ? 'touchstart' : 'mousedown'), function() {
        if (this.element.parentNode.parentNode.getAttribute('class') === 'open') {
          listToggle();
        }
      }.bind(this));
    },
    updateBoard: function() {
      var new_board = createBoard(this.x, this.y, this.r);
      this.element.replaceChild(new_board, this.board_element);
      adjustBoard(new_board);
      this.board_element = new_board;
      this.center_time_element = this.board_element.querySelector('.center-time');
    },
    updatePoint: function() {
      var new_point = createPoint(this.x, this.y, this.r, this.timelist, dial_spinner.timeOffset);
      this.element.replaceChild(new_point, this.point_element);
      adjustPointText(new_point, this.x, this.y, this.r, window.innerWidth, window.innerHeight);
      this.point_element = new_point;
    },
    updateCenter: function() {
      var timeOffset = dial_spinner.timeOffset;
      var h = ('00' + Math.abs((timeOffset - timeOffset % 60) / 60)).slice(-2);
      var m = ('00' + Math.abs(timeOffset % 60)).slice(-2);
      var text = (timeOffset >= 0 ? '+' : '-') + h + ':' + m;
      this.center_time_element.textContent = text;
      this.element.setAttribute('class', (timeOffset || dial_spinner.isDragging ? 'clock spin' : 'clock'));
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
  };

  document.addEventListener('DOMContentLoaded', function() {
    list_view.init(document.querySelector('#list'));
    bars_view.init(document.querySelector('#bars'));
    clock_view.init(document.querySelector('#clock'), timelist.get());
    clock_view.updateBoard();

    initTimezoneData();
    initClockTimer();
    initLocations();
    initDialSpinner();
  });

  window.addEventListener('resize', helper.debounce(function() {
    clock_view.updatePoint();
  }, 100));

  if (supportsTouch) {
    window.addEventListener('touchmove', function(event) {
      event.preventDefault();
    }, { passive: false });
  }
})(this.app || (this.app = {}));
