(function() {
  'use strict';
  var IScroll = require('iscroll');
  var Base64 = require('js-base64').Base64;
  var moment = require('moment-timezone');

  var NS_SVG = 'http://www.w3.org/2000/svg';
  var DEFAULT_LOCATIONS = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];
  var TZ_TIMEZONE_NAMES = ['Europe/Andorra', 'Asia/Dubai', 'Asia/Kabul', 'America/Antigua', 'America/Anguilla', 'Europe/Tirane', 'Asia/Yerevan', 'Africa/Luanda', 'Antarctica/McMurdo', 'Antarctica/Rothera', 'Antarctica/Palmer', 'Antarctica/Mawson', 'Antarctica/Davis', 'Antarctica/Casey', 'Antarctica/Vostok', 'Antarctica/DumontDUrville', 'Antarctica/Syowa', 'America/Argentina/Buenos_Aires', 'America/Argentina/Cordoba', 'America/Argentina/Salta', 'America/Argentina/Jujuy', 'America/Argentina/Tucuman', 'America/Argentina/Catamarca', 'America/Argentina/La_Rioja', 'America/Argentina/San_Juan', 'America/Argentina/Mendoza', 'America/Argentina/San_Luis', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Ushuaia', 'Pacific/Pago_Pago', 'Europe/Vienna', 'Australia/Lord_Howe', 'Antarctica/Macquarie', 'Australia/Hobart', 'Australia/Currie', 'Australia/Melbourne', 'Australia/Sydney', 'Australia/Broken_Hill', 'Australia/Brisbane', 'Australia/Lindeman', 'Australia/Adelaide', 'Australia/Darwin', 'Australia/Perth', 'Australia/Eucla', 'America/Aruba', 'Europe/Mariehamn', 'Asia/Baku', 'Europe/Sarajevo', 'America/Barbados', 'Asia/Dhaka', 'Europe/Brussels', 'Africa/Ouagadougou', 'Europe/Sofia', 'Asia/Bahrain', 'Africa/Bujumbura', 'Africa/Porto-Novo', 'America/St_Barthelemy', 'Atlantic/Bermuda', 'Asia/Brunei', 'America/La_Paz', 'America/Kralendijk', 'America/Noronha', 'America/Belem', 'America/Fortaleza', 'America/Recife', 'America/Araguaina', 'America/Maceio', 'America/Bahia', 'America/Sao_Paulo', 'America/Campo_Grande', 'America/Cuiaba', 'America/Santarem', 'America/Porto_Velho', 'America/Boa_Vista', 'America/Manaus', 'America/Eirunepe', 'America/Rio_Branco', 'America/Nassau', 'Asia/Thimphu', 'Africa/Gaborone', 'Europe/Minsk', 'America/Belize', 'America/St_Johns', 'America/Halifax', 'America/Glace_Bay', 'America/Moncton', 'America/Goose_Bay', 'America/Blanc-Sablon', 'America/Toronto', 'America/Nipigon', 'America/Thunder_Bay', 'America/Iqaluit', 'America/Pangnirtung', 'America/Resolute', 'America/Atikokan', 'America/Rankin_Inlet', 'America/Winnipeg', 'America/Rainy_River', 'America/Regina', 'America/Swift_Current', 'America/Edmonton', 'America/Cambridge_Bay', 'America/Yellowknife', 'America/Inuvik', 'America/Creston', 'America/Dawson_Creek', 'America/Vancouver', 'America/Whitehorse', 'America/Dawson', 'Indian/Cocos', 'Africa/Kinshasa', 'Africa/Lubumbashi', 'Africa/Bangui', 'Africa/Brazzaville', 'Europe/Zurich', 'Africa/Abidjan', 'Pacific/Rarotonga', 'America/Santiago', 'Pacific/Easter', 'Africa/Douala', 'Asia/Shanghai', 'Asia/Harbin', 'Asia/Chongqing', 'Asia/Urumqi', 'Asia/Kashgar', 'America/Bogota', 'America/Costa_Rica', 'America/Havana', 'Atlantic/Cape_Verde', 'America/Curacao', 'Indian/Christmas', 'Asia/Nicosia', 'Europe/Prague', 'Europe/Berlin', 'Europe/Busingen', 'Africa/Djibouti', 'Europe/Copenhagen', 'America/Dominica', 'America/Santo_Domingo', 'Africa/Algiers', 'America/Guayaquil', 'Pacific/Galapagos', 'Europe/Tallinn', 'Africa/Cairo', 'Africa/El_Aaiun', 'Africa/Asmara', 'Europe/Madrid', 'Africa/Ceuta', 'Atlantic/Canary', 'Africa/Addis_Ababa', 'Europe/Helsinki', 'Pacific/Fiji', 'Atlantic/Stanley', 'Pacific/Chuuk', 'Pacific/Pohnpei', 'Pacific/Kosrae', 'Atlantic/Faroe', 'Europe/Paris', 'Africa/Libreville', 'Europe/London', 'America/Grenada', 'Asia/Tbilisi', 'America/Cayenne', 'Europe/Guernsey', 'Africa/Accra', 'Europe/Gibraltar', 'America/Godthab', 'America/Danmarkshavn', 'America/Scoresbysund', 'America/Thule', 'Africa/Banjul', 'Africa/Conakry', 'America/Guadeloupe', 'Africa/Malabo', 'Europe/Athens', 'Atlantic/South_Georgia', 'America/Guatemala', 'Pacific/Guam', 'Africa/Bissau', 'America/Guyana', 'Asia/Hong_Kong', 'America/Tegucigalpa', 'Europe/Zagreb', 'America/Port-au-Prince', 'Europe/Budapest', 'Asia/Jakarta', 'Asia/Pontianak', 'Asia/Makassar', 'Asia/Jayapura', 'Europe/Dublin', 'Asia/Jerusalem', 'Europe/Isle_of_Man', 'Asia/Kolkata', 'Indian/Chagos', 'Asia/Baghdad', 'Asia/Tehran', 'Atlantic/Reykjavik', 'Europe/Rome', 'Europe/Jersey', 'America/Jamaica', 'Asia/Amman', 'Asia/Tokyo', 'Africa/Nairobi', 'Asia/Bishkek', 'Asia/Phnom_Penh', 'Pacific/Tarawa', 'Pacific/Enderbury', 'Pacific/Kiritimati', 'Indian/Comoro', 'America/St_Kitts', 'Asia/Pyongyang', 'Asia/Seoul', 'Asia/Kuwait', 'America/Cayman', 'Asia/Almaty', 'Asia/Qyzylorda', 'Asia/Aqtobe', 'Asia/Aqtau', 'Asia/Oral', 'Asia/Vientiane', 'Asia/Beirut', 'America/St_Lucia', 'Europe/Vaduz', 'Asia/Colombo', 'Africa/Monrovia', 'Africa/Maseru', 'Europe/Vilnius', 'Europe/Luxembourg', 'Europe/Riga', 'Africa/Tripoli', 'Africa/Casablanca', 'Europe/Monaco', 'Europe/Chisinau', 'Europe/Podgorica', 'America/Marigot', 'Indian/Antananarivo', 'Pacific/Majuro', 'Pacific/Kwajalein', 'Europe/Skopje', 'Africa/Bamako', 'Asia/Rangoon', 'Asia/Ulaanbaatar', 'Asia/Hovd', 'Asia/Choibalsan', 'Asia/Macau', 'Pacific/Saipan', 'America/Martinique', 'Africa/Nouakchott', 'America/Montserrat', 'Europe/Malta', 'Indian/Mauritius', 'Indian/Maldives', 'Africa/Blantyre', 'America/Mexico_City', 'America/Cancun', 'America/Merida', 'America/Monterrey', 'America/Matamoros', 'America/Mazatlan', 'America/Chihuahua', 'America/Ojinaga', 'America/Hermosillo', 'America/Tijuana', 'America/Santa_Isabel', 'America/Bahia_Banderas', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Africa/Maputo', 'Africa/Windhoek', 'Pacific/Noumea', 'Africa/Niamey', 'Pacific/Norfolk', 'Africa/Lagos', 'America/Managua', 'Europe/Amsterdam', 'Europe/Oslo', 'Asia/Kathmandu', 'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Auckland', 'Pacific/Chatham', 'Asia/Muscat', 'America/Panama', 'America/Lima', 'Pacific/Tahiti', 'Pacific/Marquesas', 'Pacific/Gambier', 'Pacific/Port_Moresby', 'Asia/Manila', 'Asia/Karachi', 'Europe/Warsaw', 'America/Miquelon', 'Pacific/Pitcairn', 'America/Puerto_Rico', 'Asia/Gaza', 'Asia/Hebron', 'Europe/Lisbon', 'Atlantic/Madeira', 'Atlantic/Azores', 'Pacific/Palau', 'America/Asuncion', 'Asia/Qatar', 'Indian/Reunion', 'Europe/Bucharest', 'Europe/Belgrade', 'Europe/Kaliningrad', 'Europe/Moscow', 'Europe/Volgograd', 'Europe/Samara', 'Asia/Yekaterinburg', 'Asia/Omsk', 'Asia/Novosibirsk', 'Asia/Novokuznetsk', 'Asia/Krasnoyarsk', 'Asia/Irkutsk', 'Asia/Yakutsk', 'Asia/Khandyga', 'Asia/Vladivostok', 'Asia/Sakhalin', 'Asia/Ust-Nera', 'Asia/Magadan', 'Asia/Kamchatka', 'Asia/Anadyr', 'Africa/Kigali', 'Asia/Riyadh', 'Pacific/Guadalcanal', 'Indian/Mahe', 'Africa/Khartoum', 'Europe/Stockholm', 'Asia/Singapore', 'Atlantic/St_Helena', 'Europe/Ljubljana', 'Arctic/Longyearbyen', 'Europe/Bratislava', 'Africa/Freetown', 'Europe/San_Marino', 'Africa/Dakar', 'Africa/Mogadishu', 'America/Paramaribo', 'Africa/Juba', 'Africa/Sao_Tome', 'America/El_Salvador', 'America/Lower_Princes', 'Asia/Damascus', 'Africa/Mbabane', 'America/Grand_Turk', 'Africa/Ndjamena', 'Indian/Kerguelen', 'Africa/Lome', 'Asia/Bangkok', 'Asia/Dushanbe', 'Pacific/Fakaofo', 'Asia/Dili', 'Asia/Ashgabat', 'Africa/Tunis', 'Pacific/Tongatapu', 'Europe/Istanbul', 'America/Port_of_Spain', 'Pacific/Funafuti', 'Asia/Taipei', 'Africa/Dar_es_Salaam', 'Europe/Kiev', 'Europe/Uzhgorod', 'Europe/Zaporozhye', 'Europe/Simferopol', 'Africa/Kampala', 'Pacific/Johnston', 'Pacific/Midway', 'Pacific/Wake', 'America/New_York', 'America/Detroit', 'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/Indiana/Indianapolis', 'America/Indiana/Vincennes', 'America/Indiana/Winamac', 'America/Indiana/Marengo', 'America/Indiana/Petersburg', 'America/Indiana/Vevay', 'America/Chicago', 'America/Indiana/Tell_City', 'America/Indiana/Knox', 'America/Menominee', 'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/North_Dakota/Beulah', 'America/Denver', 'America/Boise', 'America/Phoenix', 'America/Los_Angeles', 'America/Anchorage', 'America/Juneau', 'America/Sitka', 'America/Yakutat', 'America/Nome', 'America/Adak', 'America/Metlakatla', 'Pacific/Honolulu', 'America/Montevideo', 'Asia/Samarkand', 'Asia/Tashkent', 'Europe/Vatican', 'America/St_Vincent', 'America/Caracas', 'America/Tortola', 'America/St_Thomas', 'Asia/Ho_Chi_Minh', 'Pacific/Efate', 'Pacific/Wallis', 'Pacific/Apia', 'Asia/Aden', 'Indian/Mayotte', 'Africa/Johannesburg', 'Africa/Lusaka', 'Africa/Harare'];
  var ADDITIONAL_TIMEZONE_NAMES = ['Asia/Dubai#/Abu Dhabi', 'Africa/Lagos#/Abuja', 'America/Pangnirtung#/Alert', 'Australia/Darwin#/Alice Springs', 'Europe/Istanbul#/Ankara', 'America/New_York#/Atlanta', 'America/Rankin_Inlet#/Baker Lake', 'Asia/Kolkata#/Bangalore', 'Europe/Madrid#/Barcelona', 'Asia/Shanghai#/Beijing', 'Europe/Zurich#/Bern', 'America/New_York#/Boston', 'America/Sao_Paulo#/Brasilia', 'Australia/Brisbane#/Cairns', 'America/Edmonton#/Calgary', 'Australia/Sydney#/Canberra', 'Africa/Johannesburg#/Cape Town', 'Europe/London#/Cardiff', 'America/St_Lucia#/Castries', 'Asia/Kolkata#/Chennai', 'Asia/Chita#/Chita', 'America/Coral_Harbour#/Coral Harbour', 'America/Chicago#/Dallas', 'Asia/Makassar#/Denpasar', 'Africa/Dar_es_Salaam#/Dodoma', 'Europe/London#/Edinburgh', 'America/Los_Angeles#/Eureka', 'America/Anchorage#/Fairbanks', 'Europe/Berlin#/Frankfurt', 'Africa/Bujumbura#/Gitega', 'Pacific/Guadalcanal#/Gizo', 'America/Iqaluit#/Grise Fiord', 'Atlantic/Bermuda#/Hamilton', 'Asia/Ho_Chi_Minh#/Hanoi', 'Pacific/Guadalcanal#/Honiara', 'America/Chicago#/Houston', 'Asia/Karachi#/Islamabad', 'America/Danmarkshavn#/Ittoqqortoormiit', 'Europe/Samara#/Izhevsk', 'America/Godthab#/Kangerlussuaq', 'America/Chicago#/Kansas City', 'Europe/Helsinki#/Kemi', 'Asia/Krasnoyarsk#/Khatanga', 'America/Jamaica#/Kingston', 'America/St_Vincent#/Kingstown', 'America/Montreal#/Kuujjuaq', 'Asia/Karachi#/Lahore', 'America/Los_Angeles#/Las Vegas', 'Asia/Urumqi#/Lhasa', 'Africa/Blantyre#/Lilongwe', 'Asia/Jayapura#/Manokwari', 'America/New_York#/Miami', 'America/Chicago#/Minneapolis', 'America/Montreal#/Montréal', 'Indian/Comoro#/Moroni', 'Asia/Kolkata#/Mumbai', 'Asia/Rangoon#/Naypyidaw', 'Asia/Kolkata#/New Delhi', 'America/Chicago#/New Orleans', 'Asia/Krasnoyarsk#/Norilsk', 'Pacific/Tongatapu#/Nukualofa', 'America/Godthab#/Nuuk', 'America/Chicago#/Oklahoma City', 'America/Toronto#/Ottawa', 'Pacific/Pohnpei#/Palikir', 'Pacific/Tahiti#/Papeete', 'Asia/Anadyr#/Pevek', 'America/New_York#/Philadelphia', 'America/Iqaluit#/Pond Inlet', 'Atlantic/Azores#/Ponta Delgada', 'Africa/Johannesburg#/Pretoria', 'Europe/Belgrade#/Pristina', 'America/Santiago#/Punta Arenas', 'America/Thule#/Qaanaaq', 'America/Guayaquil#/Quito', 'Africa/Casablanca#/Rabat', 'America/Sao_Paulo#/Rio de Janeiro', 'Europe/Helsinki#/Rovaniemi', 'America/Denver#/Salt Lake City', 'America/Los_Angeles#/San Francisco', 'Asia/Yakutsk#/Tiksi', 'Africa/Bamako#/Timbuktu', 'Europe/Tirane#/Tirana', 'Atlantic/Faroe#/Torshavn', 'America/Nome#/Unalaska']
  var TIMEZONE_NAMES = TZ_TIMEZONE_NAMES.concat(ADDITIONAL_TIMEZONE_NAMES);
  var KEY_CURRENT_LOCATION = 'Current_Location';

  var supportsTouch = ('ontouchstart' in window || (typeof DocumentTouch !== 'undefined' && document instanceof DocumentTouch));
  var isFF = (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1);

  var prop = function(initialValue) {
    var cache = initialValue;
    return function(value) {
      if (typeof value === 'undefined')
        return cache;
      cache = value;
    };
  };

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

  function storageKey(key) {
    return 'org.ionstage.loclock.' + key;
  }

  function loadData(key, defaultValue) {
    var value = localStorage.getItem(storageKey(key));
    if (value === null && typeof defaultValue !== 'undefined')
      return defaultValue;
    return JSON.parse(value);
  }

  function saveData(key, data) {
    localStorage.setItem(storageKey(key), JSON.stringify(data));
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
    if (((bb0.x < bb1.x && bb0.x + bb0.width > bb1.x) ||
          (bb0.x > bb1.x && bb1.x + bb1.width > bb0.x)) &&
        ((bb0.y < bb1.y && bb0.y + bb0.height > bb1.y) ||
          (bb0.y > bb1.y && bb1.y + bb1.height > bb0.y))) {
      return true;
    }
    return false;
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

  function getTimelist(timezone) {
    var date = new Date();
    var currentTime = date.getTime();
    var currentTimezoneOffset = date.getTimezoneOffset();

    return timezone.map(function(item) {
      var name = item[0];
      name = name.substring(name.lastIndexOf('/') + 1).replace(/_/g, ' ');
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

  var useStorage = prop(false);

  function getLocations() {
    var list;
    if (useStorage()) {
      list = loadData('locations', DEFAULT_LOCATIONS);
    } else {
      var hash = getHashText();
      if (hash)
        list = hash.split(',');
      else
        list = DEFAULT_LOCATIONS;
    }
    return list.filter(function(item) {
      return TIMEZONE_NAMES.indexOf(item) !== -1 || item === KEY_CURRENT_LOCATION;
    });
  }

  function setLocations(list) {
    list = list.filter(function(item) {
      return TIMEZONE_NAMES.indexOf(item) !== -1 || item === KEY_CURRENT_LOCATION;
    });

    if (useStorage())
      saveData('locations', list);
    else
      setHashText(list.join(','));
    selectTimezone(list);
  }

  function resetLocations() {
    setLocations(DEFAULT_LOCATIONS);
  }

  function toggleDialog() {
    if (dialog_view.isShown)
      dialog_view.hide();
    else
      dialog_view.show();
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
        var name = item.substring(item.lastIndexOf('/') + 1).replace(/_/g, ' ');
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

  var dialog_view = {
    init: function(element) {
      this.element = element;
      this.list_dialog_element = element.children[0];
      this.acknowledgements_dialog_element = element.children[1];

      var reset_locations_button = this.list_dialog_element.children[0];
      var acknowledgements_button = this.list_dialog_element.children[1];
      var acknowledgements_close_button = this.acknowledgements_dialog_element.children[1];

      this.acknowledgements_text_container = this.acknowledgements_dialog_element.children[0];
      this.acknowledgements_text = this.acknowledgements_text_container.children[0];

      if (supportsTouch) {
        attr(this.acknowledgements_text_container, 'class', 'text-container unscrollable');
        this.scroll = new IScroll(this.acknowledgements_text_container, {
          click: true,
          scrollbars: true,
          shrinkScrollbars: 'scale',
          fadeScrollbars: true
        });
      }

      element.addEventListener((supportsTouch ? 'touchstart' : 'mousedown'), function(event) {
        if (event.target !== this.element)
          return;
        event.preventDefault();
        event.stopPropagation();
        this.hide();
      }.bind(this));

      reset_locations_button.addEventListener('click', function() {
        this.hide();
        if (typeof window.app.resetLocationsHandler === 'function')
          window.app.resetLocationsHandler();
      }.bind(this));

      acknowledgements_button.addEventListener('click', function() {
        attr(this.list_dialog_element, 'class', 'hide');
        attr(this.acknowledgements_dialog_element, 'class', 'show');
        if (supportsTouch) {
          this.scroll.refresh();
          this.scroll.scrollTo(0, 0);
        } else {
          this.acknowledgements_text_container.scrollTop = 0;
        }
        this.loadAcknowledgements();
      }.bind(this));

      acknowledgements_close_button.addEventListener('click', function() {
        this.hide();
      }.bind(this));

      this.isShown = false;
    },
    show: function() {
      attr(this.list_dialog_element, 'class', null);
      attr(this.acknowledgements_dialog_element, 'class', 'hide');
      attr(this.element, 'class', 'show');
      this.isShown = true;
    },
    hide: function() {
      attr(this.element, 'class', null);
      this.isShown = false;
    },
    loadAcknowledgements: function() {
      if (this.acknowledgementsLoaded)
        return;
      var request = new XMLHttpRequest();
      request.open('GET', 'assets/acknowledgements.txt', true);
      request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
          var text = request.responseText;
          this.acknowledgements_text.innerHTML = text.replace(/\n/g, '<br>');
          if (supportsTouch)
            this.scroll.refresh();
          this.acknowledgementsLoaded = true;
        }
      }.bind(this);
      request.send();
    }
  };

  document.addEventListener('DOMContentLoaded', function() {
    list_view.init(el('#list'));
    bars_view.init(el('#bars'));
    clock_view.init(el('#clock'), timelist.get());
    dialog_view.init(el('#dialog'));

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

  window.app = {
    useStorage: useStorage,
    resetLocations: resetLocations,
    resetLocationsHandler: resetLocations,
    toggleDialog: toggleDialog
  };
})();