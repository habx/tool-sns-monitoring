FROM habx/node-base:9-alpine

RUN rm ~/.npmrc
COPY . .
