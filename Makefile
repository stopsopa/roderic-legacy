
LOGFILE := "../var/logs/log_$(shell date +%Y-%m-%d_%H-%M-%S).log"
FLAG := "ses-server"

# https://docs.docker.com/compose/reference/envvars/#compose_project_name
COMPOSE_PROJECT_NAME := "react2"

export COMPOSE_PROJECT_NAME

init:
	cd react && yarn

deploy:
	npm install -g yarn forever
	cd react && yarn prod
	make start

docker-upw:
	cd docker && docker-compose up

docker-up:
	cd docker && docker-compose up -d

docker-log:
	cd docker && docker-compose logs

docker-logs: docker-log

docker-stop:
	cd docker && docker-compose stop

docker-destroy: docker-stop
	cd docker && docker-compose rm -f

docker-rebuild: docker-destroy
	cd docker && docker-compose up --force-recreate

docker-cli:
	/bin/bash php.sh bash




roderic-params:
	node install/install.entry.js --onlyFix --app_dir=app --react_dir=react --web_dir=docs --root=".." --app_name=test_app --jwtsecret=secret

roderic-stop:
	/bin/bash kill.sh ${FLAG}

start: roderic-stop
	/bin/bash start.sh ${FLAG} ${LOGFILE}

console:
	@cat php.sh | grep '##'






