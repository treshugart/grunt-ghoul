!function(factory) {
  if (typeof exports === 'object') {
    module.exports = factory(require('q'));
  } else if (typeof define === 'function' && define.amd) {
    define(['q'], factory);
  } else {
    ghoul = factory(Q);
  }
}(function(ghoul) {
  ghoul.emit = function(name) {
    var args = [].slice.apply(arguments)
      , name = args.shift();

    console.log('ghoul.' + name, JSON.stringify(args));
  };

  return ghoul;
});