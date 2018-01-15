
LOGFILE := "../var/logs/log_$(shell date +%Y-%m-%d_%H-%M-%S).log"
FLAG := "ses-server"

init:
	cd react && yarn

deploy:
	npm install -g yarn forever
	cd react && yarn prod
	make start

stop:
	/bin/bash kill.sh ${FLAG}

start:
	make stop
	/bin/bash start.sh ${FLAG} ${LOGFILE}
	





