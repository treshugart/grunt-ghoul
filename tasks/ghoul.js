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
    var color = require('colors')
      , cheerio = require('cheerio')
      , _ = require('underscore')
      , $ = cheerio.load(html)
      , isWin = /^win/.test(require('os').platform())
      , successSymbol = (isWin ? '+' : '✓').green
      , failureSymbol = (isWin ? '-' : '✗').red
      , duration = $('.duration em').text()
      , passes = $('.test.pass').length
      , failures = $('.test.fail').length;

    // add missing "contents" method (see: https://github.com/MatthewMueller/cheerio/pull/234)
    cheerio.prototype.contents = function() {
      return this.make(_.reduce(this, function(all, elem) {
        all.push.apply(all, elem.children);
        return all;
      }, []));
    };

    grunt.log.writeln('  Duration: ' + duration + 's');
    grunt.log.writeln('  Passes: ' + passes);
    grunt.log.writeln('  Failures: ' + failures);
    grunt.log.writeln();

    $('.suite').each(function(a, suite) {
      var $suite = $(suite);

      grunt.log.writeln('  ' + $suite.find('h1').contents().first().text().bold);

      $suite.find('.test').each(function(b, test) {
        var testDuration, $test = $(test);

        grunt.log.write('    ');

        if ($test.is('.pass')) {
          testDuration = $test.find('.duration').text();

          grunt.log.write(successSymbol);
          grunt.log.write(' ' + $test.find('h2').contents().first().text());
          grunt.log.write(' ' + ($test.is('.slow') ? testDuration.red : $test.is('.medium') ? testDuration.yellow : testDuration));
        } else {
          grunt.log.write(failureSymbol);
          grunt.log.write(' ' + $test.find('h2').contents().first().text().red);
          grunt.log.writeln();

          $test.find('.error').each(function(c, error) {
            var $error = $(error)
              , lines = $error.text().split("\n");

            lines.forEach(function(line, d) {
              var spacing = d ? '        ' : '      ';
              grunt.log.writeln(spacing + line.trim().red);
            });
          });
        }

        grunt.log.writeln();
      });
    });

    return failures === 0;
  }
};

module.exports = function(grunt) {
  grunt.registerMultiTask('ghoul', 'An abstract test runner that runs and reports on front-end test suites.', function() {
    var data = this.data

      // The user can use their own runner or specify an internal one to use.
      , runner = typeof data.runner === 'function' ? data.runner : runners[data.runner || 'mocha']
      , phantom = require('grunt-lib-phantomjs').init(grunt)
      , done = this.async();

    // Console logging is used to trigger events in Ghoul from PhantomJS
    // instead of the default alerts. This is cleaner especially when you also
    // want to run your tests in the browser without having to detect if it is
    // PhantomJS running the tests.
    phantom.on('console', function(msg) {
      if (msg.indexOf('ghoul.') === 0) {
        /*jshint shadow:true */
        var args = msg.match(/(ghoul\.[^\s]+)\s*([\s\S]*)/i)
          , name = args[1]
          , args = args[2];

        args = JSON.parse(args);
        args.unshift(name);
        phantom.emit.apply(phantom, args || []);
      }
    });

    phantom.on('ghoul.log', function(msg) {
      grunt.log.writeln(msg);
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
        grunt.log.writeln();
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
