PORT   = "4001"
client = "js-react"
server = "js-node"

include clojure-ring/Makefile

## CLIENT :: js-react

js-react/node_modules:
	cd js-react && npm install

js-react: js-react/node_modules
	cd js-react && \
		REACT_APP_API_HOST=http://localhost:$(PORT) \
		npm start

## CLIENT :: js-react-native

js-react-native/.env:
	echo "API_HOST=http://localhost:$(PORT)" > $@

js-react-native/ios/Pods:
	cd js-react-native/ios && pod install

js-react-native/ios: js-react-native/.env js-react-native/node_modules js-react-native/ios/Pods
	cd js-react-native && \
		yarn ios &

js-react-native/node_modules:
	cd js-react-native && yarn

js-react-native: js-react-native/ios

## SERVER :: GO

go: go.watch

go.watch:
	watcher -cmd="make go.run" -keepalive -list -startcmd go/

go.run:
	cd go && go get && PORT=$(PORT) go run .

## SERVER :: js-node

js-node/node_modules:
	cd js-node && npm install

js-node: js-node/node_modules
	PORT=$(PORT) ./node_modules/.bin/nodemon --watch js-node js-node/src/api.js

## SERVER :: ruby-rails

ruby-rails.bundle:
	cd ruby-rails && bin/bundle install

ruby-rails: ruby-rails.bundle
	cd ruby-rails && bin/bundle exec rails s -p $(PORT)

## Administration

format:
	prettier-standard ./{js-react,js-react-native,js-node}/src/**/*.js

node_modules:
	npm install

start: node_modules
	./node_modules/.bin/concurrently \
		--names "$(client),$(server)" \
		-c "magenta.bold,green.bold" \
		"make $(client)" "make $(server)"

.PHONY: format go js-react js-react-native js-react-native/ios js-react-native/android js-node start js-react-native/ios/Pods
