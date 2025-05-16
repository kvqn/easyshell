FROM node:22-alpine AS build

WORKDIR /src

COPY . .

RUN npm ci

WORKDIR /src/apps/db-proxy

ENV PROJECT_ROOT=/src
RUN npm run build

FROM node:22-alpine

RUN apk add docker

COPY --from=build /src/apps/db-proxy/db-proxy.cjs /app/db-proxy.cjs

ENTRYPOINT ["node", "/app/db-proxy.cjs"]
