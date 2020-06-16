"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _Mail = require('../lib/Mail'); var _Mail2 = _interopRequireDefault(_Mail);

const log = require('simple-node-logger').createSimpleLogger('default.log');

exports. default = {
  key: 'SendMail',
  options: {
    delay: 3600000,
  },
  async handle({ data }) {
    const { request } = data;

    log.info('Enviando email', request);

    await _Mail2.default.sendMail({
      from: 'Suporte <webconferencia.virtual.ufc.br>',
      to: request.email,
      subject: 'Download da webconferência',
      html: `Olá. Conforme solicitado, segue o link de download da sua webconferência. <a>${request.path_file}<a>.`,
    });
  },
};
