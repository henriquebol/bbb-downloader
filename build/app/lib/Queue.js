"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _bull = _interopRequireDefault(require("bull"));

var jobs = _interopRequireWildcard(require("../jobs"));

var queues = Object.values(jobs).map(function (job) {
  return {
    bull: new _bull["default"](job.key, process.env.REDIS_QUEUE_URL),
    name: job.key,
    handle: job.handle,
    options: job.options
  };
});
var _default = {
  queues: queues,
  add: function add(name, data) {
    var queue = this.queues.find(function (queue_item) {
      return queue_item.name === name;
    });

    if (name === 'ConvertWeb') {
      queue.options.jobId = data.request.meetingId;
    }

    return queue.bull.add(data, queue.options);
  },
  process: function process() {
    var concurrency = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return this.queues.forEach(function (queue) {
      queue.bull.process(concurrency, queue.handle);
      queue.bull.on('failed', function (job, err) {
        console.log('Job failed', queue.key, job.data);
        console.log(err);
      });
    });
  },
  get: function get(name, jobId) {
    var queue = this.queues.find(function (queue_item) {
      return queue_item.name === name;
    });
    return queue.bull.getJob(jobId);
  },
  clean: function clean(name) {
    var queue = this.queues.find(function (queue_item) {
      return queue_item.name === name;
    });
    queue.bull.clean(10000, 'completed');
    queue.bull.clean(10000, 'wait');
    queue.bull.clean(10000, 'active');
    queue.bull.clean(10000, 'delayed');
    queue.bull.clean(10000, 'failed');
    return true;
  }
};
exports["default"] = _default;