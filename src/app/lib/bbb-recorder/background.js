/* global chrome, MediaRecorder, FileReader */

let recorder = null;
let filename = null;
let ws;
let liveSteam = false;
let ffmpegServer;
let doDownload = true;

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    console.log(msg);
    switch (msg.type) {
      case 'SET_EXPORT_PATH':
        filename = msg.filename;
        break;

      case 'FFMPEG_SERVER':
        ffmpegServer = msg.ffmpegServer;
        startWebsock();
        break;

      case 'REC_STOP':
        doDownload = true;
        recorder.stop();
        break;

      case 'REC_START':
        if (liveSteam) {
          recorder.start(1000);
        } else {
          recorder.start();
        }
        break;

      case 'REC_CLIENT_PLAY':
        if (recorder) {
          return;
        }
        const { tab } = port.sender;
        tab.url = msg.data.url;
        chrome.desktopCapture.chooseDesktopMedia(['tab', 'audio'], (streamId) => {
          // Get the stream
          navigator.webkitGetUserMedia({
            audio: {
              mandatory: {
                chromeMediaSource: 'system',
              },
            },
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: streamId,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720,
                minFrameRate: 60,
              },
            },
          }, (stream) => {
            let chunks = [];
            recorder = new MediaRecorder(stream, {
              videoBitsPerSecond: 2500000,
              ignoreMutedMedia: true,
              mimeType: 'video/webm;codecs=h264',
            });
            recorder.ondataavailable = function (event) {
              if (event.data.size > 0) {
                chunks.push(event.data);
                if (liveSteam) {
                  ws.send(event.data);
                }
              }
            };

            recorder.onstop = function () {
              if (liveSteam) {
                ws.close();
              }

              if (!doDownload) {
                chunks = [];
                return;
              }

              const superBuffer = new Blob(chunks, {
                type: 'video/webm',
              });

              const url = URL.createObjectURL(superBuffer);
              const a = document.createElement('a');
              document.body.appendChild(a);
              a.style = 'display: none';
              a.href = url;
              a.download = 'test.webm';
              a.click();

              chrome.downloads.download({
                url,
                filename,
              }, () => {
              });
            };
          }, (error) => console.log('Unable to get user media', error));
        });
        break;
      default:
        console.log('Unrecognized message', msg);
    }
  });

  chrome.downloads.onChanged.addListener((delta) => {
    if (!delta.state || (delta.state.current != 'complete')) {
      return;
    }
    console.log('delta', delta);

    try {
      port.postMessage({ downloadComplete: true });
    } catch (e) { }
  });
});

function startWebsock() {
  ws = new WebSocket(ffmpegServer);
  liveSteam = true;

  ws.onmessage = function (e) {
    console.log(e.data);

    if (e.data == 'ffmpegClosed') {
      doDownload = false;
      recorder.stop();

      setTimeout(() => {
        startWebsock();
        recorder.start(1000);
      }, 500);
    }
  };
}
