cd react

# --colors parameter issue: https://github.com/foreverjs/forever/issues/973

forever --minUptime 5000 -v -a -c node servers/index.js $1 --color 1>> $2 2>> $2 &
sleep 1
cat $2;