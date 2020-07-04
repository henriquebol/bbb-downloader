"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _recorder = require("../lib/bbb-recorder/recorder");

var _Queue = _interopRequireDefault(require("../lib/Queue"));

var log = require('simple-node-logger').createSimpleLogger('log/queue.log');

var _default = {
  key: 'ConvertWeb',
  options: {
    attempts: 3
  },
  handle: function handle(_ref) {
    return (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
      var data, request;
      return _regenerator["default"].wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              data = _ref.data;
              request = data.request;
              log.info('Starting Recording - ', request.url);
              _context2.next = 5;
              return (0, _recorder.startRecording)(request.url).then( /*#__PURE__*/function () {
                var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(exportname) {
                  return _regenerator["default"].wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          log.info('Convert And Copy - ', request.url);
                          _context.next = 3;
                          return (0, _recorder.convertAndCopy)(exportname);

                        case 3:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee);
                }));

                return function (_x) {
                  return _ref2.apply(this, arguments);
                };
              }()).then(function () {
                log.info('Send Mail - ', request.url);

                _Queue["default"].add('SendMail', {
                  request: request
                });
              })["catch"](function (e) {
                console.log('RETRY -> request', request);

                _Queue["default"].get('ConvertWeb', request.meetingId).then(function (response) {
                  log.info('Remove Job - ', request.url);
                  response.remove().then(function () {
                    log.info('Add ConvertWeb Queue - ', request.url);

                    _Queue["default"].add('ConvertWeb', {
                      request: request
                    });

                    log.error(e);
                  });
                });
              });

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