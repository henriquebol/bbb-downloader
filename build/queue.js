"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

require("dotenv/config");

var _Queue = _interopRequireDefault(require("./app/lib/Queue"));

var log = require('simple-node-logger').createSimpleLogger('log/queue.log');

var args = process.argv.slice(2);
var concurrency = args[0] || 1;
log.info('Starting queue whith concurrency: ', concurrency);

_Queue["default"].process(concurrency);