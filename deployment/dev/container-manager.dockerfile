FROM alpine:3.21 AS build

RUN apk add go

COPY . .

RUN go build

FROM alpine:3.21 AS base

RUN apk add docker

EXPOSE 4000

COPY --from=build /container-manager /container-manager

ENTRYPOINT ["/container-manager"]

