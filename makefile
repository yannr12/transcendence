all:
	npm install && npm install --prefix ./frontend && \
	npx tsc -p frontend && \
	docker-compose down && \
	docker-compose build --no-cache && \
	docker-compose up -d

fclean:
	docker compose down --volumes && \
	docker-compose down && \
	docker system prune -a && \
	rm -rf frontend/public/scripts/*.js frontend/public/scripts/pong/*.js frontend/public/scripts/pong/objects/*.js frontend/src/*.js frontend/public/scripts/public node_modules frontend/node_modules

fdata:
	make fclean && rm backend/service_auth/data/authentification.db && rm backend/service_account/data/account.db

re: fclean all

.PHONY: all fclean fdata re