// Provides a shim around Zombie.js so that everything is asynchronous.
var _ =       require('underscore');
var Browser = require('zombie');
var Zombie = function(options) {
  Browser.call(this, options);
};

// Derive from the Zombie Browser.
Zombie.prototype = new Browser();
Zombie.prototype.constructor = Zombie;
Zombie.prototype.asyncCall = function() {
  var self = this;
  var args = _.filter(_.values(arguments), function(arg) {
    return !!arg;
  });
  var method = args.shift();
  var callback = args.pop();
  if (typeof callback === 'function') {
    callback(Browser.prototype[method].apply(this, args));
  }
  else {
    args.push(callback);
    return Browser.prototype[method].apply(this, args);
  }
};

_.each([
  'queryAll',
  'query',
  '$$',
  'querySelector',
  'querySelectorAll',
  'text',
  'html',
  'xpath',
  'link',
  'field',
  'fill',
  'check',
  'uncheck',
  'choose',
  'select',
  'selectOption',
  'unselect',
  'unselectOption',
  'attach',
  'button',
  'evaluate'
], function(method) {
  Zombie.prototype[method] = function() {
    var args = _.values(arguments);
    args.unshift(method);
    return this.asyncCall.apply(this, args);
  };
});

module.exports = Zombie;
