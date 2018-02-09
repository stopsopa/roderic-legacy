
LOGFILE := "../node-server-logs/log_$(shell date +%Y-%m-%d_%H-%M-%S).log"

# it is good to keep it the same like in docker/name.conf
# and match to regexp /^[a-z]+$ - just latin letters
FLAG := "rodericcore"

# https://docs.docker.com/compose/reference/envvars/#compose_project_name
COMPOSE_PROJECT_NAME:="$(shell cat docker/name.conf)"

export COMPOSE_PROJECT_NAME

name:
	@echo ${COMPOSE_PROJECT_NAME}

flag:
	@echo ${FLAG}

# deployment helper methods ------------------- vvv
init:
	cd react && yarn
	[ -f php/app/config/parameters.yml ] && echo 'file parameters.yml already exist' || cp php/app/config/parameters.yml.dist php/app/config/parameters.yml
	/bin/bash php.sh php composer.phar install

# on production you should run this method in order to deploy with no downtime
# of course change parameters for below deploy-timedown.sh script
# implementation inspiration:
# 	https://github.com/docker/compose/issues/734 <- this one
# 	https://docs.docker.com/compose/production/ <- here we have proof that i can't be done in docker alone
deploy:
	/bin/bash docker/proxy/deploy-timedown.sh \
		--docker_ports 76 78 \
		--node_ports 90 91 \
		--make_build docker-rebuild-prod \
		--http_config_for_proxy_pass_update docker/proxy/apache.conf

#		--http_config_for_proxy_pass_update docker/proxy/apache.conf \
#		--restart_server 1

# all below moved do to deploy-timedown.sh
#	npm install -g yarn forever
#	cd react && yarn prod
#	make start

deploy-local: deploy-local-stop init docker-rebuild-dev
	cd react && yarn dev

deploy-local-stop: docker-stop roderic-stop

# aliases
dl: deploy-local
dls: deploy-local-stop

docker-rebuild-dev: # local development environments, with local mysql instance
	/bin/bash docker/proxy/git-checkout.sh
	cd docker && docker-compose build && docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d --build

# use this to deploy to production when calling deploy-timedown.sh in param --make_build
# mysql server is remote - not provided from docker
docker-rebuild-prod:
	cd docker && docker-compose build && docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
# deployment helper methods ------------------- ^^^


# docker helper methods WARNING: usefull only in local/dev mode :WARNING----- vvv
docker-upw:
	cd docker && docker-compose -f docker-compose.yml -f docker-compose.local.yml up

docker-up:
	cd docker && docker-compose -f docker-compose.yml -f docker-compose.local.yml up -d

docker-log:
	cd docker && docker-compose -f docker-compose.yml -f docker-compose.local.yml logs

docker-logs: docker-log

docker-stop:
	cd docker && docker-compose -f docker-compose.yml -f docker-compose.local.yml stop

docker-destroy: docker-stop
	cd docker && docker-compose -f docker-compose.yml -f docker-compose.local.yml rm -f

docker-cli:
	/bin/bash php.sh bash
# docker helper methods WARNING: usefull only in local/dev mode :WARNING----- ^^^




# webpack helper methods ----- vvv
roderic-params:
	node install/install.entry.js --onlyFix --app_dir=app --react_dir=react --web_dir=docs --root=".." --app_name=test_app --jwtsecret=secret

roderic-stop:
	/bin/bash kill.sh ${FLAG}

roderic-start:
	/bin/bash start.sh ${FLAG} ${LOGFILE}

start: roderic-stop roderic-start
# webpack helper methods ----- ^^^

# php|symfony console (in docker) ----- vvv
console:
	@cat php.sh | grep '##'
# php|symfony console (in docker) ----- ^^^






