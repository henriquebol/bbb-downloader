import { access, F_OK } from 'fs';
import Queue from '../lib/Queue';
import checkPermission from './PermissionController';

const log = require('simple-node-logger').createSimpleLogger('log/api.log');

export default {

  async store(req, res) {
    // const { url, email } = req.body;
    const { email } = req.query || 'webconferencia@virtual.ufc.br';
    const { url } = req.query;

    log.info('New Request - ', email, ' - ', url);

    if (!url) {
      return res.json({ msg: 'URL vazia' });
    }

    const urlRegex = new RegExp('^https?:\\/\\/.*\\/playback\\/presentation\\/2\\.0\\/playback\\.html\\?meetingId=[a-z0-9]{40}-[0-9]{13}');
    if (!urlRegex.test(url)) {
      return res.json({ msg: 'URL inválida' });
    }

    const meetingId = url.split('=')[1];
    const domain = url.split('playback')[0];
    const file_name = `${meetingId}.mp4`;
    const path_file = `${process.env.COPY_TO_PATH}/${file_name}`;
    const path_download = `${process.env.LINK_DOWNLOAD}/${file_name}`;
    const metadata = `${domain}presentation/${meetingId}/metadata.xml`;

    const request = {
      email,
      url,
      path_download,
      meetingId,
    };

    checkPermission(metadata, email).then((r) => {
      if (!r) return res.json({ msg: 'Download não permitido. Por favor, contate o responsável pela gravação para mais informações' });

      access(path_file, F_OK, (err) => {
        if (err) {
          Queue.get('ConvertWeb', meetingId).then((response) => {
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
        return res.json({ msg: path_download });
      });
    });
  },

  async clean(req, res) {
    await Queue.clean('ConvertWeb');
    await Queue.clean('SendMail');
    return res.json({ msg: 'Limpo!' });
  },
};
