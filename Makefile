NOW            := $(shell date)
GITHASH        := $(shell git describe --tags --always)
IMAGE_NAME     := endian.io
TS_PATHS       ?= themes/sherpa/scripts/*.ts
JS_PATH        ?= themes/sherpa/static/js/app.js

.PHONY: install build clean watch console stop \
	    docker-npm-install docker-npm-ci \
		docker-install docker-build docker-serve docker-clean

install: .started
	@docker-compose exec $(IMAGE_NAME) make docker-install

.started:
	@docker-compose build
	@docker-compose up -d
	@touch .started
	@echo "Docker containers are now running."

build: .started
	@docker-compose exec $(IMAGE_NAME) make docker-build

clean:
	@docker-compose exec $(IMAGE_NAME) make docker-clean

watch: .started
	@docker-compose exec $(IMAGE_NAME) make docker-serve

console: .started
	@docker-compose exec $(IMAGE_NAME) /bin/bash

stop:
	@docker-compose kill
	@docker-compose stop
	@docker-compose rm -f
	-@rm .started

docker-npm-install:
	@npm install

docker-npm-ci:
	@npm ci

docker-build: docker-npm-ci
	@tsc
	@sed 's/GITHASH/$(GITHASH)/' themes/sherpa/scripts/sw.js > themes/sherpa/static/sw.js
	@GITHASH=$(GITHASH) HUGO_BASEURL=$(HUGO_BASEURL) HUGO_ENV=$(HUGO_ENV) hugo

docker-serve: docker-npm-install
	@tsc -w &
	@sed 's/GITHASH/$(GITHASH)/' themes/sherpa/scripts/sw.js > themes/sherpa/static/sw.js &
	@GITHASH=$(GITHASH) HUGO_BASEURL=$(HUGO_BASEURL) HUGO_ENV=$(HUGO_ENV) hugo serve . --bind=0.0.0.0 -w

docker-clean:
	@rm -rf node_modules
	@rm -rf public
	@rm -rf themes/sherpa/static/sw.js
