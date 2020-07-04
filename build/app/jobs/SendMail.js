"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _Mail = _interopRequireDefault(require("../lib/Mail"));

var log = require('simple-node-logger').createSimpleLogger('log/queue.log');

var _default = {
  key: 'SendMail',
  options: {
    delay: 3600000
  },
  handle: function handle(_ref) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var data, request;
      return _regenerator["default"].wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              data = _ref.data;
              request = data.request;
              log.info('Enviando email', request);
              _context.next = 5;
              return _Mail["default"].sendMail({
                from: 'Suporte <webconferencia.virtual.ufc.br>',
                to: request.email,
                subject: 'Download da webconferência',
                html: "Ol\xE1. Conforme solicitado, segue o link de download da sua webconfer\xEAncia. <a>".concat(request.path_download, "<a>.")
              });

            case 5:
            case "end":
              return _context.stop();
          }
        }
      }, _callee);
    }))();
  }
};
exports["default"] = _default;