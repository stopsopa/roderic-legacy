cd react
forever --minUptime 5000 -v -a -c node servers/index.js $1 1>> $2 2>> $2 &
sleep 1
cat $2;