FROM emscripten/emsdk:latest AS core-build
WORKDIR /cpu
COPY cpu /cpu
RUN make

FROM node:alpine AS install-deps
WORKDIR /app
COPY front/package.json front/yarn.lock ./
RUN yarn

FROM node:alpine AS build
ENV GENERATE_SOURCEMAP=false
WORKDIR /app
COPY front/. .
COPY --from=core-build /cpu/output/libMaquinaSencilla.wasm ./src/lib/core/files/
COPY --from=core-build /cpu/output/libMaquinaSencilla.js ./src/lib/core/files/
COPY --from=install-deps /app/node_modules /app/node_modules
RUN yarn build

# curl CVE-2026-92392: immutable Nginx base qualified with curl/libcurl 8.23.0.
FROM registry-nu-1.filess.io/hosting/curl-nginx@sha256:27752cc10d58b8ee47f351faffe3e4c6e9ad89eb2f94210bc18bab75d686791e
COPY front/deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
