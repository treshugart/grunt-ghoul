/*
 * grunt-ghoul
 * https://github.com/treshugart/grunt-ghoul
 *
 * Copyright (c) 2013 Trey Shugart
 * Licensed under the MIT license.
 */

'use strict';

var runners = {
  mocha: function(grunt, html) {
    var $ = require('jquery');
    var $html = $(html);
    var duration = $html.find('.duration em').text();
    var passes = +$html.find('.passes em').text();
    var failures = +$html.find('.failures em').text();

    grunt.verbose.writeln('  Duration: ' + duration + 's');
    grunt.log.writeln('  Passes: ' + passes);
    grunt.log.writeln('  Failures: ' + failures);
    grunt.log.writeln();

    $html.find('.suite').each(function(a, suite) {
      var suite = $(suite);

      grunt.log.writeln('  ' + suite.find('h1').contents().eq(0).text());

      $html.find('.test').each(function(i, test) {
        test = $(test);

        grunt.log.write('    ');
        grunt.log.write(test.is('.pass') ? '✓' : '✗');
        grunt.log.write(' ' + test.find('h2').contents().eq(0).text());
        grunt.verbose.write(' ' + test.find('.duration').text());
        grunt.log.writeln();
        grunt.log.writeln();
      });
    });

    return failures === 0;
  }
};

module.exports = function(grunt) {
  grunt.registerMultiTask('ghoul', 'An abstract test runner that runs and reports on front-end test suites.', function() {
    var data = this.data;

    // The user can use their own runner or specify an internal one to use.
    var runner = typeof data.runner === 'function' ? data.runner : runners[data.runner || 'mocha'];

    var phantom = require('grunt-lib-phantomjs').init(grunt);
    var done = this.async();

    // Console logging is used to trigger events in Ghoul from PhantomJS
    // instead of the default alerts. This is cleaner especially when you also
    // want to run your tests in the browser without having to detect if it is
    // PhantomJS running the tests.
    phantom.on('console', function(msg) {
      if (msg.indexOf('ghoul.') === 0) {
        // Match any console log that begins with the task name.
        var args = msg.match(/(ghoul\.[^\s]+)\s*(.*)/i);

        // The event name that is triggered is the first part of the log.
        var name = args[1];

        // The second part is a JSON encoded string of arguments to pass as
        // event data.
        var args = (args[2] || '').replace(/"/g, '\\"');

        // If the argument wasn't passed as an encoded
        // array, make it one taking into account if
        // the type that was passe was a number or
        // string.
        if (args.indexOf('[') !== 0) {
          if (typeof args === 'number') {
            args = '[' + args + ']'
          } else {
            args = '["' + args + '"]'
          }
        }

        args = JSON.parse(args);
        args.unshift(name);
        phantom.emit.apply(phantom, args);
      }
    });

    phantom.on('ghoul.done', function(html) {
      // The test runner must return false in order to halt task execution.
      if (runner(grunt, html) === false) {
        grunt.fail.warn('Tests failed.');
      }

      // When the tests are done, we continue to the next test runner.
      phantom.halt();
    });

    // Each URL is considered a test runner.
    grunt.util.async.forEachSeries(
      data.urls || [],
      function(url, next) {
        grunt.log.writeln('Running: ' + url);

        phantom.spawn(url, {
          options: data.phantom || {},
          done: function(error) {
            if (error) {
              done(error);
            } else {
              next();
            }
          }
        });
      },
      function() {
        done();
      }
    );
  });
};