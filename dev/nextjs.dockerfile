FROM oven/bun:alpine


RUN apk add docker gcompat build-base

WORKDIR /app

EXPOSE 3000
ENTRYPOINT ["bun", "next:dev"]
