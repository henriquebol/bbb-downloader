import { startRecording, convertAndCopy } from '../lib/bbb-recorder/recorder';
import Queue from '../lib/Queue';

const log = require('simple-node-logger').createSimpleLogger('log/queue.log');

export default {
  key: 'ConvertWeb',
  options: {
    attempts: 3,
  },
  async handle({ data }) {
    const { request } = data;

    log.info('Starting Recording - ', request.url);
    await startRecording(request.url)
      .then(async (exportname) => {
        log.info('Convert And Copy - ', request.url);
        await convertAndCopy(exportname);
      })
      .then(() => {
        log.info('Send Mail - ', request.url);
        Queue.add('SendMail', { request });
      })
      .catch((e) => {
        console.log('RETRY -> request', request);
        Queue.get('ConvertWeb', request.meetingId).then((response) => {
          log.info('Remove Job - ', request.url);
          response.remove().then(() => {
            log.info('Add ConvertWeb Queue - ', request.url);
            Queue.add('ConvertWeb', { request });
            log.error(e);
          });
        });
      });
  },
};
