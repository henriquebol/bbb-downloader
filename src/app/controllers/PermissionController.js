import parser from 'fast-xml-parser';
import fetch from 'node-fetch';

export default async function checkPermission(metadata, email) {
  let meta_download = '';
  let meta_email = '';
  let resp = false;

  const data = await fetch(metadata);

  await data.text().then((d) => {
    const json = parser.parse(d);

    meta_download = json.recording.meta.download;
    meta_email = json.recording.meta.email;

    if (meta_download === 'true' || (meta_email === email)) { resp = true; }
  });
  return resp;
}
