FROM emscripten/emsdk:latest AS core-build
WORKDIR /cpu
COPY cpu /cpu
RUN make

FROM node:alpine AS install-deps
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn

FROM node:alpine AS build
ENV GENERATE_SOURCEMAP=false
WORKDIR /app
COPY . .
COPY --from=core-build /cpu/output/libMaquinaSencilla.wasm ./src/lib/core/files/
COPY --from=core-build /cpu/output/libMaquinaSencilla.js ./src/lib/core/files/
COPY --from=install-deps /app/node_modules /app/node_modules
RUN yarn build

FROM nginx:latest
COPY deploy/nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html