const puppeteer = require('puppeteer');
const Xvfb = require('xvfb');
const fs = require('fs');
const os = require('os');

const homedir = os.homedir();
const platform = os.platform();
const { spawn } = require('child_process');

const xvfb = new Xvfb({
  timeout: 10000,
  silent: true,
  xvfb_args: ['-screen', '0', '1280x800x24', '-ac', '-nolisten', 'tcp', '-dpi', '96', '+extension', 'RANDR'],
});
const width = 1280;
const height = 720;
const options = {
  headless: false,
  // dumpio: true,
  // timeout: 0,
  args: [
    '--enable-usermedia-screen-capturing',
    '--allow-http-screen-capture',
    '--auto-select-desktop-capture-source=bbbrecorder',
    `--load-extension=${__dirname}`,
    `--disable-extensions-except=${__dirname}`,
    '--disable-infobars',
    '--no-sandbox',
    '--shm-size=1gb',
    '--disable-dev-shm-usage',
    '--start-fullscreen',
    '--app=https://www.google.com/',
    `--window-size=${width},${height}`,
  ],
};

if (platform == 'linux') {
  options.executablePath = '/usr/bin/google-chrome';
} else if (platform == 'darwin') {
  options.executablePath = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome';
}

exports.startRecording = async (url) => {
  try {
    if (platform == 'linux') {
      await xvfb.startSync();
    }

    // var url = process.argv[2];
    if (!url) {
      console.warn('URL undefined!');
      process.exit(1);
    }
    // Verify if recording URL has the correct format
    const urlRegex = new RegExp('^https?:\\/\\/.*\\/playback\\/presentation\\/2\\.0\\/' + 'playback\\.html' + '\\?meetingId=[a-z0-9]{40}-[0-9]{13}');
    if (!urlRegex.test(url)) {
      console.warn('Invalid recording URL!');
      process.exit(1);
    }

    let exportname = process.argv[3];
    // Use meeting ID as export name if it isn't defined or if its value is "MEETING_ID"
    if (!exportname || exportname == 'MEETING_ID') {
      exportname = `${url.split('=')[1]}.webm`;
    }

    let duration = process.argv[4];
    // If duration isn't defined, set it in 0
    if (!duration) {
      duration = 0;
      // Check if duration is a natural number
    } else if (!Number.isInteger(Number(duration)) || duration < 0) {
      console.warn('Duration must be a natural number!');
      process.exit(1);
    }

    let convert = process.argv[5];
    if (!convert) {
      convert = false;
    } else if (convert !== 'true' && convert !== 'false') {
      console.warn('Invalid convert value!');
      process.exit(1);
    }

    const browser = await puppeteer.launch(options);
    const pages = await browser.pages();

    const page = pages[0];

    page.on('console', (msg) => {
      const m = msg.text();
      console.log('PAGE LOG:', m); // uncomment if you need
    });

    await page._client.send('Emulation.clearDeviceMetricsOverride');
    // Catch URL unreachable error
    await page.goto(url, { waitUntil: 'networkidle2' }).catch((e) => {
      console.error('Recording URL unreachable!');
      process.exit(2);
    });
    await page.setBypassCSP(true);

    // Check if recording exists (search "Recording not found" message)
    const loadMsg = await page.evaluate(() => document.getElementById('load-msg').textContent);
    if (loadMsg == 'Recording not found') {
      console.warn('Recording not found!');
      process.exit(1);
    }

    // Get recording duration
    const recDuration = await page.evaluate(() => document.getElementById('video').duration);
    // If duration was set to 0 or is greater than recDuration, use recDuration value
    if (duration == 0 || duration > recDuration) {
      duration = recDuration;
    }

    await page.waitForSelector('button[class=acorn-play-button]');
    await page.$eval('#navbar', (element) => element.style.display = 'none');
    await page.$eval('#copyright', (element) => element.style.display = 'none');
    await page.$eval('.acorn-controls', (element) => element.style.opacity = '0');
    await page.click('button[class=acorn-play-button]', { waitUntil: 'domcontentloaded' });

    await page.evaluate((x) => {
      window.postMessage({ type: 'REC_START' }, '*');
    });

    // Perform any actions that have to be captured in the exported video
    await page.waitFor((duration * 1000));

    await page.evaluate((filename) => {
      window.postMessage({ type: 'SET_EXPORT_PATH', filename }, '*');
      window.postMessage({ type: 'REC_STOP' }, '*');
    }, exportname);

    // try {
    await page.waitForSelector('html.downloadComplete', { timeout: 0 });
    // } catch (err) {
    //   throw new Error(400);
    // }

    await page.close();
    await browser.close();

    if (platform == 'linux') {
      xvfb.stopSync();
    }

    // convertAndCopy(exportname)
    return exportname;
  } catch (err) {
    console.log(err);
  }
};

exports.convertAndCopy = async (filename) => {
  const copyFromPath = `${homedir}/Downloads`;
  const copyToPath = process.env.COPY_TO_PATH;
  const onlyfileName = await filename.split('.webm');
  const mp4File = `${onlyfileName[0]}.mp4`;
  const copyFrom = `${copyFromPath}/${filename}`;
  const copyTo = `${copyToPath}/${mp4File}`;

  if (!fs.existsSync(copyToPath)) {
    fs.mkdirSync(copyToPath);
  }

  const ls = spawn('ffmpeg',
    ['-y',
      `-i "${copyFrom}"`,
      '-c:v libx264',
      '-preset veryfast',
      '-movflags faststart',
      '-profile:v high',
      '-level 4.2',
      '-max_muxing_queue_size 9999',
      '-vf mpdecimate',
      `-vsync vfr "${copyTo}"`,
    ],
    {
      shell: true,
    });

  ls.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  ls.stderr.on('data', (data) => {
    // console.error(`stderr: ${data}`);
    // reject(data);
  });

  ls.on('close', (code) => {
    // console.log(`child process exited with code ${code}`);
    if (code == 0) {
      // console.log(`Convertion done to here: ${copyTo}`);
      fs.unlinkSync(copyFrom);
      // console.log('.webm successfully deleted');
      return (mp4File);
    } return (code);
  });
};
