# Users

## Using composer

To build container:

```bash
docker build -t users .
```

To run composer make sure, that ports 8080, 3001, 3000, 5432 are available or modify compose.yaml:

```bash
docker-compose -f compose.yaml up -d
```

Run tests:
```bash
docker exec -it usersc bash
cd /home/app/users/
pnpm test
```

To see users in browser in json format:
http://localhost:3000/api/v1/users

To see all history in browser in json format:
http://localhost:3001/api/v1/history/

To see history by id in pages:
http://localhost:3001/api/v1/history/3




## To use adminer

http://localhost:8080

* System: PostgreSQL
* Server: db
* Username: postgres
* Password: password
* Database: postgres

password: password
data

## API description

### History service

port 3001

* POST '/api/v1/history' { action: "CREATE" | "UPDATE", userId: number, newValue: string} - create new user
* GET '/api/v1/history' - Get all history
* GET '/api/v1/history/:id/:page/:pageSize' - get history by page. :page and :pageSize are optional parameters


### User service

port 3000

* POST '/api/v1/users' { name: string } - create new user
* GET '/api/v1/users' - get all users
* PUT '/api/v1/users' { id: number, name: string } - modify number


To run a docker container with postgres:
```bash
docker-compose -f postgres.yaml up -d
```

To stop the docker container with postgres:
```bash
docker-compose -f postgres.yaml down
```

To init project:
```bash
cd users
pnpm install
pnpm prisma generate
cd ../history
pnpm install
pnpm prisma generate
```

To create databases:
```bash
cd users
pnpm prisma db push
```

To start users service:
```bash
cd users
pnpm start
```

To start history service:
```bash
cd history
pnpm start
```

To create user container
```bash
docker build -t users .
```

To run docker container with postgres:
```bash
docker run -v ./db:/var/lib/postresql/data -d --network postgres-network --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:16
```

To start docker container with users:
```bash
docker run --rm -p 3001:3001 -p 3000:3000 -d --name users --network postgres-network -e DATABASE_URL="postgresql://postgres:password@postgres:5432/postgres?schema=public" -e HISTORY_HOST=localhost users:latest
```

