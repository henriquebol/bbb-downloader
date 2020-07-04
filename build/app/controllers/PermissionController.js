"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = checkPermission;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fastXmlParser = _interopRequireDefault(require("fast-xml-parser"));

var _nodeFetch = _interopRequireDefault(require("node-fetch"));

function checkPermission(_x, _x2) {
  return _checkPermission.apply(this, arguments);
}

function _checkPermission() {
  _checkPermission = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(metadata, user) {
    var download, moderator, resp, data;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            download = '';
            moderator = '';
            resp = false;
            _context.next = 5;
            return (0, _nodeFetch["default"])(metadata);

          case 5:
            data = _context.sent;
            _context.next = 8;
            return data.text().then(function (d) {
              var json = _fastXmlParser["default"].parse(d);

              download = json.recording.meta.download;
              moderator = json.recording.meta.moderator;

              switch (download) {
                case 'false':
                  resp = false;
                  break;

                case 'all':
                  resp = true;
                  break;

                case 'moderator':
                  if (moderator === user) {
                    resp = true;
                  }

                  break;

                default:
                  resp = true;
              }
            });

          case 8:
            return _context.abrupt("return", resp);

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _checkPermission.apply(this, arguments);
}