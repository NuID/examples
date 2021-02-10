client="js-react"
server="js-node"

go: go.watch

go.watch:
	watcher -cmd="make go.run" -keepalive -list -startcmd go/

go.run:
	cd go && go get && PORT=4001 go run .

js-react/node_modules:
	cd js-react && npm install

js-react: js-react/node_modules
	cd js-react && \
		REACT_APP_API_HOST=http://localhost:4001 \
		npm start

js-node/node_modules:
	cd js-node && npm install

js-node: js-node/node_modules
	NUID_API_KEY=$(NUID_API_KEY) \
		PORT=4001 \
		./node_modules/.bin/nodemon js-node/src/api.js

format:
	prettier-standard ./{js-react,js-node}/src/**/*.js

node_modules:
	npm install

start: node_modules
	./node_modules/.bin/concurrently \
		--names "$(client),$(server)" \
		-c "magenta.bold,green.bold" \
		"make $(client)" "make $(server)"

.PHONY: format go js-react js-node start
