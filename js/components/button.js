(function(app) {
  'use strict';

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

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Button;
  } else {
    app.Button = Button;
  }
})(this.app || (this.app = {}));
