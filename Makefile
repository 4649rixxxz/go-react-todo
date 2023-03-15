build:
	docker-compose build --no-cache --force-rm
up:
	docker-compose up -d 
create-project:
	@make build
	@make up
create-front:
	docker-compose exec front sh -c "npx create-react-app . --template typescript"
destroy:
	docker-compose down --rmi all --volumes --remove-orphans
app:
	docker-compose exec app sh
start:
	docker-compose start
stop:
	docker-compose stop
.PHONY: front
front:
	docker-compose exec front sh
.PHONY: api
api:
	docker-compose exec api /bin/sh
db:
	docker-compose exec db bash