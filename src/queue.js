import 'dotenv/config';
import Queue from './app/lib/Queue';

const log = require('simple-node-logger').createSimpleLogger('queue.log');

const concurrency = process.argv[0] || 1;

log.info('Starting queue whith concurrency: ', concurrency);
Queue.process(concurrency);
