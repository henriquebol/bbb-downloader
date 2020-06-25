"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }require('dotenv/config');
var _Queue = require('./app/lib/Queue'); var _Queue2 = _interopRequireDefault(_Queue);

const log = require('simple-node-logger').createSimpleLogger('log/queue.log');

const args = process.argv.slice(2);

const concurrency = args[0] || 1;

log.info('Starting queue whith concurrency: ', concurrency);
_Queue2.default.process(concurrency);
