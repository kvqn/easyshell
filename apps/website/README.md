# Dev Server

```
docker compose -f ./dev/compose.yml up
```

or simply

```
bun dev
```

## First time setup

```
bun i
docker network create easyshell
docker compose -f ./dev/compose.yml up -d
```

Now you need to initialize the db

```
docker exec -it easyshell-postgres psql -U postgres -c 'create database easyshell'
docker exec -it easyshell-nextjs bunx drizzle-kit push
```
