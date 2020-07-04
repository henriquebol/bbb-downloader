"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fs = require("fs");

var _Queue = _interopRequireDefault(require("../lib/Queue"));

var _PermissionController = _interopRequireDefault(require("./PermissionController"));

var log = require('simple-node-logger').createSimpleLogger('log/api.log');

var _default = {
  store: function store(req, res) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var user, _ref, email, url, urlRegex, meetingId, domain, file_name, path_file, path_download, metadata, request;

      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              // const { url, email } = req.body;
              user = req.query.user;
              _ref = req.query || 'webconferencia@virtual.ufc.br', email = _ref.email;
              url = req.query.url;
              log.info('New Request - ', user, ' - ', email, ' - ', url);

              if (url) {
                _context.next = 6;
                break;
              }

              return _context.abrupt("return", res.json({
                msg: 'URL vazia'
              }));

            case 6:
              urlRegex = new RegExp('^https?:\\/\\/.*\\/playback\\/presentation\\/2\\.0\\/playback\\.html\\?meetingId=[a-z0-9]{40}-[0-9]{13}');

              if (urlRegex.test(url)) {
                _context.next = 9;
                break;
              }

              return _context.abrupt("return", res.json({
                msg: 'URL inválida'
              }));

            case 9:
              meetingId = url.split('=')[1];
              domain = url.split('playback')[0];
              file_name = "".concat(meetingId, ".mp4");
              path_file = "".concat(process.env.COPY_TO_PATH, "/").concat(file_name);
              path_download = "".concat(process.env.LINK_DOWNLOAD, "/").concat(file_name);
              metadata = "".concat(domain, "presentation/").concat(meetingId, "/metadata.xml");
              request = {
                email: email,
                url: url,
                path_download: path_download,
                meetingId: meetingId
              };
              (0, _PermissionController["default"])(metadata, user).then(function (r) {
                if (!r) return res.json({
                  msg: 'Download não permitido. Por favor, contate o responsável pela gravação para mais informações'
                });
                (0, _fs.access)(path_file, _fs.F_OK, function (err) {
                  if (err) {
                    _Queue["default"].get('ConvertWeb', meetingId).then(function (response) {
                      if (response) {
                        if (response.finishedOn || response.failedReason) {
                          log.info('Remove Job - ', url);
                          response.remove().then(function () {
                            log.info('Add ConvertWeb Queue - ', url);

                            _Queue["default"].add('ConvertWeb', {
                              request: request
                            });
                          });
                        } else {
                          log.info('Add SendMail Queue - ', request);

                          _Queue["default"].add('SendMail', {
                            request: request
                          });
                        }
                      } else {
                        log.info('Add ConvertWeb Queue - ', url);

                        _Queue["default"].add('ConvertWeb', {
                          request: request
                        });
                      }
                    });

                    return res.json({
                      msg: 'Processando arquivo para download. Por favor, volte mais tarde. O link de download também será enviado para seu email.'
                    });
                  } // res.download(path_file, file_name)


                  log.info('Download - ', url);
                  return res.json({
                    msg: path_download
                  });
                });
              });

            case 17:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  },
  clean: function clean(req, res) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _Queue["default"].clean('ConvertWeb');

            case 2:
              _context2.next = 4;
              return _Queue["default"].clean('SendMail');

            case 4:
              return _context2.abrupt("return", res.json({
                msg: 'Limpo!'
              }));

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }))();
  }
};
exports["default"] = _default;