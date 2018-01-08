'use strict';

const Mocha = require('mocha'),
    mocha = new Mocha({reporter: process.env.REPORTER || 'spec'}),
    Path = require('wrapper-path'),
    path = new Path(`${__dirname}/../`);

global._path = path;
global._expect = require('chai').expect;
global._assert = require('chai').assert;
global._stdout = require('test-console').stdout;
global._ZIDate = require('@zerointermittency/date');
global._ZIS3 = require('../ZIS3.js');
global._config = require('./config.js');

let files = path.recursive.files('/test/', {exclude: /(test\/index\.js|\.gitignore|\.jpeg)$/i});
for (let i = files.length - 1; i >= 0; i--) mocha.addFile(files[i]);

mocha.run(() => process.exit());
