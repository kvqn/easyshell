FROM oven/bun:alpine

RUN apk add docker npm

WORKDIR /app/apps/queue-processor

ENTRYPOINT ["bun", "run", "dev"]
