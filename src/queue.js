#!/usr/bin/env node
import 'dotenv/config';
import Queue from './app/lib/Queue';

const log = require('simple-node-logger').createSimpleLogger('log/queue.log');

const args = process.argv.slice(2);

const concurrency = args[0] || process.env.QUEUE_CONCURRENCY;

log.info('Starting queue whith concurrency: ', concurrency);
Queue.process(concurrency);
