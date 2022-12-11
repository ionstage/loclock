(function(app) {
  'use strict';

  var ThemeInputs = function(el, props) {
    this.el = el;
    this._themeAttrs = props.themeAttrs;
  };

  ThemeInputs.prototype.init = function() {
    this.el.addEventListener('change', this._change.bind(this));
    this._themeAttrs.on('change:value', this._update.bind(this));
    this._update(this._themeAttrs.get('value'));
  };

  ThemeInputs.prototype._change = function() {
    var el = this.el.querySelector('input:checked');
    this._themeAttrs.set('value', el.value);
  };

  ThemeInputs.prototype._update = function(value) {
    var el = this.el.querySelector("input[value='" + value + "']");
    el.checked = true;
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeInputs;
  } else {
    app.ThemeInputs = ThemeInputs;
  }
})(this.app || (this.app = {}));
