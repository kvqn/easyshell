FROM oven/bun:alpine

RUN apk add docker

WORKDIR /app/apps/queue-processor

ENTRYPOINT ["bun", "run", "dev"]
