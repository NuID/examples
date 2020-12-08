client:
	cd client && REACT_APP_API_HOST=http://localhost:4001 npm start

server:
	PORT=4001 ./node_modules/.bin/nodemon server/src/api.js

format:
	prettier-standard ./{client,server}/src/**/*.js

run:
	./node_modules/.bin/concurrently --names "client,server" "make client" "make server"

.PHONY: client format server run
