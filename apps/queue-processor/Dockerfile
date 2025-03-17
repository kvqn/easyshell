FROM oven/bun:alpine AS build

WORKDIR /app

COPY . .
RUN bun i
RUN bun problems:build-pkg
RUN bunx esbuild apps/queue-processor/index.ts --bundle --platform=node --outfile=queue-processor.cjs

FROM node:22-alpine

RUN apk add docker

COPY --from=build /app/queue-processor.cjs /app/queue-processor.cjs

ENTRYPOINT ["node", "/app/queue-processor.cjs"]
