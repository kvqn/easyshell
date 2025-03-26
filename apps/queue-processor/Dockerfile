FROM node:22-alpine AS build

WORKDIR /src

COPY . .

WORKDIR /src/apps/queue-processor
ENV PROJECT_ROOT=/src
RUN npm i
RUN npm run problems:cache
RUN npx esbuild index.ts --bundle --platform=node --outfile=queue-processor.cjs

FROM node:22-alpine

RUN apk add docker

COPY --from=build /src/apps/queue-processor/queue-processor.cjs /app/queue-processor.cjs

ENTRYPOINT ["node", "/app/queue-processor.cjs"]
