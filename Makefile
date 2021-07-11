create-db:
	docker exec -u postgres demo_pg createdb --username=postgres --owner=postgres demo

drop-db:
	docker stop demo_pg && docker start demo_pg && docker exec -u postgres demo_pg dropdb demo

start-db:
	docker start demo_pg

init-db:
	docker pull postgres:12-alpine && docker run --name demo_pg -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -d postgres:12-alpine

init-rd:
	docker pull redis:6.2.4-alpine && docker run --name redis_docker -p 6379:6379 -d redis:6.2.4-alpine

start-rd:
	docker start redis_docker

gen-migration:
	npm run build && npx typeorm migration:generate -n $(NAME)

run-migration:
	npm run build && npx typeorm migration:run

.PHONY: createdb gen-migration init-docker-db start-dockerdb dropdb print