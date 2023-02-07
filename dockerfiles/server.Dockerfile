FROM node:alpine AS deployDeps
WORKDIR /app
RUN mkdir /app/packages
RUN mkdir /app/packages/common
RUN mkdir /app/packages/server

COPY package.json .
COPY packages/common/package.json ./packages/common
COPY packages/server/package.json ./packages/server

RUN yarn install --pure-lockfile --non-interactive
FROM node:alpine AS buildDeps
WORKDIR /app
RUN mkdir /app/packages
RUN mkdir /app/packages/common
RUN mkdir /app/packages/server

COPY package.json .
COPY packages/common/package.json ./packages/common
COPY packages/server/package.json ./packages/server

RUN yarn install --pure-lockfile --non-interactive

FROM node:latest AS builder
RUN apt-get install -y unzip
RUN apt-get install -y curl
RUN npm install -g typescript -y
WORKDIR /
RUN curl -Lo protoc.zip "https://github.com/protocolbuffers/protobuf/releases/download/v3.19.6/protoc-3.19.6-linux-x86_64.zip" && unzip -q protoc.zip bin/protoc -d /usr/local && chmod a+x /usr/local/bin/protoc && protoc --version
WORKDIR /app

COPY --from=buildDeps /app/package.json ./package.json
COPY --from=buildDeps /app/node_modules ./node_modules
COPY --from=buildDeps /app/packages/server/node_modules ./packages/server/node_modules
COPY --from=buildDeps /app/packages/common/node_modules ./packages/common/node_modules

COPY packages/common/src ./packages/common/src
COPY packages/common/package.json packages/common/tsconfig.json ./packages/common/
COPY packages/server/src ./packages/server/src
COPY packages/server/package.json packages/server/tsconfig.json ./packages/server/

WORKDIR /app/packages/common
RUN tsc && echo compiled common directory
WORKDIR /app/packages/server
RUN tsc && echo compiled server directory
WORKDIR /app/packages/common
RUN yarn run compile-proto

FROM node:alpine
WORKDIR /app
COPY --from=builder /app/packages/server/dist ./packages/server/dist
COPY --from=builder /app/packages/common/dist ./packages/common/dist

COPY --from=deployDeps /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

COPY --from=builder /app/packages/server/package.json ./packages/server/package.json
COPY --from=deployDeps /app/packages/server/node_modules ./packages/server/node_modules

COPY --from=builder /app/packages/common/package.json ./packages/common/package.json
COPY --from=deployDeps /app/packages/common/node_modules ./packages/common/node_modules

WORKDIR /app/packages/server/dist
CMD ["node", "index.js"]
