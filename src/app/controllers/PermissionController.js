import parser from 'fast-xml-parser';
import fetch from 'node-fetch';

export default async function checkPermission(metadata, email) {
  let meta_download = '';
  let meta_email = '';
  let resp = true;

  const data = await fetch(metadata);

  await data.text().then((d) => {
    const json = parser.parse(d);

    try {
      meta_download = json.recording.meta.download;
      meta_email = json.recording.meta.email;

      if (meta_download === 'true' || (meta_email === email)) { resp = true; }
    } catch (e) { resp = false; }
  });
  return resp;
}
