# Get dev deps because they are needed to build the app (sass and protobuffers),
# we'll delete them and install only production dependencies later
FROM node:alpine AS buildDeps
WORKDIR /app
RUN mkdir /app/packages
RUN mkdir /app/packages/common
RUN mkdir /app/packages/client

COPY package.json .
COPY packages/common/package.json ./packages/common
COPY packages/client/package.json ./packages/client

RUN yarn install --pure-lockfile --non-interactive

# ubuntu is needed for using the protocol buffer compiler (protoc)
FROM node:latest AS builder
WORKDIR /app
RUN apt-get install -y unzip
RUN apt-get install -y curl
RUN node -v

RUN npm install -g typescript -y

COPY --from=buildDeps /app/package.json ./package.json
COPY --from=buildDeps /app/node_modules ./node_modules
COPY --from=buildDeps /app/packages/client/node_modules ./packages/client/node_modules
COPY --from=buildDeps /app/packages/common/node_modules ./packages/common/node_modules

COPY packages/common/ ./packages/common/
COPY packages/client/src ./packages/client/src
COPY packages/client/public ./packages/client/public
COPY packages/client/package.json packages/client/next.config.js ./packages/client/

WORKDIR /app/packages/common
RUN tsc && echo compiled common directory
WORKDIR /
RUN curl -Lo protoc.zip "https://github.com/protocolbuffers/protobuf/releases/download/v3.19.6/protoc-3.19.6-linux-x86_64.zip"
RUN unzip -q protoc.zip bin/protoc -d /usr/local && chmod a+x /usr/local/bin/protoc && protoc --version
WORKDIR /app/packages/common
RUN yarn run compile-proto

RUN node --version

WORKDIR /app/packages/client
RUN yarn run build

# now that build is completed, we can delete dependencies and redownload only ones
# needed for production
WORKDIR /app
RUN rm -rf /node_modules
RUN rm -rf /packages/client/node_modules
RUN rm -rf /packages/common/node_modules
RUN yarn install --pure-lockfile --non-interactive --production=true


FROM node:alpine
WORKDIR /app
COPY --from=builder /app/packages/client/.next ./packages/client/.next
COPY --from=builder /app/packages/client/public ./packages/client/public
COPY --from=builder /app/packages/client/node_modules ./packages/client/node_modules
COPY --from=builder /app/packages/client/package.json ./packages/client
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
WORKDIR /app/packages/client
CMD ["yarn", "run", "start"]
