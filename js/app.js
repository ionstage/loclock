(function(global) {
  var IScroll = require('iscroll');
  var Base64 = require('js-base64').Base64;
  var moment = require('moment-timezone');

  var window = global.window;
  var document = global.document;

  var NS = 'http://www.w3.org/2000/svg';
  var DEFAULT_LOCATION = 'America/New_York,Europe/London,Asia/Tokyo';
  var TIMEZONE_NAMES = ['Europe/Andorra', 'Asia/Dubai', 'Asia/Kabul', 'America/Antigua', 'America/Anguilla', 'Europe/Tirane', 'Asia/Yerevan', 'Africa/Luanda', 'Antarctica/McMurdo', 'Antarctica/Rothera', 'Antarctica/Palmer', 'Antarctica/Mawson', 'Antarctica/Davis', 'Antarctica/Casey', 'Antarctica/Vostok', 'Antarctica/DumontDUrville', 'Antarctica/Syowa', 'America/Argentina/Buenos_Aires', 'America/Argentina/Cordoba', 'America/Argentina/Salta', 'America/Argentina/Jujuy', 'America/Argentina/Tucuman', 'America/Argentina/Catamarca', 'America/Argentina/La_Rioja', 'America/Argentina/San_Juan', 'America/Argentina/Mendoza', 'America/Argentina/San_Luis', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Ushuaia', 'Pacific/Pago_Pago', 'Europe/Vienna', 'Australia/Lord_Howe', 'Antarctica/Macquarie', 'Australia/Hobart', 'Australia/Currie', 'Australia/Melbourne', 'Australia/Sydney', 'Australia/Broken_Hill', 'Australia/Brisbane', 'Australia/Lindeman', 'Australia/Adelaide', 'Australia/Darwin', 'Australia/Perth', 'Australia/Eucla', 'America/Aruba', 'Europe/Mariehamn', 'Asia/Baku', 'Europe/Sarajevo', 'America/Barbados', 'Asia/Dhaka', 'Europe/Brussels', 'Africa/Ouagadougou', 'Europe/Sofia', 'Asia/Bahrain', 'Africa/Bujumbura', 'Africa/Porto-Novo', 'America/St_Barthelemy', 'Atlantic/Bermuda', 'Asia/Brunei', 'America/La_Paz', 'America/Kralendijk', 'America/Noronha', 'America/Belem', 'America/Fortaleza', 'America/Recife', 'America/Araguaina', 'America/Maceio', 'America/Bahia', 'America/Sao_Paulo', 'America/Campo_Grande', 'America/Cuiaba', 'America/Santarem', 'America/Porto_Velho', 'America/Boa_Vista', 'America/Manaus', 'America/Eirunepe', 'America/Rio_Branco', 'America/Nassau', 'Asia/Thimphu', 'Africa/Gaborone', 'Europe/Minsk', 'America/Belize', 'America/St_Johns', 'America/Halifax', 'America/Glace_Bay', 'America/Moncton', 'America/Goose_Bay', 'America/Blanc-Sablon', 'America/Toronto', 'America/Nipigon', 'America/Thunder_Bay', 'America/Iqaluit', 'America/Pangnirtung', 'America/Resolute', 'America/Atikokan', 'America/Rankin_Inlet', 'America/Winnipeg', 'America/Rainy_River', 'America/Regina', 'America/Swift_Current', 'America/Edmonton', 'America/Cambridge_Bay', 'America/Yellowknife', 'America/Inuvik', 'America/Creston', 'America/Dawson_Creek', 'America/Vancouver', 'America/Whitehorse', 'America/Dawson', 'Indian/Cocos', 'Africa/Kinshasa', 'Africa/Lubumbashi', 'Africa/Bangui', 'Africa/Brazzaville', 'Europe/Zurich', 'Africa/Abidjan', 'Pacific/Rarotonga', 'America/Santiago', 'Pacific/Easter', 'Africa/Douala', 'Asia/Shanghai', 'Asia/Harbin', 'Asia/Chongqing', 'Asia/Urumqi', 'Asia/Kashgar', 'America/Bogota', 'America/Costa_Rica', 'America/Havana', 'Atlantic/Cape_Verde', 'America/Curacao', 'Indian/Christmas', 'Asia/Nicosia', 'Europe/Prague', 'Europe/Berlin', 'Europe/Busingen', 'Africa/Djibouti', 'Europe/Copenhagen', 'America/Dominica', 'America/Santo_Domingo', 'Africa/Algiers', 'America/Guayaquil', 'Pacific/Galapagos', 'Europe/Tallinn', 'Africa/Cairo', 'Africa/El_Aaiun', 'Africa/Asmara', 'Europe/Madrid', 'Africa/Ceuta', 'Atlantic/Canary', 'Africa/Addis_Ababa', 'Europe/Helsinki', 'Pacific/Fiji', 'Atlantic/Stanley', 'Pacific/Chuuk', 'Pacific/Pohnpei', 'Pacific/Kosrae', 'Atlantic/Faroe', 'Europe/Paris', 'Africa/Libreville', 'Europe/London', 'America/Grenada', 'Asia/Tbilisi', 'America/Cayenne', 'Europe/Guernsey', 'Africa/Accra', 'Europe/Gibraltar', 'America/Godthab', 'America/Danmarkshavn', 'America/Scoresbysund', 'America/Thule', 'Africa/Banjul', 'Africa/Conakry', 'America/Guadeloupe', 'Africa/Malabo', 'Europe/Athens', 'Atlantic/South_Georgia', 'America/Guatemala', 'Pacific/Guam', 'Africa/Bissau', 'America/Guyana', 'Asia/Hong_Kong', 'America/Tegucigalpa', 'Europe/Zagreb', 'America/Port-au-Prince', 'Europe/Budapest', 'Asia/Jakarta', 'Asia/Pontianak', 'Asia/Makassar', 'Asia/Jayapura', 'Europe/Dublin', 'Asia/Jerusalem', 'Europe/Isle_of_Man', 'Asia/Kolkata', 'Indian/Chagos', 'Asia/Baghdad', 'Asia/Tehran', 'Atlantic/Reykjavik', 'Europe/Rome', 'Europe/Jersey', 'America/Jamaica', 'Asia/Amman', 'Asia/Tokyo', 'Africa/Nairobi', 'Asia/Bishkek', 'Asia/Phnom_Penh', 'Pacific/Tarawa', 'Pacific/Enderbury', 'Pacific/Kiritimati', 'Indian/Comoro', 'America/St_Kitts', 'Asia/Pyongyang', 'Asia/Seoul', 'Asia/Kuwait', 'America/Cayman', 'Asia/Almaty', 'Asia/Qyzylorda', 'Asia/Aqtobe', 'Asia/Aqtau', 'Asia/Oral', 'Asia/Vientiane', 'Asia/Beirut', 'America/St_Lucia', 'Europe/Vaduz', 'Asia/Colombo', 'Africa/Monrovia', 'Africa/Maseru', 'Europe/Vilnius', 'Europe/Luxembourg', 'Europe/Riga', 'Africa/Tripoli', 'Africa/Casablanca', 'Europe/Monaco', 'Europe/Chisinau', 'Europe/Podgorica', 'America/Marigot', 'Indian/Antananarivo', 'Pacific/Majuro', 'Pacific/Kwajalein', 'Europe/Skopje', 'Africa/Bamako', 'Asia/Rangoon', 'Asia/Ulaanbaatar', 'Asia/Hovd', 'Asia/Choibalsan', 'Asia/Macau', 'Pacific/Saipan', 'America/Martinique', 'Africa/Nouakchott', 'America/Montserrat', 'Europe/Malta', 'Indian/Mauritius', 'Indian/Maldives', 'Africa/Blantyre', 'America/Mexico_City', 'America/Cancun', 'America/Merida', 'America/Monterrey', 'America/Matamoros', 'America/Mazatlan', 'America/Chihuahua', 'America/Ojinaga', 'America/Hermosillo', 'America/Tijuana', 'America/Santa_Isabel', 'America/Bahia_Banderas', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Africa/Maputo', 'Africa/Windhoek', 'Pacific/Noumea', 'Africa/Niamey', 'Pacific/Norfolk', 'Africa/Lagos', 'America/Managua', 'Europe/Amsterdam', 'Europe/Oslo', 'Asia/Kathmandu', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Auckland', 'Pacific/Chatham', 'Asia/Muscat', 'America/Panama', 'America/Lima', 'Pacific/Tahiti', 'Pacific/Marquesas', 'Pacific/Gambier', 'Pacific/Port_Moresby', 'Asia/Manila', 'Asia/Karachi', 'Europe/Warsaw', 'America/Miquelon', 'Pacific/Pitcairn', 'America/Puerto_Rico', 'Asia/Gaza', 'Asia/Hebron', 'Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores', 'Pacific/Palau', 'America/Asuncion', 'Asia/Qatar', 'Indian/Reunion', 'Europe/Bucharest', 'Europe/Belgrade', 'Europe/Kaliningrad', 'Europe/Moscow', 'Europe/Volgograd', 'Europe/Samara', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Novokuznetsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Yakutsk', 'Asia/Khandyga', 'Asia/Vladivostok', 'Asia/Sakhalin', 'Asia/Ust-Nera', 'Asia/Magadan', 'Asia/Kamchatka', 'Asia/Anadyr', 'Africa/Kigali', 'Asia/Riyadh', 'Pacific/Guadalcanal', 'Indian/Mahe', 'Africa/Khartoum', 'Europe/Stockholm', 'Asia/Singapore', 'Atlantic/St_Helena', 'Europe/Ljubljana', 'Arctic/Longyearbyen', 'Europe/Bratislava', 'Africa/Freetown', 'Europe/San_Marino', 'Africa/Dakar', 'Africa/Mogadishu', 'America/Paramaribo', 'Africa/Juba', 'Africa/Sao_Tome', 'America/El_Salvador', 'America/Lower_Princes', 'Asia/Damascus', 'Africa/Mbabane', 'America/Grand_Turk', 'Africa/Ndjamena', 'Indian/Kerguelen', 'Africa/Lome', 'Asia/Bangkok', 'Asia/Dushanbe', 'Pacific/Fakaofo', 'Asia/Dili', 'Asia/Ashgabat', 'Africa/Tunis', 'Pacific/Tongatapu', 'Europe/Istanbul', 'America/Port_of_Spain', 'Pacific/Funafuti', 'Asia/Taipei', 'Africa/Dar_es_Salaam', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye', 'Europe/Simferopol', 'Africa/Kampala', 'Pacific/Johnston', 'Pacific/Midway', 'Pacific/Wake', 'America/New_York', 'America/Detroit', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/Indiana/Indianapolis', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Vevay', 'America/Chicago', 'America/Indiana/Tell_City', 'America/Indiana/Knox', 'America/Menominee', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/North_Dakota/Beulah', 'America/Denver', 'America/Boise', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'America/Juneau', 'America/Sitka', 'America/Yakutat', 'America/Nome', 'America/Adak', 'America/Metlakatla', 'Pacific/Honolulu', 'America/Montevideo', 'Asia/Samarkand', 'Asia/Tashkent', 'Europe/Vatican', 'America/St_Vincent', 'America/Caracas', 'America/Tortola', 'America/St_Thomas', 'Asia/Ho_Chi_Minh', 'Pacific/Efate', 'Pacific/Wallis', 'Pacific/Apia', 'Asia/Aden', 'Indian/Mayotte', 'Africa/Johannesburg', 'Africa/Lusaka', 'Africa/Harare'];
  var KEY_CURRENT_LOCATION = 'Current_Location';

  var supportsTouch = 'createTouch' in document;
  var supportsSVG = !!(document.createElementNS && document.createElementNS(NS, 'svg').createSVGRect);

  function $(id) {
    return document.getElementById(id);
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
    return attr(document.createElementNS(NS, 'circle'), o);
  }

  function createText(text, o) {
    var element = document.createElementNS(NS, 'text');
    element.appendChild(document.createTextNode(text));
    return attr(element, o);
  }

  function createBoard(x, y, r) {
    var board = document.createElementNS(NS, 'g');

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
      if (typeof element.getBBox !== 'function')
        return;

      var textBBox = element.getBBox();
      var dy = +attr(element, 'y') - (textBBox.y + textBBox.height / 2);
      attr(element, 'dy', dy);
    });
  }

  function createPoint(x, y, r, timelist) {
    var containerElement = document.createElementNS(NS, 'g');
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

  function forEachElement(parent, method) {
    var children = parent.childNodes;
    for (var i = 0, len = children.length; i < len; i++) {
      method(children[i]);
    }
  }

  function forEachTextElement(parent, method) {
    forEachElement(parent, function(element) {
      if (element.nodeName === 'text')
        method(element);
    });
  }

  function isBBoxOverlayed(bb0, bb1) {
    if (((bb0.x < bb1.x && bb0.x + bb0.width > bb1.x) ||
          (bb0.x > bb1.x && bb1.x + bb1.width > bb0.x)) &&
        ((bb0.y < bb1.y && bb0.y + bb0.height > bb1.y) ||
          (bb0.y > bb1.y && bb1.y + bb1.height > bb0.y))) {
      return true;
    }
    return false;
  }

  function shrinkElement(element, width, height, count) {
    var bb = element.getBBox();
    var pattern = 0;

    if ((bb.x < 0 && bb.x + bb.width > 0 && (pattern = 1)) ||
        (bb.x < width && bb.x + bb.width > width && (pattern = 2)) ||
        (bb.y < 0 && bb.y + bb.height > 0 && (pattern = 3)) ||
        (bb.y < height && bb.y + bb.height > height && (pattern = 4))) {
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
      }
    }
  }

  function adjustPointText(point, x, y, r, width, height) {
    var upper_elements = [];
    var down_elements = [];
    var elements = [];

    forEachTextElement(point, function(element) {
      if (typeof element.getBBox !== 'function')
        return;

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

    upper_elements.sort(function(a, b) {
      return (a[1].y < b[1].y) ? -1 : 1;
    });

    var ulen = upper_elements.length;

    for (var i = 0; i < ulen; i++) {
      var item = upper_elements[i];
      var el = item[0];

      for (var j = i + 1; j < ulen; j++) {
        var bb0 = item[1];
        var bb1 = upper_elements[j][1];
        if (isBBoxOverlayed(bb0, bb1)) {
          var dy = +attr(el, 'dy') - ((bb0.y + bb0.height) - bb1.y);
          attr(el, 'dy', dy);
        }
      }

      elements.push([el, el.getBBox()]);
    }

    down_elements.sort(function(a, b) {
      return (a[1].y > b[1].y) ? -1 : 1;
    });

    var dlen = down_elements.length;

    for (var i = 0; i < dlen; i++) {
      var item = down_elements[i];
      var el = item[0];

      for (var j = i + 1; j < dlen; j++) {
        var bb0 = item[1];
        var bb1 = down_elements[j][1];
        if (isBBoxOverlayed(bb0, bb1)) {
          var dy = +attr(el, 'dy') + ((bb1.y + bb1.height) - bb0.y);
          attr(el, 'dy', dy);
        }
      }

      elements.push([el, el.getBBox()]);
    }

    for (var i = 0, len = elements.length; i < len; i++) {
      shrinkElement(elements[i][0], width, height, 0);
    }
  }

  function getTimelist(timezone) {
    var timelist = [];
    var date = new Date();
    var currentTime = date.getTime();
    var currentTimezoneOffset = date.getTimezoneOffset();

    for (var i = 0, len = timezone.length; i < len; i++) {
      var name = timezone[i][0];
      name = name.substring(name.lastIndexOf('/') + 1).replace(/_/g, ' ');
      var time = parseInt(timezone[i][1], 10);
      time = new Date(currentTime + time * 1000 + currentTimezoneOffset * 60 * 1000);
      timelist[i] = [name, time];
    }

    return timelist;
  }

  function selectTimezone(list) {
    timelist.selected = list;
    clock_view.timelist = timelist.get();
    list_view.selected = timelist.selected;
    list_view.update();
  }

  function createTimezoneData() {
    var timezone_data  = {};
    var now = Date.now();

    for (var i = 0, len = TIMEZONE_NAMES.length; i < len; i++) {
      var name = TIMEZONE_NAMES[i];
      timezone_data[name] = moment.tz.zone(name).offset(now) * (-60);
    }

    return timezone_data;
  }

  var listToggle = (function() {
    var isOpen = false;
    return function() {
      var container = $('container');

      if (isOpen)
        attr(container, 'class', null);
      else
        attr(container, 'class', 'open');

      isOpen = !isOpen;
    };
  })();

  function setClockTimer() {
    return setInterval((function() {
      var count = 0;
      var currentHash = '';
      return function() {
        if (count % 100 === 0) {
          clock_view.timelist = timelist.get();
          clock_view.updatePoint();
        }

        var hash = getHashText();
        if (hash !== currentHash) {
          selectTimezone(hash.split(','));
          currentHash = hash;
          clock_view.updatePoint();
        }

        count += 1;
      };
    })(), 100);
  }

  function setTimezoneData() {
    var data = createTimezoneData();
    data[KEY_CURRENT_LOCATION] = new Date().getTimezoneOffset() * (-60);
    timelist.data = data;
    clock_view.timelist = timelist.get();
    list_view.setList(Object.keys(data));
    list_view.selected = timelist.selected;
    list_view.update();
  }

  var timelist = {
    data: null,
    selected: [],
    get: function() {
      if (this.data === null || this.selected.length === 0)
        return [];

      var selected_timezone = [];

      for (var i = 0, len = this.selected.length; i < len; i++) {
        var key = this.selected[i];
        if (key in this.data)
          selected_timezone.push([key, this.data[key]]);
      }

      return getTimelist(selected_timezone);
    }
  };

  var list_view = {
    items: {},
    selected: [],
    current_selected_items: [],
    init: function(element) {
      var self = this;
      self.element = element;
      self.scrolling = false;
      self.clickable = true;

      element.parentNode.onclick = function(event) {
        event.preventDefault();
        if (self.scrolling || !self.clickable) {
          self.scrolling = false;
          self.clickable = true;
          return;
        }
        self.onclick(event);
      };

      element.parentNode.ontouchstart = function() {
        self.clickable = !self.scrolling;
      };

      if (supportsTouch)
        attr(element.parentNode, 'class', 'unscrollable');
    },
    setList: function(list) {
      var element = document.createElement('div');
      var listitems = [];

      for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        if (item !== KEY_CURRENT_LOCATION) {
          var name = item.substring(item.lastIndexOf('/') + 1).replace(/_/g, ' ');
          listitems.push([item, name]);
        }
      }

      listitems.sort(function(a, b) {
        return (a[1] < b[1]) ? -1 : 1;
      });
      listitems.unshift([KEY_CURRENT_LOCATION, 'Current Location']);

      for (var i = 0, len = listitems.length; i < len; i++) {
        var item = document.createElement('div');
        var listitem = listitems[i], key = listitem[0];
        attr(item, {'data-key': key, 'class': 'list-item'});
        item.innerHTML = listitem[1];
        element.appendChild(item);
        this.items[key] = item;
      }

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

        var self = this;

        this.scroll.on('scrollStart', function() {
          self.scrolling = true;
        });

        this.scroll.on('scrollEnd', function() {
          self.scrolling = false;
        });
      }
    },
    update: function() {
      var selected_items = this.current_selected_items;

      for (var i = 0, len = selected_items.length; i < len; i++) {
        var item = selected_items[i];
        attr(item, 'class', 'list-item');
      }

      selected_items = [];

      for (var i = 0, len = this.selected.length; i < len; i++) {
        var item = this.items[this.selected[i]];
        if (item) {
          attr(item, 'class', 'list-item list-selected');
          selected_items.push(item);
        }
      }

      this.current_selected_items = selected_items;
    },
    onclick: function(event) {
      var key = attr(event.target, 'data-key');
      var list = timelist.selected;
      var isAlreadySelected = false;

      for (var i = list.length - 1; i >= 0; i--) {
        if (list[i] === key) {
          isAlreadySelected = true;
          list.splice(i, 1);
        }
      }

      if (!isAlreadySelected)
        list.push(key);

      setHashText(list.join(','));
    }
  };

  var bars_view = {
    init: function(element) {
      element[supportsTouch ? 'ontouchend' : 'onclick'] = function(event) {
        event.preventDefault();
        event.stopPropagation();
        listToggle();
      };
    }
  };

  var clock_view = {
    init: function(element, timelist) {
      var width = 720, height = 720;
      this.element = element;
      this.timelist = timelist;
      this.board_element = document.createElementNS(NS, 'g');
      this.point_element = document.createElementNS(NS, 'g');
      this.element.appendChild(this.board_element);
      this.element.appendChild(this.point_element);
      this.x = width / 2;
      this.y = height / 2,
      this.r = Math.min(width, height) / 2 * 0.6,
      this.width = width;
      this.height = height;

      var self = this;
      element[supportsTouch ? 'ontouchstart' : 'onmousedown'] = function() {
        if (attr(self.element.parentNode.parentNode, 'class') === 'open')
          listToggle();
      };
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
      adjustPointText(new_point, this.x, this.y, this.r, this.width, this.height);
      this.point_element = new_point;
    }
  };

  if (!supportsSVG) {
    attr(document.body, 'class', 'hide');
    alert("Sorry, your browser doesn't support this application.");
    return;
  }

  document.addEventListener('DOMContentLoaded', function() {
    clock_view.init($('clock'), timelist.get());

    var hash = getHashText();
    if (hash)
      selectTimezone(hash.split(','));
    else
      setHashText(DEFAULT_LOCATION);

    list_view.init($('list'));
    bars_view.init($('bars'));
    setTimezoneData();
    setClockTimer();
    clock_view.updateBoard();
    clock_view.updatePoint();
  });

  if (supportsTouch) {
    window.addEventListener('touchmove', function(event) {
      event.preventDefault();
    });
  }
})(this);