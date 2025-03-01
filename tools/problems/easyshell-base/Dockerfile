FROM alpine:3.21 AS build

RUN apk add go

COPY entrypoint /src/entrypoint

RUN go build -C /src/entrypoint -o /bin/entrypoint

FROM alpine:3.21 AS base

RUN apk add zip

EXPOSE 8080

COPY --from=build /bin/entrypoint /entrypoint

