FROM node:22-alpine AS build
RUN apk add jq bash

WORKDIR /src

COPY . .

RUN npm ci

WORKDIR /src/apps/queue-processor

ENV PROJECT_ROOT=/src
RUN npm run cache
RUN npx esbuild index.ts --bundle --platform=node --outfile=queue-processor.cjs

FROM node:22-alpine

RUN apk add docker

COPY --from=build /src/apps/queue-processor/queue-processor.cjs /app/queue-processor.cjs

ENTRYPOINT ["node", "/app/queue-processor.cjs"]
