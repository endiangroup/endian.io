NOW            := $(shell date)
GITHASH        := $(shell git describe --tags --always)
IMAGE_NAME     := endian.io
SASS_STYLE     ?= compressed
SASS_INCLUDES  ?= -I node_modules/foundation-sites/scss -I node_modules/aos/src/sass
SASS_PATHS     ?= themes/sherpa/styles:themes/sherpa/static/css
TS_PATHS       ?= themes/sherpa/scripts/*.ts
JS_PATH        ?= themes/sherpa/static/js/app.js

install: start
	@docker-compose exec $(IMAGE_NAME) make docker-install

start:
	@docker-compose build
	@docker-compose up -d
	@touch .started
	@echo "Docker containers are now running."

build: start
	@docker-compose exec $(IMAGE_NAME) make docker-build

clean:
	@docker-compose exec $(IMAGE_NAME) make docker-clean

watch: start
	@docker-compose exec $(IMAGE_NAME) make docker-serve

console: start
	@docker-compose exec $(IMAGE_NAME) /bin/bash

stop:
	@docker-compose kill
	@docker-compose stop
	@docker-compose rm -f
	-@rm .started

docker-install:
	@npm install
	@mkdir -p static/css

docker-build: docker-install
	@sass --style $(SASS_STYLE) $(SASS_INCLUDES) --update $(SASS_PATHS) -E "UTF-8"
	@tsc
	@sed 's/GITHASH/$(GITHASH)/' themes/sherpa/scripts/sw.js > themes/sherpa/static/sw.js
	@GITHASH=$(GITHASH) hugo

docker-serve: docker-install
	@sass --style $(SASS_STYLE) $(SASS_INCLUDES) --watch $(SASS_PATHS) -E "UTF-8" &
	@tsc -w &
	@sed 's/GITHASH/$(GITHASH)/' themes/sherpa/scripts/sw.js > themes/sherpa/static/sw.js &
	@GITHASH=$(GITHASH) hugo serve . --bind=0.0.0.0 -w

docker-clean:
	@rm -rf node_modules
	@rm -rf public
	@rm -rf .sass-cache
	@rm -rf themes/sherpa/static/sw.js
