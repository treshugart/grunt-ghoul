# grunt-ghoul

Ghoul integrates with existing in-browser test runners provided by the popular frameworks such as QUnit and Mocha, works asynchronously out of the box and stays out of your way.

## Getting Started

This plugin requires:
- Grunt `~0.4.1`
- PhantomJS
- Some server like Connect running so that PhantomJS can load the runners.

Supported runners:
- Mocha 1.12+

### Overview

Load the grunt task and then configure it.

```js
grunt.loadNpmTasks('grunt-ghoul');
grunt.initConfig({
  ghoul: {
    tests: {
      // The test runner to use. Can be a string
      // indicating a built-in runner, or a function
      // that serves as a custom runner. If it's a
      // function, the first argument is the Grunt
      // instance used to run the task and the second
      // is the html returned from the `ghoul.done`
      // event.
      runner: 'mocha',

      // Each URL is processed and reported on separately.
      // These runners must run the tests using your
      // framework of choice and then call:
      //
      //     console.log('ghoul.done', document.getElementById('results').innerHTML);
      urls: [
        'http://localhost:8000/path/to/runner1.html',
        'http://localhost:8000/path/to/runner2.html'
      ],

      // You can also pass in PhantomJS options. These
      // options are passed as the `options` parameter
      // when calling `phantomjs.spawn()`.
      phantom: {}
    }
  },
})
```

### Sample Test Runner

The following is a sample test runner for Mocha. RequireJS is used to exemplify
how asynchronous front-end testing can work with Ghoul.

```html
<html>
  <head>
    <link rel="stylesheet" href="mocha.css">
    <script data-main="some/setup" src="require.js"></script>
  </head>
  <body>
    <div id="mocha"></div>
    <script>
      // Yep, handles async like a charm!
      require(['mocha'], function(mocha) {
        mocha.setup('bdd');

        // Since we are telling Ghoul when we are done, we can do as much
        // async stuff as we want.
        require([
          'some/dependency1',
          'some/dependency2'
        ], function() {
          mocha.checkLeaks();
          mocha.run(function() {
            // Notify Ghoul that the tests are done and give it the
            // resulting HTML.
            console.log('ghoul.done', document.getElementById('mocha').innerHTML);
          });
        });
      });
    </script>
  </body>
</html>
```

## Contributing

1. Fork.
2. Write tests.
3. Code.
4. Document.
5. Pull request.

## Release History

- 0.1.0
  - Initial release.