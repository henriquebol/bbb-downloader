import Queue from 'bull';

import * as jobs from '../jobs';

const queues = Object.values(jobs).map((job) => ({
  bull: new Queue(job.key, process.env.REDIS_QUEUE_URL),
  name: job.key,
  handle: job.handle,
  options: job.options,
}));

export default {
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
