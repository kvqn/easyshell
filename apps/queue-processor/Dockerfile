FROM oven/bun:alpine

RUN apk add docker

WORKDIR /app

COPY . .
RUN bun i
RUN bun problems:build-pkg

ENTRYPOINT ["bun", "./apps/queue-processor/index.ts"]
