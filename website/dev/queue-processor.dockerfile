FROM oven/bun:alpine

RUN apk add docker

WORKDIR /app

ENTRYPOINT ["bun", "queue-processor:dev"]
