!function(factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        factory(module.exports || exports);
    } else if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else {
        factory(window.ghoul = {});
    }
}(function(ghoul) {
  ghoul.emit = function(name) {
    var args = [].slice.apply(arguments)
      , name = args.shift();

    console.log('ghoul.' + name, JSON.stringify(args));
  };
});