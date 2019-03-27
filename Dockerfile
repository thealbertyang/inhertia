FROM ubuntu:16.04
RUN mkdir -p /usr/src/app

COPY package.json /usr/src/app
COPY . /usr/src/app
WORKDIR /usr/src/app


RUN apt-get update && apt-get install -y curl build-essential
RUN curl -sL https://deb.nodesource.com/setup_9.x | bash -
RUN apt-get install -y nodejs
RUN npm install node-pre-gyp --fallback-to-build
RUN npm config set registry https://registry.npmjs.org
RUN npm install
#RUN npm run build

CMD npm start
