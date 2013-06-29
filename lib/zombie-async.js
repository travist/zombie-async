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

Zombie.prototype.queryAll = function(selector, context, callback) {
  return this.asyncCall('queryAll', selector, context, callback);
};

Zombie.prototype.query = function(selector, context, callback) {
  return this.asyncCall('query', selector, context, callback);
};

Zombie.prototype.text = function(selector, context, callback) {
  return this.asyncCall('text', selector, context, callback);
};

Zombie.prototype.xpath = function(expression, context, callback) {
  return this.asyncCall('xpath', expression, context, function(nodes) {
    callback(nodes.value);
  });
};

Zombie.prototype.html = function(selector, context, callback) {
  return this.asyncCall('html', selector, context, callback);
};

module.exports = Zombie;
