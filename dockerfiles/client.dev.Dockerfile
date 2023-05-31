FROM node:latest AS builder
WORKDIR /
RUN apt-get install -y unzip
RUN apt-get install -y curl
RUN curl -Lo protoc.zip "https://github.com/protocolbuffers/protobuf/releases/download/v3.19.6/protoc-3.19.6-linux-x86_64.zip"
RUN unzip -q protoc.zip bin/protoc -d /usr/local && chmod a+x /usr/local/bin/protoc && protoc --version
RUN npm install -g typescript -y

WORKDIR /app
COPY package.json .
RUN mkdir /app/packages
RUN mkdir /app/packages/client
RUN mkdir /app/packages/common

COPY packages/client/package.json ./packages/client
COPY packages/common/package.json ./packages/common

RUN yarn install --pure-lockfile --non-interactive --network-timeout 1000000

COPY packages/client ./packages/client
COPY packages/common ./packages/common

WORKDIR /app/packages/client
# server container will take care of watching proto and common tsc
CMD ["yarn", "develop"]
