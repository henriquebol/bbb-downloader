import { access, F_OK } from 'fs';
import Queue from '../lib/Queue';

const log = require('simple-node-logger').createSimpleLogger('api.log');

export default {
  async store(req, res) {
    // const { url, email } = req.body;
    const { email } = req.query;
    const { url } = req.query;

    log.info('Request (email) - ', email);
    log.info('Request (url) - ', url);

    if (!url) {
      return res.json({ msg: 'URL vazia' });
    }

    const urlRegex = new RegExp('^https?:\\/\\/.*\\/playback\\/presentation\\/2\\.0\\/' + 'playback\\.html' + '\\?meetingId=[a-z0-9]{40}-[0-9]{13}');
    if (!urlRegex.test(url)) {
      return res.json({ msg: 'URL inválida' });
    }

    const meetingId = url.split('=')[1];
    const file_name = `${meetingId}.mp4`;
    const path_file = `${process.env.COPY_TO_PATH}/${file_name}`;

    const request = {
      meetingId,
      email,
      url,
      path_file,
    };

    access(path_file, F_OK, (err) => {
      if (err) {
        Queue.get('ConvertWeb', meetingId).then((response) => {
          console.log('store -> response', response);
          if (response) {
            if (response.finishedOn || response.failedReason) {
              log.info('Remove Job - ', url);
              response.remove().then(() => {
                log.info('Add ConvertWeb Queue - ', url);
                Queue.add('ConvertWeb', { request });
              });
            } else {
              log.info('Add SendMail Queue - ', request);
              Queue.add('SendMail', { request });
            }
          } else {
            log.info('Add ConvertWeb Queue - ', url);
            Queue.add('ConvertWeb', { request });
          }
        });

        return res.json({ msg: 'Processando arquivo para download. Por favor, volte mais tarde. O link de download também será enviado para seu email.' });
      }

      // res.download(path_file, file_name)
      log.info('Download - ', url);
      return res.json({ msg: `https://webconferencia.virtual.ufc.br/download/${file_name}` });
    });
  },
};
