#FROM ubuntu:16.04
FROM node:9.11.1
RUN mkdir -p /usr/src/app

COPY package.json /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app

RUN apt-get update && \
apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 \
libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 \
libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 \
libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 \
ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget \
xvfb x11vnc x11-xkb-utils xfonts-100dpi xfonts-75dpi xfonts-scalable xfonts-cyrillic x11-apps

#RUN apt-get update && apt-get install -y curl build-essential
#RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
#RUN apt-get install -y nodejs
#RUN npm install node-pre-gyp --fallback-to-build
RUN npm config set registry https://registry.npmjs.org
RUN npm install
#RUN npm run build


# Creating Display
ENV DISPLAY :99
# Start script on Xvfb
CMD npm start
