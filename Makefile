
LOGFILE := "../var/logs/log_$(shell date +%Y-%m-%d_%H-%M-%S).log"
FLAG := "ses-server"


init:
	cd react && yarn

deploy:
	npm install -g yarn forever
	cd react && yarn prod
	make roderic-start



docker-up:
	cd docker && docker-compose up -d

docker-log:
	cd docker && docker-compose logs

docker-logs: docker-log

docker-stop:
	cd docker && docker-compose stop

docker-destroy:
	cd docker && docker-compose rm




roderic-params:
	node install/install.entry.js --onlyFix --app_dir=app --react_dir=react --web_dir=docs --root=".." --app_name=test_app --jwtsecret=secret

roderic-stop:
	/bin/bash kill.sh ${FLAG}

roderic-start: roderic-stop
	/bin/bash start.sh ${FLAG} ${LOGFILE}
	





