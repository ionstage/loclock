(function(app) {
  'use strict';

  var dom = {};

  dom.render = function(s) {
    var el = document.createRange().createContextualFragment(s).firstChild;
    el.parentNode.removeChild(el);
    return el;
  };

  dom.toggleClass = function(el, className, force) {
    if (el.classList) {
      if (force) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
    } else {
      var classNames = el.getAttribute('class').split(' ');
      var index = classNames.indexOf(className);
      if (force && index === -1) {
        // add class
        classNames.push(className);
        el.setAttribute('class', classNames.join(' '));
      } else if (!force && index !== -1) {
        // remove class
        classNames.splice(index, 1);
        el.setAttribute('class', classNames.join(' '));
      }
    }
  };

  dom.supportsTouch = function() {
    return ('ontouchstart' in window || (typeof DocumentTouch !== 'undefined' && document instanceof DocumentTouch));
  };

  dom.ajax = function(opt) {
    var type = opt.type;
    var url = opt.url;

    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest();

      var onfailed = function() {
        reject(new Error('Failed to load resource: ' + type + ' ' + url));
      };

      req.onload = function() {
        if (req.status >= 200 && req.status < 400) {
          resolve(req.response);
        } else {
          onfailed();
        }
      };

      req.onerror = onfailed;
      req.onabort = onfailed;

      req.open(type, url, true);
      req.send();
    });
  };

  dom.loadJSON = function(url) {
    return dom.ajax({
      type: 'GET',
      url: url,
    }).then(function(text) {
      return JSON.parse(text);
    });
  };

  dom.getURLSearchParam = function(key) {
    var params = window.location.search.substring(1).split('&');
    for (var i = 0, len = params.length; i < len; i++) {
      var items = params[i].split('=');
      if (decodeURIComponent(items[0] || '') === key) {
        return decodeURIComponent(items[1] || '');
      }
    }
    return null;
  };

  dom.setURLSearchParam = function(key, value) {
    var search = window.location.search;
    var params = (search.length >= 2 ? search.substring(1).split('&') : []);
    for (var i = 0, len = params.length; i < len; i++) {
      var items = params[i].split('=');
      if (decodeURIComponent(items[0] || '') === key) {
        params[i] = items[0] + (value ? '=' + encodeURIComponent(value) : '');
        break;
      }
    }
    if (i === len) {
      params.push(encodeURIComponent(key) + (value ? '=' + encodeURIComponent(value) : ''));
    }
    var newSearch = '?' + params.join('&');
    var url = window.location.origin + window.location.pathname + newSearch + window.location.hash;
    window.history.replaceState(null, '', url);
  };

  dom.deleteURLSearchParam = function(key) {
    var search = window.location.search;
    if (search.length < 2) {
      return;
    }
    var params = search.substring(1).split('&');
    for (var i = 0, len = params.length; i < len; i++) {
      var items = params[i].split('=');
      if (decodeURIComponent(items[0] || '') === key) {
        break;
      }
    }
    if (i === len) {
      return;
    }
    params.splice(i, 1);
    var newSearch = (params.length > 0 ? '?' + params.join('&') : '');
    var url = window.location.origin + window.location.pathname + newSearch + window.location.hash;
    window.history.replaceState(null, '', url);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = dom;
  } else {
    app.dom = dom;
  }
})(this.app || (this.app = {}));
