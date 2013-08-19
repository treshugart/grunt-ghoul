!function(factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    ghoul = factory();
  }
}(function() {
  return {
    emit: function(name) {
      var args = [].slice.apply(arguments)
        , name = args.shift();

      console.log('ghoul.' + name, JSON.stringify(args));
    }
  };
});