(function(global) {
  var window = global.window;
  var document = global.document;

  var NS = 'http://www.w3.org/2000/svg';
  var DOMAIN = 'org.ionstage.loclock';
  var DEFAULT_LOCATION = 'America/New_York,Europe/London,Asia/Tokyo';
  var MOMENT_SCRIPT_URL = '//cdn.jsdelivr.net/momentjs/2.9.0/moment.min.js';
  var MOMENT_TIMEZONE_SCRIPT_URL = '//cdn.jsdelivr.net/momentjs.timezone/0.3.0/moment-timezone-with-data.min.js';
  var TIMEZONE_NAMES = ['Europe/Andorra', 'Asia/Dubai', 'Asia/Kabul', 'America/Antigua', 'America/Anguilla', 'Europe/Tirane', 'Asia/Yerevan', 'Africa/Luanda', 'Antarctica/McMurdo', 'Antarctica/Rothera', 'Antarctica/Palmer', 'Antarctica/Mawson', 'Antarctica/Davis', 'Antarctica/Casey', 'Antarctica/Vostok', 'Antarctica/DumontDUrville', 'Antarctica/Syowa', 'America/Argentina/Buenos_Aires', 'America/Argentina/Cordoba', 'America/Argentina/Salta', 'America/Argentina/Jujuy', 'America/Argentina/Tucuman', 'America/Argentina/Catamarca', 'America/Argentina/La_Rioja', 'America/Argentina/San_Juan', 'America/Argentina/Mendoza', 'America/Argentina/San_Luis', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Ushuaia', 'Pacific/Pago_Pago', 'Europe/Vienna', 'Australia/Lord_Howe', 'Antarctica/Macquarie', 'Australia/Hobart', 'Australia/Currie', 'Australia/Melbourne', 'Australia/Sydney', 'Australia/Broken_Hill', 'Australia/Brisbane', 'Australia/Lindeman', 'Australia/Adelaide', 'Australia/Darwin', 'Australia/Perth', 'Australia/Eucla', 'America/Aruba', 'Europe/Mariehamn', 'Asia/Baku', 'Europe/Sarajevo', 'America/Barbados', 'Asia/Dhaka', 'Europe/Brussels', 'Africa/Ouagadougou', 'Europe/Sofia', 'Asia/Bahrain', 'Africa/Bujumbura', 'Africa/Porto-Novo', 'America/St_Barthelemy', 'Atlantic/Bermuda', 'Asia/Brunei', 'America/La_Paz', 'America/Kralendijk', 'America/Noronha', 'America/Belem', 'America/Fortaleza', 'America/Recife', 'America/Araguaina', 'America/Maceio', 'America/Bahia', 'America/Sao_Paulo', 'America/Campo_Grande', 'America/Cuiaba', 'America/Santarem', 'America/Porto_Velho', 'America/Boa_Vista', 'America/Manaus', 'America/Eirunepe', 'America/Rio_Branco', 'America/Nassau', 'Asia/Thimphu', 'Africa/Gaborone', 'Europe/Minsk', 'America/Belize', 'America/St_Johns', 'America/Halifax', 'America/Glace_Bay', 'America/Moncton', 'America/Goose_Bay', 'America/Blanc-Sablon', 'America/Toronto', 'America/Nipigon', 'America/Thunder_Bay', 'America/Iqaluit', 'America/Pangnirtung', 'America/Resolute', 'America/Atikokan', 'America/Rankin_Inlet', 'America/Winnipeg', 'America/Rainy_River', 'America/Regina', 'America/Swift_Current', 'America/Edmonton', 'America/Cambridge_Bay', 'America/Yellowknife', 'America/Inuvik', 'America/Creston', 'America/Dawson_Creek', 'America/Vancouver', 'America/Whitehorse', 'America/Dawson', 'Indian/Cocos', 'Africa/Kinshasa', 'Africa/Lubumbashi', 'Africa/Bangui', 'Africa/Brazzaville', 'Europe/Zurich', 'Africa/Abidjan', 'Pacific/Rarotonga', 'America/Santiago', 'Pacific/Easter', 'Africa/Douala', 'Asia/Shanghai', 'Asia/Harbin', 'Asia/Chongqing', 'Asia/Urumqi', 'Asia/Kashgar', 'America/Bogota', 'America/Costa_Rica', 'America/Havana', 'Atlantic/Cape_Verde', 'America/Curacao', 'Indian/Christmas', 'Asia/Nicosia', 'Europe/Prague', 'Europe/Berlin', 'Europe/Busingen', 'Africa/Djibouti', 'Europe/Copenhagen', 'America/Dominica', 'America/Santo_Domingo', 'Africa/Algiers', 'America/Guayaquil', 'Pacific/Galapagos', 'Europe/Tallinn', 'Africa/Cairo', 'Africa/El_Aaiun', 'Africa/Asmara', 'Europe/Madrid', 'Africa/Ceuta', 'Atlantic/Canary', 'Africa/Addis_Ababa', 'Europe/Helsinki', 'Pacific/Fiji', 'Atlantic/Stanley', 'Pacific/Chuuk', 'Pacific/Pohnpei', 'Pacific/Kosrae', 'Atlantic/Faroe', 'Europe/Paris', 'Africa/Libreville', 'Europe/London', 'America/Grenada', 'Asia/Tbilisi', 'America/Cayenne', 'Europe/Guernsey', 'Africa/Accra', 'Europe/Gibraltar', 'America/Godthab', 'America/Danmarkshavn', 'America/Scoresbysund', 'America/Thule', 'Africa/Banjul', 'Africa/Conakry', 'America/Guadeloupe', 'Africa/Malabo', 'Europe/Athens', 'Atlantic/South_Georgia', 'America/Guatemala', 'Pacific/Guam', 'Africa/Bissau', 'America/Guyana', 'Asia/Hong_Kong', 'America/Tegucigalpa', 'Europe/Zagreb', 'America/Port-au-Prince', 'Europe/Budapest', 'Asia/Jakarta', 'Asia/Pontianak', 'Asia/Makassar', 'Asia/Jayapura', 'Europe/Dublin', 'Asia/Jerusalem', 'Europe/Isle_of_Man', 'Asia/Kolkata', 'Indian/Chagos', 'Asia/Baghdad', 'Asia/Tehran', 'Atlantic/Reykjavik', 'Europe/Rome', 'Europe/Jersey', 'America/Jamaica', 'Asia/Amman', 'Asia/Tokyo', 'Africa/Nairobi', 'Asia/Bishkek', 'Asia/Phnom_Penh', 'Pacific/Tarawa', 'Pacific/Enderbury', 'Pacific/Kiritimati', 'Indian/Comoro', 'America/St_Kitts', 'Asia/Pyongyang', 'Asia/Seoul', 'Asia/Kuwait', 'America/Cayman', 'Asia/Almaty', 'Asia/Qyzylorda', 'Asia/Aqtobe', 'Asia/Aqtau', 'Asia/Oral', 'Asia/Vientiane', 'Asia/Beirut', 'America/St_Lucia', 'Europe/Vaduz', 'Asia/Colombo', 'Africa/Monrovia', 'Africa/Maseru', 'Europe/Vilnius', 'Europe/Luxembourg', 'Europe/Riga', 'Africa/Tripoli', 'Africa/Casablanca', 'Europe/Monaco', 'Europe/Chisinau', 'Europe/Podgorica', 'America/Marigot', 'Indian/Antananarivo', 'Pacific/Majuro', 'Pacific/Kwajalein', 'Europe/Skopje', 'Africa/Bamako', 'Asia/Rangoon', 'Asia/Ulaanbaatar', 'Asia/Hovd', 'Asia/Choibalsan', 'Asia/Macau', 'Pacific/Saipan', 'America/Martinique', 'Africa/Nouakchott', 'America/Montserrat', 'Europe/Malta', 'Indian/Mauritius', 'Indian/Maldives', 'Africa/Blantyre', 'America/Mexico_City', 'America/Cancun', 'America/Merida', 'America/Monterrey', 'America/Matamoros', 'America/Mazatlan', 'America/Chihuahua', 'America/Ojinaga', 'America/Hermosillo', 'America/Tijuana', 'America/Santa_Isabel', 'America/Bahia_Banderas', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Africa/Maputo', 'Africa/Windhoek', 'Pacific/Noumea', 'Africa/Niamey', 'Pacific/Norfolk', 'Africa/Lagos', 'America/Managua', 'Europe/Amsterdam', 'Europe/Oslo', 'Asia/Kathmandu', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Auckland', 'Pacific/Chatham', 'Asia/Muscat', 'America/Panama', 'America/Lima', 'Pacific/Tahiti', 'Pacific/Marquesas', 'Pacific/Gambier', 'Pacific/Port_Moresby', 'Asia/Manila', 'Asia/Karachi', 'Europe/Warsaw', 'America/Miquelon', 'Pacific/Pitcairn', 'America/Puerto_Rico', 'Asia/Gaza', 'Asia/Hebron', 'Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores', 'Pacific/Palau', 'America/Asuncion', 'Asia/Qatar', 'Indian/Reunion', 'Europe/Bucharest', 'Europe/Belgrade', 'Europe/Kaliningrad', 'Europe/Moscow', 'Europe/Volgograd', 'Europe/Samara', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Novokuznetsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Yakutsk', 'Asia/Khandyga', 'Asia/Vladivostok', 'Asia/Sakhalin', 'Asia/Ust-Nera', 'Asia/Magadan', 'Asia/Kamchatka', 'Asia/Anadyr', 'Africa/Kigali', 'Asia/Riyadh', 'Pacific/Guadalcanal', 'Indian/Mahe', 'Africa/Khartoum', 'Europe/Stockholm', 'Asia/Singapore', 'Atlantic/St_Helena', 'Europe/Ljubljana', 'Arctic/Longyearbyen', 'Europe/Bratislava', 'Africa/Freetown', 'Europe/San_Marino', 'Africa/Dakar', 'Africa/Mogadishu', 'America/Paramaribo', 'Africa/Juba', 'Africa/Sao_Tome', 'America/El_Salvador', 'America/Lower_Princes', 'Asia/Damascus', 'Africa/Mbabane', 'America/Grand_Turk', 'Africa/Ndjamena', 'Indian/Kerguelen', 'Africa/Lome', 'Asia/Bangkok', 'Asia/Dushanbe', 'Pacific/Fakaofo', 'Asia/Dili', 'Asia/Ashgabat', 'Africa/Tunis', 'Pacific/Tongatapu', 'Europe/Istanbul', 'America/Port_of_Spain', 'Pacific/Funafuti', 'Asia/Taipei', 'Africa/Dar_es_Salaam', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye', 'Europe/Simferopol', 'Africa/Kampala', 'Pacific/Johnston', 'Pacific/Midway', 'Pacific/Wake', 'America/New_York', 'America/Detroit', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/Indiana/Indianapolis', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Vevay', 'America/Chicago', 'America/Indiana/Tell_City', 'America/Indiana/Knox', 'America/Menominee', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/North_Dakota/Beulah', 'America/Denver', 'America/Boise', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'America/Juneau', 'America/Sitka', 'America/Yakutat', 'America/Nome', 'America/Adak', 'America/Metlakatla', 'Pacific/Honolulu', 'America/Montevideo', 'Asia/Samarkand', 'Asia/Tashkent', 'Europe/Vatican', 'America/St_Vincent', 'America/Caracas', 'America/Tortola', 'America/St_Thomas', 'Asia/Ho_Chi_Minh', 'Pacific/Efate', 'Pacific/Wallis', 'Pacific/Apia', 'Asia/Aden', 'Indian/Mayotte', 'Africa/Johannesburg', 'Africa/Lusaka', 'Africa/Harare'];
  var KEY_TIMEZONE_LAST_LOADTIME = 'timezone-last-load-time';
  var KEY_TIMEZONE_DATA = 'timezone-data';
  var KEY_CURRENT_LOCATION = 'Current_Location';

  function $(id) {
    return document.getElementById(id);
  }

  function attr(element, o) {
    if (typeof o === 'string') {
      return element.getAttribute(o);
    }
    for (var key in o) {
      element.setAttribute(key, o[key]);
    }
    return element;
  }

  function supportsTouch() {
    return (document && 'createTouch' in document) || false;
  }

  function isSVGEnabled() {
    return !!(document.createElementNS &&
              document.createElementNS(NS, 'svg').createSVGRect);
  }

  function loadScript(path, callback) {
    var script = document.getElementsByTagName('script')[0],
      new_script = document.createElement('script');
    new_script.src = path;
    new_script.onload = function() {
      if (typeof callback === 'function') {
        callback();
      }
    };
    new_script.onreadystatechange = function() {
      if (this.readyState === 'loaded' || this.readyState === 'complete'){
        if (typeof callback === 'function') {
          callback();
        }
      }
    };
    script.parentNode.insertBefore(new_script, script);
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

  function getCache(key) {
    return localStorage[DOMAIN + '.' + key];
  }

  function setCache(key, value) {
    try {
      localStorage[DOMAIN + '.' + key] = value;
    } catch (e) { /* do nothing */ }
  }

  function getCurrentTime() {
    return Math.floor(new Date().getTime() / 1000);
  }

  function createCircle(o) {
    return attr(document.createElementNS(NS, 'circle'), o);
  }

  function createText(text, o) {
    var doc = document, element = doc.createElementNS(NS, 'text');
    element.appendChild(doc.createTextNode(text));
    return attr(element, o);
  }

  function getText(element) {
    return element.childNodes[0].textContent;
  }

  function changeText(element, text) {
    element.replaceChild(document.createTextNode(text), element.childNodes[0]);
    return element;
  }

  function createBoard(x, y, r) {
    var board = document.createElementNS(NS, 'g');
    var i, len, dif = Math.PI / 12, deg = 0,
        text, fontSize, rate, time, dif_x, dif_y;
    board.appendChild(createCircle({cx: x, cy: y, r: r,
                    'stroke-width': (r / 30).toFixed(1),
                    'class': 'board-circle'}));
    board.appendChild(createCircle({cx: x, cy: y, r: (r / 45).toFixed(1),
                    'fill': 'black'}));
    for (i = 0; i < 24; i += 1) {
      text = (i % 3 === 0) ? String((i - 6 >= 0) ? i - 6 : i + 18) : '・';
      fontSize = (text === '・') ? r / 12 : r / 4.5;
      rate = (text === '18' || text === '15' || text === '21') ? 0.04 : 0;
      dif_x = r * (0.8 - Math.abs(rate * Math.cos(deg))) * Math.cos(deg);
      dif_y = r * (0.8 - Math.abs(rate * Math.sin(deg))) * Math.sin(deg);
      board.appendChild(createText(text, {x: (x + dif_x).toFixed(1),
                        y: (y + dif_y).toFixed(1),
                        'font-size': fontSize.toFixed(),
                        'class': 'board-text'}));
      deg += dif;
    }
    return board;
  }

  function adjustBoard(board) {
    forEachTextElement(board, function(element) {
      if (typeof element.getBBox === 'function') {
        var textBBox = element.getBBox(),
          dy = Number(attr(element, 'y')) - (textBBox.y + textBBox.height / 2);
        attr(element, {dy: dy});
      }
    });
  }

  function createPoint(x, y, r, timelist) {
    var i, len, name, time, deg,
        text, textBBox, textPoint,
        textList = {}, fontSize = (r / 8).toFixed();
    var point = document.createElementNS(NS, 'g');
    for (i = 0, len = timelist.length; i < len; i += 1) {
      name = timelist[i][0];
      time = timelist[i][1];
      deg = (time.getHours() + time.getMinutes() / 60) /
            24 * (Math.PI * 2) + Math.PI / 2;
      point.appendChild(createCircle({cx: (x + r * Math.cos(deg)).toFixed(1),
                      cy: (y + r * Math.sin(deg)).toFixed(1),
                      r: (r / 20).toFixed(1),
                      'stroke-width': (r / 90).toFixed(1),
                      'class': 'point-circle'}));
      textPoint = {x: x + r * Math.cos(deg), y: y + r * Math.sin(deg)};
      text = textList[time.getTime()];
      if (text) {
        changeText(text, getText(text) + ', ' + name);
      } else {
        text = createText(name, {x: textPoint.x, y: textPoint.y,
                     'font-size': fontSize,
                     'class': 'point-text'});
        point.appendChild(text);
        textList[time.getTime()] = text;
        text.deg = deg;
      }
    }
    return point;
  }

  function forEachElement(parent, method) {
    var children = parent.childNodes;
    for (var i = 0, len = children.length; i < len; i += 1) {
      method(children[i]);
    }
  }

  function forEachTextElement(parent, method) {
    forEachElement(parent, function(element) {
      if (element.nodeName === 'text') {
        method(element);
      }
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
    var bb = element.getBBox(), isOverflow = false, pattern = 0, newbb, value;
    if ((bb.x < 0 && bb.x + bb.width > 0 && (pattern = 1)) ||
        (bb.x < width && bb.x + bb.width > width && (pattern = 2)) ||
        (bb.y < 0 && bb.y + bb.height > 0 && (pattern = 3)) ||
        (bb.y < height && bb.y + bb.height > height && (pattern = 4))) {
      attr(element, {'font-size': Number(attr(element, 'font-size')) / 1.5});
      newbb = element.getBBox();
      switch (pattern) {
        case 1:
          value = bb.x + bb.width - (newbb.x + newbb.width);
          attr(element, {x: Number(attr(element, 'x')) + value});
          break;
        case 2:
          value = newbb.x - bb.x;
          attr(element, {x: Number(attr(element, 'x')) - value});
          break;
        case 3:
          value = bb.y + bb.height - (newbb.y + newbb.height);
          attr(element, {y: Number(attr(element, 'y')) + value});
          break;
        case 4:
          value = newbb.y - bb.y;
          attr(element, {y: Number(attr(element, 'y')) - value});
          break;
        default:
      }
    }
    if (isOverflow && count < 20) {
      count += 1;
      shrinkElement(element, width, height, count);
    }
  }

  function adjustPointText(point, x, y, r, width, height) {
    var upper_elements = [], down_elements = [],
        i, j, len, item, el, bb0, bb1, dy, elements = [];
    forEachTextElement(point, function(element) {
      if (typeof element.getBBox === 'function') {
        var textBBox = element.getBBox(), deg = Number(element.deg),
          dy = Number(attr(element, 'y')) - (textBBox.y + textBBox.height / 2),
          property = {x: x + (r + textBBox.width / 2 + r / 8) * Math.cos(deg),
                y: y + (r + textBBox.height / 2 + r / 8) * Math.sin(deg),
                dy: dy};
        attr(element, property);
        textBBox = element.getBBox();
        if (textBBox.y + textBBox.height / 2 < y) {
          upper_elements.push([element, textBBox]);
        } else {
          down_elements.push([element, textBBox]);
        }
      }
    });
    upper_elements.sort(function(a, b) {
      return (a[1].y < b[1].y) ? -1 : 1;
    });
    len = upper_elements.length;
    for (i = 0; i < len; i += 1) {
      item = upper_elements[i], el = item[0];
      for (j = i + 1; j < len; j += 1) {
        bb0 = item[1];
        bb1 = upper_elements[j][1];
        if (isBBoxOverlayed(bb0, bb1)) {
          dy = Number(attr(el, 'dy')) - ((bb0.y + bb0.height) - bb1.y);
          attr(el, {dy: dy});
        }
      }
      elements.push([el, el.getBBox()]);
    }
    down_elements.sort(function(a, b) {
      return (a[1].y > b[1].y) ? -1 : 1;
    });
    len = down_elements.length;
    for (i = 0; i < len; i += 1) {
      item = down_elements[i], el = item[0];
      for (j = i + 1; j < len; j += 1) {
        bb0 = item[1];
        bb1 = down_elements[j][1];
        if (isBBoxOverlayed(bb0, bb1)) {
          dy = Number(attr(el, 'dy')) + ((bb1.y + bb1.height) - bb0.y);
          attr(el, {dy: dy});
        }
      }
      elements.push([el, el.getBBox()]);
    }
    for (i = 0, len = elements.length; i < len; i += 1) {
      shrinkElement(elements[i][0], width, height, 0);
    }
  }

  function getTimelist(timezone) {
    var i, len, timelist = [], name, time, date = new Date(),
      currentTime = date.getTime(),
      currentTimezoneOffset = date.getTimezoneOffset();
    for (i = 0, len = timezone.length; i < len; ++i) {
      name = timezone[i][0];
      name = name.substring(name.lastIndexOf('/') + 1).replace(/_/g, ' ');
      time = parseInt(timezone[i][1], 10);
      time = new Date(currentTime + time * 1000 +
                      currentTimezoneOffset * 60 * 1000);
      timelist[i] = [name, time];
    }
    return timelist;
  }

  function selectTimezone(list) {
    timelist.selected = list;
    clock_view.timelist = timelist.get();
    list_view.selected = timelist.selected;
    list_view.update();
    updateClock();
  }

  function updateClock() {
    if (timelist.isDataLoaded) {
      clock_view.updatePoint();
    }
  }

  function loadTimezoneData(callback) {
    loadScript(MOMENT_SCRIPT_URL, function() {
      loadScript(MOMENT_TIMEZONE_SCRIPT_URL, function() {
        var timezone_data  = {}, i, len, name;
        var now = Date.now();
        for (i = 0, len = TIMEZONE_NAMES.length; i < len; i += 1) {
          name = TIMEZONE_NAMES[i];
          timezone_data[name] = moment.tz.zone(name).offset(now) * (-60);
        }
        if (typeof callback === 'function') {
          callback(timezone_data);
        }
      });
    });
  }

  function onTimezoneLoad(data) {
    setCache(KEY_TIMEZONE_LAST_LOADTIME, getCurrentTime());
    setCache(KEY_TIMEZONE_DATA, JSON.stringify(data));
  }

  function loadTimezone() {
    var timezone_data = getCache(KEY_TIMEZONE_DATA);
    var last_load_time = getCache(KEY_TIMEZONE_LAST_LOADTIME);
    if (!timezone_data) {
      clock_view.state('loading');
      loadTimezoneData(function(data) {
        onTimezoneLoad(data);
        setTimezoneData(data);
        clock_view.state('loaded');
      });
    } else {
      setTimezoneData(JSON.parse(timezone_data));
      if (getCurrentTime() - last_load_time > 43200) {
        loadTimezoneData(onTimezoneLoad);
      }
    }
  }

  function listToggle(isOpen) {
    if (isOpen) {
      side_panel_view.open();
      clock_view.open();
    } else {
      side_panel_view.close();
      clock_view.close();
    }
    updateClock();
  }

  function setClockTimer() {
    return setInterval((function() {
      var count = 0, currentHash = '';
      return function() {
        if (count % 100 === 0) {
          clock_view.timelist = timelist.get();
          updateClock();
        }
        var hash = getHashText();
        if (hash !== currentHash) {
          selectTimezone(hash.split(','));
          currentHash = hash;
        }
        count += 1;
      };
    }()), 100);
  }

  function setTimezoneData(data) {
    data[KEY_CURRENT_LOCATION] = new Date().getTimezoneOffset() * (-60);
    timelist.data = data;
    clock_view.timelist = timelist.get();
    timelist.isDataLoaded = true;
    updateClock();
    list_view.setList(Object.keys(data));
    list_view.selected = timelist.selected;
    list_view.update();
  }

  var timelist = {
    data: null,
    selected: [],
    get: function() {
      if (this.data === null || this.selected.length === 0) {
        return [];
      }
      var selected_timezone = [], i, len, key;
      for (i = 0, len = this.selected.length; i < len; i += 1) {
        key = this.selected[i];
        if (key in this.data) {
          selected_timezone.push([key, this.data[key]]);
        }
      }
      return getTimelist(selected_timezone);
    },
    isDataLoaded: false
  };

  var side_panel_view = {
    init: function(element) {
      this.element = element;
    },
    open: function() {
      this.element.setAttribute('class', 'open');
    },
    close: function() {
      this.element.setAttribute('class', 'close');
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
      element.onclick = function(event) {
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
      if (supportsTouch()) {
        element.parentNode.style.overflowY = 'hidden';
      }
    },
    setList: function(list) {
      var element = document.createElement('div'),
          item, name, listitems = [], listitem, i, len;
      for (i = 0, len = list.length; i < len; i += 1) {
        item = list[i];
        if (item !== KEY_CURRENT_LOCATION) {
          name = item.substring(item.lastIndexOf('/') + 1).replace(/_/g, ' ');
          listitems.push([item, name]);
        }
      }
      listitems.sort(function(a, b) { return (a[1] < b[1]) ? -1 : 1; });
      listitems.unshift([KEY_CURRENT_LOCATION, 'Current Location']);
      for (i = 0, len = listitems.length; i < len; i += 1) {
        item = document.createElement('div'),
        listitem = listitems[i], key = listitem[0];
        attr(item, {'data-key': key, 'class': 'list-item'});
        item.innerHTML = listitem[1];
        element.appendChild(item);
        this.items[key] = item;
      }
      this.element.parentNode.replaceChild(element, this.element);
      element.onclick = this.element.onclick;
      this.element.onclick = null;
      this.element = element;
      if (supportsTouch()) {
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
      var i, len, selected_items = this.current_selected_items, item;
      for (i = 0, len = selected_items.length; i < len; i += 1) {
        item = selected_items[i];
        attr(item, {'class': 'list-item'});
      }
      selected_items = [];
      for (i = 0, len = this.selected.length; i < len; i += 1) {
        item = this.items[this.selected[i]];
        if (item) {
          attr(item, {'class': 'list-selected'});
          selected_items.push(item);
        }
      }
      this.current_selected_items = selected_items;
    },
    onclick: function(event) {
      var key = attr(event.target, 'data-key'),
          list = timelist.selected, i, isAlreadySelected = false;
      for (i = list.length - 1; i >= 0; i -= 1) {
        if (list[i] === key) {
          isAlreadySelected = true;
          list.splice(i, 1);
        }
      }
      (!isAlreadySelected) && list.push(key);
      setHashText(list.join(','));
    }
  };

  var border_view = {
    init: function(element) {
      var self = this;
      self.element = element;
      element.onclick = function(event) {
        if (!supportsTouch()) {
          self.element.onmouseout(event);
        }
        self.onclick(event);
      };
      if (supportsTouch()) {
        element.ontouchmove = function(event) {
          event.stopPropagation();
        };
      } else {
        element.onmouseover = function(event) {
          document.body.style.cursor = 'pointer';
          event.currentTarget.style.opacity = 0.6;
        };
        element.onmouseout = function(event) {
          document.body.style.cursor = 'default';
          event.currentTarget.style.opacity = 1;
        };
      }
    },
    onclick: (function() {
      var isOpen = false;
      return function() {
        listToggle(isOpen);
        isOpen = !isOpen;
      };
    })()
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
      adjustPointText(new_point, this.x, this.y, this.r,
                      this.width, this.height);
      this.point_element = new_point;
    },
    open: function() {
      this.element.parentNode.setAttribute('class', 'open');
    },
    close: function() {
      this.element.parentNode.setAttribute('class', 'close');
    },
    state: function(value) {
      this.element.setAttribute('class', value);
    }
  };

  if (!isSVGEnabled()) {
    document.body.style.display = 'none';
    alert("Sorry, your browser doesn't support this application.");
    return;
  }

  document.addEventListener('DOMContentLoaded', function() {
    clock_view.init($('clock'), timelist.get());
    var hash = getHashText();
    if (hash) {
      selectTimezone(hash.split(','));
    } else {
      setHashText(DEFAULT_LOCATION);
    }
    side_panel_view.init($('side-panel'));
    list_view.init($('list'));
    border_view.init($('border'));
    border_view.onclick();
    setClockTimer();
    loadTimezone();
    clock_view.updateBoard();
    updateClock();
  });

  window.addEventListener('resize', function() {
    updateClock();
  });

  if (supportsTouch()) {
    window.addEventListener('touchmove', function(event) {
      event.preventDefault();
    });
  }
})(this);