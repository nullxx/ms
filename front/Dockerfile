FROM bash:alpine3.12
RUN test -f src/lib/core/files/*.wasm || exit 1
RUN test -f src/lib/core/files/*.js || exit 1

FROM node:alpine AS install-deps

WORKDIR /app
COPY package.json package.json
COPY yarn.lock yarn.lock
RUN yarn

FROM node:alpine AS build

ENV GENERATE_SOURCEMAP=false

WORKDIR /app

COPY . .
COPY --from=install-deps /app/node_modules /app/node_modules
RUN yarn build

FROM nginx:latest
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html