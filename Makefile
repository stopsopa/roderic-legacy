
LOGFILE := "../var/logs/log_$(shell date +%Y-%m-%d_%H-%M-%S).log"
FLAG := "ses-server"

init:
	cd react && yarn

deploy:
	npm install -g yarn forever
	cd react && yarn prod
	make start

params:
	node install/install.entry.js --onlyFix --app_dir=app --react_dir=react --web_dir=docs --root=".." --app_name=test_app --jwtsecret=secret

stop:
	/bin/bash kill.sh ${FLAG}

start: stop
	/bin/bash start.sh ${FLAG} ${LOGFILE}
	





