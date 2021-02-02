client="js-react"
server="js-node"

js-react:
	cd js-react && \
		REACT_APP_API_HOST=http://localhost:4001 \
		npm start

js-node:
	NUID_API_KEY=$(NUID_API_KEY) \
		PORT=4001 \
		./node_modules/.bin/nodemon js-node/src/api.js

format:
	prettier-standard ./{js-react,js-node}/src/**/*.js

start:
	./node_modules/.bin/concurrently --names "$(client),$(server)" "make $(client)" "make $(server)"

.PHONY: format js-react js-node start
