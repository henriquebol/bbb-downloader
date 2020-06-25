"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _recorder = require('../lib/bbb-recorder/recorder');
var _Queue = require('../lib/Queue'); var _Queue2 = _interopRequireDefault(_Queue);

const log = require('simple-node-logger').createSimpleLogger('log/queue.log');

exports. default = {
  key: 'ConvertWeb',
  options: {
    attempts: 3,
  },
  async handle({ data }) {
    const { request } = data;

    log.info('Starting Recording - ', request.url);
    await _recorder.startRecording.call(void 0, request.url)
      .then(async (exportname) => {
        log.info('Convert And Copy - ', request.url);
        await _recorder.convertAndCopy.call(void 0, exportname);
      })
      .then(() => {
        log.info('Send Mail - ', request.url);
        _Queue2.default.add('SendMail', { request });
      })
      .catch((e) => log.error(e));
  },
};
