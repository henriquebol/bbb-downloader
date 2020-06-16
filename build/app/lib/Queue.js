"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { newObj[key] = obj[key]; } } } newObj.default = obj; return newObj; } } function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _bull = require('bull'); var _bull2 = _interopRequireDefault(_bull);

var _jobs = require('../jobs'); var jobs = _interopRequireWildcard(_jobs);

const queues = Object.values(jobs).map((job) => ({
  bull: new (0, _bull2.default)(job.key, process.env.REDIS_QUEUE_URL),
  name: job.key,
  handle: job.handle,
  options: job.options,
}));

exports. default = {
  queues,
  add(name, data) {
    const queue = this.queues.find((queue_item) => queue_item.name === name);

    if (name === 'ConvertWeb') {
      queue.options.jobId = data.request.meetingId;
    }

    return queue.bull.add(data, queue.options);
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job, err) => {
        console.log('Job failed', queue.key, job.data);
        console.log(err);
      });
    });
  },
  get(name, jobId) {
    const queue = this.queues.find((queue_item) => queue_item.name === name);
    return queue.bull.getJob(jobId);
  },
  clean(name) {
    const queue = this.queues.find((queue_item) => queue_item.name === name);
    queue.bull.clean(10000, 'completed');
    queue.bull.clean(10000, 'wait');
    queue.bull.clean(10000, 'active');
    queue.bull.clean(10000, 'delayed');
    queue.bull.clean(10000, 'failed');
    return true;
  },
};
