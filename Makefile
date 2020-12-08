client:
	cd client && REACT_APP_API_HOST=http://localhost:4001 npm start

server:
	PORT=4001 node server/api.js

run: client server

.PHONY: client server run
