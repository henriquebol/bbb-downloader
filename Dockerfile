FROM node:10

RUN apt-get update && apt-get -y upgrade && apt-get install -y --no-install-recommends apt-utils

RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections
ENV APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=1

RUN apt-get -q install -y \
    dialog \
    software-properties-common
    
RUN curl -sS -o - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add
RUN echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list

#RUN add-apt-repository ppa:jonathonf/ffmpeg-4

RUN apt-get update

RUN apt-get -y install \
    google-chrome-stable \
    ffmpeg

RUN apt-get install -y \
    gconf-service \
	libasound2 \
	libatk1.0-0 \
 	libc6 \
 	libcairo2 \
 	libcups2 \
 	libdbus-1-3 \
 	libexpat1 \
 	libfontconfig1 \
 	libgcc1 \
 	libgconf-2-4 \
 	libgdk-pixbuf2.0-0 \
 	libglib2.0-0 \
 	libgtk-3-0 \
 	libnspr4 \
 	libpango-1.0-0 \
 	libpangocairo-1.0-0 \
 	libstdc++6 \
 	libx11-6 \
 	libx11-xcb1 \
 	libxcb1 \
 	libxcomposite1 \
 	libxcursor1 \
 	libxdamage1 \
 	libxext6 \
 	libxfixes3 \
 	libxi6 \
 	libxrandr2 \
 	libxrender1 \
 	libxss1 \
 	libxtst6 \
 	ca-certificates \
 	fonts-liberation \
 	libappindicator1 \
 	libnss3 \
 	lsb-release \
 	xdg-utils \
 	wget \
 	xvfb \
 	fonts-noto

WORKDIR /usr/app

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 8080

CMD ["yarn", "start"]