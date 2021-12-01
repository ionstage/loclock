(function(app) {
  'use strict';

  var IScroll = require('iscroll');
  var dom = app.dom || require('./dom.js');

  var List = function(element, ontoggle) {
    this.items = {};
    this.currentSelectedItems = [];
    this.element = element;
    this.scrolling = false;
    this.clickable = true;
    this.ontoggle = ontoggle;

    element.addEventListener('click', function(event) {
      event.preventDefault();
      if (this.scrolling || !this.clickable) {
        this.scrolling = false;
        this.clickable = true;
        return;
      }
      this.onclick(event);
    }.bind(this));

    element.addEventListener('touchstart', function() {
      this.clickable = !this.scrolling;
    }.bind(this));

    if (dom.supportsTouch()) {
      element.classList.add('unscrollable');
    }
  };

  List.prototype.setList = function(locations) {
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
      item.classList.add('list-item');
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

    this.element.replaceChild(element, this.element.firstElementChild);

    if (dom.supportsTouch()) {
      if (this.scroll) {
        this.scroll.destroy();
        this.scroll = null;
      }

      this.scroll = new IScroll(this.element, {
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
  };

  List.prototype.update = function(selectedLocations) {
    if (this.currentSelectedItems.length > selectedLocations.length) {
      this.currentSelectedItems.forEach(function(item) {
        item.classList.remove('list-selected');
      });
    }

    this.currentSelectedItems = selectedLocations.map(function(location) {
      var item = this.items[location.key];
      item.classList.add('list-selected');
      return item;
    }.bind(this));
  };

  List.prototype.onclick = function(event) {
    var target = event.target;
    if (!target.classList.contains('list-item')) {
      return;
    }
    var key = target.getAttribute('data-key');
    this.ontoggle(key);
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = List;
  } else {
    app.List = List;
  }
})(this.app || (this.app = {}));
