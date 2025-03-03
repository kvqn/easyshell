FROM oven/bun:alpine


RUN apk add docker gcompat build-base

WORKDIR /app/apps/website

EXPOSE 3000
ENTRYPOINT ["bun", "run", "dev"]
