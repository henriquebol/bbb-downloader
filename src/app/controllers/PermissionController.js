import parser from 'fast-xml-parser';
import fetch from 'node-fetch';

export default async function checkPermission(metadata, user) {
  let download = '';
  let moderator = '';
  let resp = false;

  const data = await fetch(metadata);

  await data.text().then((d) => {
    const json = parser.parse(d);

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
}
