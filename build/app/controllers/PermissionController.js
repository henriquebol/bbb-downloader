"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _fastxmlparser = require('fast-xml-parser'); var _fastxmlparser2 = _interopRequireDefault(_fastxmlparser);
var _nodefetch = require('node-fetch'); var _nodefetch2 = _interopRequireDefault(_nodefetch);

 async function checkPermission(metadata, user) {
  let download = '';
  let moderator = '';
  let resp = false;

  const data = await _nodefetch2.default.call(void 0, metadata);

  await data.text().then((d) => {
    const json = _fastxmlparser2.default.parse(d);

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
        if (moderator === user) { resp = true; }
        break;
      default:
        resp = true;
    }
  });
  return resp;
} exports.default = checkPermission;
