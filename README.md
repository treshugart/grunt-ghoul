# grunt-ghoul

> An abstract test runner that runs and reports on front-end test suites.

## Getting Started
This plugin requires:
- Grunt `~0.4.1`
- PhantomJS

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ghoul --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ghoul');
```

## The "ghoul" task

### Overview
In your project's Gruntfile, add a section named `ghoul` to the data object passed into `grunt.initConfig()`.

```js
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

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
