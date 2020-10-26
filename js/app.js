(function(app) {
  'use strict';
  var IScroll = require('iscroll');
  var Base64 = require('js-base64').Base64;
  var moment = require('moment-timezone');
  var timezone = app.timezone || require('./timezone.js');

  var NS_SVG = 'http://www.w3.org/2000/svg';
  var DEFAULT_LOCATIONS = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
  var TIMEZONE_NAMES = timezone.names;
  var KEY_CURRENT_LOCATION = 'Current_Location';

  var supportsTouch = ('ontouchstart' in window || (typeof DocumentTouch !== 'undefined' && document instanceof DocumentTouch));
  var isFF = (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1);

  function debounce(func, wait) {
    var updateTimer = null, context, args;
    return function() {
      context = this;
      args = arguments;
      if (updateTimer !== null)
        clearTimeout(updateTimer);
      updateTimer = setTimeout(function() {
        func.apply(context, args);
      }, wait);
    };
  }

  function el(selector, namespace) {
    if (selector[0] === '<') {
      selector = selector.match(/<(.+)>/)[1];
      if (namespace)
        return document.createElementNS(namespace, selector);
      else
        return document.createElement(selector);
    }
    return document.querySelector(selector);
  }

  function attr(element, o, value) {
    if (typeof value === 'undefined' && typeof o === 'string')
      return element.getAttribute(o);

    if (typeof o === 'string') {
      if (value === null)
        element.removeAttribute(o);
      else
        element.setAttribute(o, value);
    } else {
      for (var key in o) {
        element.setAttribute(key, o[key]);
      }
    }

    return element;
  }

  function getHashText() {
    var text = location.href.split('#')[1];
    if (!text)
      return '';

    return Base64.decode(text);
  }

  function setHashText(text) {
    location.replace('#' + Base64.encodeURI(text));
  }

  function createCircle(o) {
    return attr(el('<circle>', NS_SVG), o);
  }

  function createText(text, o) {
    var element = el('<text>', NS_SVG);
    element.appendChild(document.createTextNode(text));
    return attr(element, o);
  }

  function createBoard(x, y, r) {
    var board = el('<g>', NS_SVG);

    board.appendChild(createCircle({
      cx: x,
      cy: y,
      r: r,
      'stroke-width': (r / 30).toFixed(1),
      'class': 'circle'
    }));

    board.appendChild(createCircle({
      cx: x,
      cy: y,
      r: (r / 45).toFixed(1),
      fill: 'black'
    }));

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
        'class': 'text'
      }));

      deg += dif;
    }

    return board;
  }

  function adjustBoard(board) {
    forEachTextElement(board, function(element) {
      var textBBox = element.getBBox();
      var dy = +attr(element, 'y') - (textBBox.y + textBBox.height / 2);
      attr(element, 'dy', dy);
    });
  }

  function createPoint(x, y, r, timelist) {
    var containerElement = el('<g>', NS_SVG);
    var pointItemMap = {};

    timelist.forEach(function(item) {
      var locationName = item[0];
      var date = item[1];
      var key = date.getTime();
      var pointItem = pointItemMap[key];

      if (pointItem) {
        pointItem.text +=  ', ' + locationName;
        return;
      }

      pointItemMap[key] = {
        text: locationName,
        deg: (date.getHours() + date.getMinutes() / 60) / 24 * (Math.PI * 2) + Math.PI / 2
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
        'class': 'circle'
      }));

      containerElement.appendChild(createText(text, {
        x: x + r * Math.cos(deg),
        y: y + r * Math.sin(deg),
        'font-size': (r / 8).toFixed(),
        'class': 'text',
        'data-deg': deg
      }));
    }

    return containerElement;
  }

  function forEachTextElement(parent, method) {
    var children = Array.prototype.slice.call(parent.childNodes);
    children.forEach(function(element) {
      if (element.nodeName === 'text')
        method(element);
    });
  }

  function isBBoxOverlayed(bb0, bb1) {
    return ((bb0.x < bb1.x && bb0.x + bb0.width > bb1.x) ||
              (bb0.x > bb1.x && bb1.x + bb1.width > bb0.x)) &&
            ((bb0.y < bb1.y && bb0.y + bb0.height > bb1.y) ||
              (bb0.y > bb1.y && bb1.y + bb1.height > bb0.y))
  }

  function shrinkElement(element, width, height) {
    var bb = element.getBBox();
    var gbb = clock_view.globalBBox(bb);
    var pattern = 0;

    if ((gbb.x < (isFF ? 168 : 0) && (pattern = 1)) ||
        (gbb.x + gbb.width > width + (isFF ? 168 : 0) && (pattern = 2)) ||
        (gbb.y < 0 && (pattern = 3)) ||
        (gbb.y + gbb.height > height && (pattern = 4))) {
      attr(element, 'font-size', +attr(element, 'font-size') / 1.5);

      var newbb = element.getBBox();
      var value;

      switch (pattern) {
        case 1:
          value = bb.x + bb.width - (newbb.x + newbb.width);
          attr(element, 'x', +attr(element, 'x') + value);
          break;
        case 2:
          value = newbb.x - bb.x;
          attr(element, 'x', +attr(element, 'x') - value);
          break;
        case 3:
          value = bb.y + bb.height - (newbb.y + newbb.height);
          attr(element, 'y', +attr(element, 'y') + value);
          break;
        case 4:
          value = newbb.y - bb.y;
          attr(element, 'y', +attr(element, 'y') - value);
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
      var dy = +attr(element, 'y') - (textBBox.y + textBBox.height / 2);
      var property = {
        x: x + (r + textBBox.width / 2 + r / 8) * Math.cos(deg),
        y: y + (r + textBBox.height / 2 + r / 8) * Math.sin(deg),
        dy: dy
      };

      attr(element, property);
      textBBox = element.getBBox();

      if (textBBox.y + textBBox.height / 2 < y)
        upper_elements.push([element, textBBox]);
      else
        down_elements.push([element, textBBox]);
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
        if (!isBBoxOverlayed(bb0, bb1))
          continue;
        var dy = +attr(el, 'dy') - ((bb0.y + bb0.height) - bb1.y);
        attr(el, 'dy', dy);
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
        if (!isBBoxOverlayed(bb0, bb1))
          continue;
        var dy = +attr(el, 'dy') + ((bb1.y + bb1.height) - bb0.y);
        attr(el, 'dy', dy);
      }
      elements.push(el);
    });

    elements.forEach(function(element) {
      shrinkElement(element, width, height);
    });
  }

  function getLocationName(tzName) {
    var name = tzName.substring(tzName.lastIndexOf('/') + 1).replace(/_/g, ' ');
    switch (name) {
      case 'Bahia Banderas': return 'Bahia de Banderas';
      case 'DumontDUrville': return 'Dumont d\'Urville';
      default: return name;
    }
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

    TIMEZONE_NAMES.forEach(function(name) {
      data[name] = moment.tz.zone(name.split('#/')[0]).utcOffset(now) * (-60);
    });

    data[KEY_CURRENT_LOCATION] = new Date().getTimezoneOffset() * (-60);

    return data;
  }

  var listToggle = (function() {
    var isOpen = false;
    return function() {
      var container = el('#container');

      if (isOpen)
        attr(container, 'class', null);
      else
        attr(container, 'class', 'open');

      isOpen = !isOpen;
    };
  })();

  function initTimezoneData() {
    var data = createTimezoneData();
    timelist.data = data;
    clock_view.timelist = timelist.get();
    list_view.setList(Object.keys(data));
    list_view.selected = timelist.selected;
    list_view.update();
  }

  function initClockTimer() {
    return setInterval(function() {
      var minutes = new Date().getMinutes();
      if (minutes === 0 || minutes === 15 || minutes === 30 || minutes === 45)
        timelist.data = createTimezoneData();
      clock_view.timelist = timelist.get();
      clock_view.updatePoint();
    }, 30000);
  }

  function initLocations() {
    setLocations(getLocations());
  }

  function getLocations() {
    var hash = getHashText();
    var list = (hash ? hash.split(',') : DEFAULT_LOCATIONS);
    return list.filter(function(item) {
      return TIMEZONE_NAMES.indexOf(item) !== -1 || item === KEY_CURRENT_LOCATION;
    });
  }

  function setLocations(list) {
    list = list.filter(function(item) {
      return TIMEZONE_NAMES.indexOf(item) !== -1 || item === KEY_CURRENT_LOCATION;
    });
    setHashText(list.join(','));
    selectTimezone(list);
  }

  var timelist = {
    data: null,
    selected: [],
    get: function() {
      if (this.data === null || this.selected.length === 0)
        return [];

      var selected_timezone = this.selected.map(function(key) {
        return [key, this.data[key]];
      }.bind(this));

      return getTimelist(selected_timezone);
    }
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

      if (supportsTouch)
        attr(element.parentNode, 'class', 'unscrollable');
    },
    setList: function(list) {
      var element = el('<div>');
      var listitems = [];

      list.forEach(function(item) {
        if (item === KEY_CURRENT_LOCATION)
          return;
        var name = getLocationName(item);
        listitems.push([item, name]);
      });

      listitems.sort(function(a, b) {
        return (a[1] < b[1]) ? -1 : 1;
      });

      listitems.unshift([KEY_CURRENT_LOCATION, 'Current Location']);

      listitems.forEach(function(listitem) {
        var item = el('<div>');
        var key = listitem[0];
        attr(item, {'data-key': key, 'class': 'list-item'});
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
          fadeScrollbars: true
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
          attr(item, 'class', 'list-item');
        });
      }

      this.current_selected_items = this.selected.map(function(key) {
        var item = this.items[key];
        attr(item, 'class', 'list-item list-selected');
        return item;
      }.bind(this));
    },
    onclick: function(event) {
      var key = attr(event.target, 'data-key');
      var list = timelist.selected;
      var index = list.indexOf(key);

      if (index !== -1)
        list.splice(index, 1);
      else
        list.push(key);

      setLocations(list);
    }
  };

  var bars_view = {
    init: function(element) {
      element.addEventListener((supportsTouch ? 'touchend' : 'click'), function(event) {
        event.preventDefault();
        event.stopPropagation();
        listToggle();
      });
    }
  };

  var clock_view = {
    init: function(element, timelist) {
      var width = 720, height = 720;
      this.element = element;
      this.timelist = timelist;
      this.board_element = el('<g>', NS_SVG);
      this.point_element = el('<g>', NS_SVG);
      this.element.appendChild(this.board_element);
      this.element.appendChild(this.point_element);
      this.x = width / 2;
      this.y = height / 2;
      this.r = Math.min(width, height) / 2 * 0.6;

      element.addEventListener((supportsTouch ? 'touchstart' : 'mousedown'), function() {
        if (attr(this.element.parentNode.parentNode, 'class') === 'open')
          listToggle();
      }.bind(this));
    },
    updateBoard: function() {
      var new_board = createBoard(this.x, this.y, this.r);
      this.element.replaceChild(new_board, this.board_element);
      adjustBoard(new_board);
      this.board_element = new_board;
    },
    updatePoint: function() {
      var new_point = createPoint(this.x, this.y, this.r, this.timelist);
      this.element.replaceChild(new_point, this.point_element);
      adjustPointText(new_point, this.x, this.y, this.r, window.innerWidth, window.innerHeight);
      this.point_element = new_point;
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
        height: pt1.y - pt0.y
      };
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    list_view.init(el('#list'));
    bars_view.init(el('#bars'));
    clock_view.init(el('#clock'), timelist.get());
    clock_view.updateBoard();

    initTimezoneData();
    initClockTimer();
    initLocations();
  });

  window.addEventListener('resize', debounce(function() {
    clock_view.updatePoint();
  }, 100));

  if (supportsTouch) {
    window.addEventListener('touchmove', function(event) {
      event.preventDefault();
    });
  }
})(this.app || (this.app = {}));