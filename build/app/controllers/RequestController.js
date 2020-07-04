"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _fs = require('fs');
var _Queue = require('../lib/Queue'); var _Queue2 = _interopRequireDefault(_Queue);
var _PermissionController = require('./PermissionController'); var _PermissionController2 = _interopRequireDefault(_PermissionController);

const log = require('simple-node-logger').createSimpleLogger('log/api.log');

exports. default = {

  async store(req, res) {
    // const { url, email } = req.body;
    const { user } = req.query;
    const { email } = req.query || 'webconferencia@virtual.ufc.br';
    const { url } = req.query;

    const msg = '';

    log.info('New Request - ', user, ' - ', email, ' - ', url);

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

    _PermissionController2.default.call(void 0, metadata, user).then((r) => {
      if (!r) return res.json({ msg: 'Download não permitido. Por favor, contate o responsável pela gravação para mais informações' });

      _fs.access.call(void 0, path_file, _fs.F_OK, (err) => {
        if (err) {
          _Queue2.default.get('ConvertWeb', meetingId).then((response) => {
            if (response) {
              if (response.finishedOn || response.failedReason) {
                log.info('Remove Job - ', url);
                response.remove().then(() => {
                  log.info('Add ConvertWeb Queue - ', url);
                  _Queue2.default.add('ConvertWeb', { request });
                });
              } else {
                log.info('Add SendMail Queue - ', request);
                _Queue2.default.add('SendMail', { request });
              }
            } else {
              log.info('Add ConvertWeb Queue - ', url);
              _Queue2.default.add('ConvertWeb', { request });
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
    await _Queue2.default.clean('ConvertWeb');
    await _Queue2.default.clean('SendMail');
    return res.json({ msg: 'Limpo!' });
  },
};
