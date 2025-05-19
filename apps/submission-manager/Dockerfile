FROM node:22-alpine AS build
RUN apk add jq bash

WORKDIR /src

COPY . .

RUN npm ci

WORKDIR /src/apps/submission-manager

ENV PROJECT_ROOT=/src
RUN npm run cache
RUN npx esbuild index.ts --bundle --platform=node --outfile=submission-manager.cjs

FROM node:22-alpine

RUN apk add docker

COPY --from=build /src/apps/submission-manager/submission-manager.cjs /app/submission-manager.cjs

ENTRYPOINT ["node", "/app/submission-manager.cjs"]
