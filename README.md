# grunt-ghoul

Ghoul integrates with existing in-browser test runners provided by popular frameworks such as QUnit and Mocha, works asynchronously out of the box and stays out of your way.

## Getting Started

This plugin requires:
- Node `0.10`
- Grunt `~0.4.1`
- PhantomJS
- Some server like Connect running so that PhantomJS can load the runners.

Supported runners:
- Mocha 1.12+

### Overview

Ghoul acts as a bridge between your standard HTML test runner and Grunt. It takes the resulting HTML, parses it and reports on the results. Since you emit events back to Ghoul from the HTML runner, it natively supports asynchronous behavior.

The major difference between how `grunt-lib-phantomjs` receives messages and how Ghoul sends them is that Ghoul sends them via the console rather than using `alert()`. This is so you don't get any annoying alerts if you want to run your tests in the browser, eliminates the need for having PhantomJS checks around them and facilitates simpler debugging if and when you want to see what was sent back to Ghoul.

The following shows how to load Ghoul and configure it.

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

The following is a sample test runner for Mocha. RequireJS is used to exemplify how asynchronous front-end testing can work with Ghoul.

```html
<html>
  <head>
    <link rel="stylesheet" href="mocha.css">
    <script data-main="some/setup" src="require.js"></script>
  </head>
  <body>
    <div id="mocha"></div>
    <script>
      require.config({
        chai: 'path/to/chai',
        ghoul: 'node_modules/ghoul/lib/ghoul',
        mocha: 'path/to/mocha'
      });

      // Yep, handles async like a charm!
      require(['chai', 'ghoul', 'mocha'], function(mocha) {
        mocha.setup('bdd');

        // Since we are telling Ghoul when we are done, we can do as much
        // async stuff as we want.
        require([
          'some/test1',
          'some/test2'
        ], function() {
          mocha.checkLeaks();
          mocha.run(function() {
            // By including the ghoul helper library provided in the NPM
            // module, we can cleanly emit events back to the console
            // runner from this HTML runner.
            //
            // The "done" event tells the console runner that the tests
            // have completed and passes it the resulting HTML to parse
            // and report on.
            ghoul.emit('done', document.getElementById('mocha').innerHTML);
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

## License

Copyright (c) 2013 Trey Shugart

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.