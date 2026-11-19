ARG NODE_BUILD_IMAGE=docker.io/library/node:24.22.3-alpine@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5

FROM emscripten/emsdk:latest AS core-build
WORKDIR /cpu
COPY cpu /cpu
RUN make

FROM ${NODE_BUILD_IMAGE} AS install-deps
WORKDIR /app
COPY front/package.json front/yarn.lock ./
RUN yarn

FROM ${NODE_BUILD_IMAGE} AS build
ENV GENERATE_SOURCEMAP=false
WORKDIR /app
COPY front/. .
COPY --from=core-build /cpu/output/libMaquinaSencilla.wasm ./src/lib/core/files/
COPY --from=core-build /cpu/output/libMaquinaSencilla.js ./src/lib/core/files/
COPY --from=install-deps /app/node_modules /app/node_modules
RUN yarn build

# Nginx 1.30.7 includes the November security fixes and curl/libcurl 8.23.0.
FROM docker.io/nginx/nginx-unprivileged:1.30.7-alpine@sha256:0c53a1f2890c3526bfd201440f0fd3970e5b78f80630f58284aad0d34b5ec7bd
COPY front/deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
