import Mail from '../lib/Mail';

const log = require('simple-node-logger').createSimpleLogger('default.log');

export default {
  key: 'SendMail',
  options: {
    delay: 3600000,
  },
  async handle({ data }) {
    const { request } = data;

    log.info('Enviando email', request);

    await Mail.sendMail({
      from: 'Suporte <webconferencia.virtual.ufc.br>',
      to: request.email,
      subject: 'Download da webconferência',
      html: `Olá. Conforme solicitado, segue o link de download da sua webconferência. <a>${request.path_file}<a>.`,
    });
  },
};
