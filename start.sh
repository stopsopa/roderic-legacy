set -e

set -o xtrace

PORT=$(node -e "var i = require('./react/config.js'); console.log(i.server.port)")

# --colors parameter issue: https://github.com/foreverjs/forever/issues/973
cd react

LOGFILE=$(node -e "var path = require(\"path\");console.log(path.resolve('$2'))");

#node servers/index.js $1 $PORT --color & disown

forever --minUptime 5000 -v -a -c node servers/index.js $1 $PORT --color 1>> $LOGFILE 2>> $LOGFILE &
sleep 5
cat $2;