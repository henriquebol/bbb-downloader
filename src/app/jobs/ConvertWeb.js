import { startRecording, convertAndCopy } from '../lib/bbb-recorder/recorder';
import Queue from '../lib/Queue';

const log = require('simple-node-logger').createSimpleLogger('default.log');

export default {
  key: 'ConvertWeb',
  options: {
    attempts: 3,
  },
  async handle({ data }) {
    const { request } = data;

    log.info('Start Recording - ', request.url);
    await startRecording(request.url)
      .then(async (exportname) => {
        log.info('Convert And Copy - ', request.url);
        await convertAndCopy(exportname);
      })
      .then(() => {
        log.info('Send Mail - ', request.url);
        Queue.add('SendMail', { request });
      })
      .catch((e) => log.error(e));
  },
};
