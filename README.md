# bbb-downloader


### Usage

Clone the project first:

```javascript
git clone https://github.com/henriquebol/bbb-recorder.git
cd bbb-downloader
```

```sh
docker-compose up -d
```

Now access:

```sh
localhost:8080
```

### How it will work?
When you will run the command that time `chromium` browser will be open in background & visit the link & perform screen recording. Later it will give you file mp4.

**Note: It will use extra CPU to process chrome & ffmpeg.** 


Thanks to [@jibon57](https://github.com/jibon57/bbb-recorder) and[@muralikg](https://github.com/muralikg/puppetcam). Lib was copied from there & I did some adjustment and add in a docker container. 
