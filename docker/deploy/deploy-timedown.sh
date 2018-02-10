#!/bin/bash

#   ip address for:
#       - pma 74
#       - php web docker container (pool) 73 72
#       - main node server (pool) 93 94
#
#   [prod & local]
#       setup docker composer prefix in:
#           docker/name.conf
#
#   [prod & local]
#       setup $FLAG parameter in:
#           Makefile
#       check also log file generation in:
#           Makefile
#
#   [prod & local]
#       setup PASSWORD for mysql in corresponding docker-compose.*.yml:
#           - container "phpmyadmin"
#           - container "mysql" [only for dev/local env]
#
#   [prod & local]
#       setup port for pma in file:
#           docker/docker-compose.yml
#
#   [prod & local - optional]
#       optionally change password for pma in:
#           docker/pma/basic_auth.php line: 8
#
#   [prod]
#       /bin/bash docker/deploy/deploy-timedown.sh \
#		    --docker_ports 73 72 \
#		    --node_ports 93 94 \
#		    --make_build docker-rebuild-prod \
#		    --http_config_for_proxy_pass_update docker/deploy/apache.conf \
#           --restart_server 1
#       WARNING: be careful to choose different port from declared in any docker-compose*.yml files :WARNING
#
#   [prod]
#       add --restart_server 1     flag to command running deploy-timedown.sh in Makefile
#
#   [local]
#       make sure that local (on host machine) directory for mysql db files exist
#       see: docker-compose.local.yml -> services.mysql.volumes
#
#   [local]
#       change default port for node in file:
#           react/hosts.js lines: 12 and 16
#
#   [local]
#       change default php port in files: (the same port in both files)
#           app/server.config.js        -> php_proxy.port
#               and in
#           docker/docker-compose.yml   -> services.web.ports
#

#browser test script, test against /endpoint/up.php
#(function run(prefix = '') {
#    fetch('?_' + prefix)
#        .then(res => res.text())
#        .then(msg => setTimeout(run, 200, (msg.length > 300) ? 'long' : msg ))
#}())


# @todo
# protect pma (basic auth) (done)
# expose mysql db files to host machine (done)
# describe step by step what to do (done)
# param with apache config to change (done)

echo -e "\n\n\n WARNING run this script only through 'make deploy' WARNING\n\n"

BASENAME="$(echo "$(basename $0)" | sed -E 's/^(.*)\.[^\.]+$/\1/g')"

# /bin/bash docker/deploy/deploy-timedown.sh --docker_ports 82 83 84 --node_ports 92 93 94 --make_build docker-rebuild-prod --restart_server 1

echo -e "        ------ processing parameters -------- vvv\n\n"

    DOCKER_PORTS=""
    NODE_PORTS=""
    MAKE_BUILD=""
    APACHE_CONFIG=""
    RESTART=0

    CURRENT="";
    REGNUM="^[0-9]+$"
    DASHREG="^--"
    for arg in "$@"
    do
        if [[ $arg =~ $DASHREG ]]; then
            CURRENT="$arg"
        else
            if [[ $arg =~ $REGNUM ]]; then
                if [ "$CURRENT" == "--docker_ports" ]; then
                    DOCKER_PORTS="$DOCKER_PORTS $arg"
                fi
                if [ "$CURRENT" == "--node_ports" ]; then
                    NODE_PORTS="$NODE_PORTS $arg"
                fi
            fi

            if [ "$CURRENT" == "--make_build" ]; then
                MAKE_BUILD="$arg"
            fi

            if [ "$CURRENT" == "--http_config_for_proxy_pass_update" ]; then
                APACHE_CONFIG="$arg"
            fi

            if [ "$CURRENT" == "--restart_server" ]; then
                RESTART=1
            fi
        fi
    done

    DOCKER_PORTS=$(echo $DOCKER_PORTS | xargs)
    NODE_PORTS=$(echo $NODE_PORTS | xargs)

    IFS=' ' read -ra a <<<"$DOCKER_PORTS";
    DOCKER_PORTS_ARRAY=("${a[@]}")

    IFS=' ' read -ra a <<<"$NODE_PORTS";
    NODE_PORTS_ARRAY=("${a[@]}")

    if [ "${#DOCKER_PORTS_ARRAY[@]}" -lt 2 ]; then

        echo -e "        --docker_ports should provide 2 or more ports"

        exit 1
    fi

    if [ "${#NODE_PORTS_ARRAY[@]}" -lt 2 ]; then

        echo -e "        --node_ports should provide 2 or more ports"

        exit 1
    fi

    if [[ -z $MAKE_BUILD ]]; then

        echo -e "Specify please make build command (in --make_build parameter)"

        exit 1
    fi

    if [[ -z $APACHE_CONFIG ]]; then

        echo -e "Specify config file to alter proxypass (in --http_config_for_proxy_pass_update parameter)"

        exit 1
    fi

    if [ ! -e "$APACHE_CONFIG" ]; then

        echo -e "File '$APACHE_CONFIG' doesn't exist"

        exit 1
    fi

    echo -e "\n\nchecking parameters:"
    declare -p DOCKER_PORTS_ARRAY;
    declare -p NODE_PORTS_ARRAY;

    echo -e "APACHE_CONFIG: $APACHE_CONFIG"
    echo -e "MAKE_BUILD: $MAKE_BUILD"
    echo -e "RESTART: $RESTART\n\n\n"

echo -e "\n\n        ------ processing parameters -------- ^^^"


echo -e "        ------ testing gnu sed & forever -------- vvv\n\n"
    # echo run sed test
    echo 'test' | sed -r 's#test##g'

    if [ "$?" != "0" ]; then

        echo -e "\n\nGnu 'sed' is not available. Please run: \n    brew install --with-default-names gnu-sed\n    ... and restart shell\n\n"

        exit 1
    fi

    echo -e "\n\n Now i'm gonna run test if 'forever' is available, if isn't then run:\n\n    npm install -g forever\n\n ... and run this procedure again\n\n"

    forever -v

echo -e "\n\n        ------ testing gnu sed & forever -------- ^^^"

set -e

set -x

#THISFILE=${BASH_SOURCE[0]}
#DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"
#cd $DIR;

# extract just first part
set +x && echo -e "        ------ extracting docker prefix -------- vvv\n\n" && set -x
DOCKER_CONTAINER_PREFIX="$(cat docker/name.conf | sed -E 's#^([a-z_]+).*#\1#g')"

if [ "$DOCKER_CONTAINER_PREFIX" == "" ]; then
    echo "Can't find docker name in ../name.conf"
    exit 1;
fi

TEST="^[a-z]+$"

if [[ $DOCKER_CONTAINER_PREFIX =~ $TEST ]]; then
    echo "name '$DOCKER_CONTAINER_PREFIX' match pattern '$TEST'";
else
    echo -e "Prefix name for containers should match regexp '$TEST' \n and it is: '$DOCKER_CONTAINER_PREFIX'";
    exit 1;
fi
set +x && echo -e "\n\n        ------ extracting docker prefix -------- ^^^"


echo -e "        ------ extracting current (if up) docker web port -------- vvv\n\n" && set -x

    echo 'current list of contaienrs (all)';
    docker ps -a

    CURRENT_DOCKER_WEB_PORT="$(docker ps --format '{{.Names}}' | grep $DOCKER_CONTAINER_PREFIX | grep "_web_" | head -n 1)";
    echo -e "\n\nisolated web container for further port extraction:\n\n$CURRENT_DOCKER_WEB_PORT\n\n"
    CURRENT_DOCKER_WEB_PORT="$(echo -e "$CURRENT_DOCKER_WEB_PORT" | sed -r 's#[a-z_]+([0-9]+).+#\1#g')";

    KEEP_BEFORE_UP=1;

    if [ "$CURRENT_DOCKER_WEB_PORT" == '' ]; then

        echo "NO DEFAULT - ASSIGNING DEFAULT"

        KEEP_BEFORE_UP=0;
        CURRENT_DOCKER_WEB_PORT="${DOCKER_PORTS_ARRAY[0]}"
    fi

    echo $CURRENT_DOCKER_WEB_PORT;

    TEST="^[0-9]+$"

    if [[ $CURRENT_DOCKER_WEB_PORT =~ $TEST ]]; then
        echo "docker port '$CURRENT_DOCKER_WEB_PORT' match pattern '$TEST'";
    else
        echo -e "Prefix name for containers should match regexp '$TEST' \n and it is: '$CURRENT_DOCKER_WEB_PORT'";
        exit 1;
    fi
set +x && echo -e "\n\n        ------ extracting current (if up) docker web port -------- ^^^"

echo -e "        ------ picking next docker port -------- vvv\n\n" && set -x
NEXT_DOCKER_WEB_PORT="$(node docker/deploy/replaceport.js --current $CURRENT_DOCKER_WEB_PORT --pool $DOCKER_PORTS)";
set +x && echo -e "\n\n        ------ picking next docker port -------- ^^^"


echo -e "        ------ fetching NODE_SERVER_PROCESS_FLAG -------- vvv\n\n" && set -x
    NODE_SERVER_PROCESS_FLAG="$(make -s flag)"

    echo $NODE_SERVER_PROCESS_FLAG

    TEST="^[a-z]+$"

    if [[ $NODE_SERVER_PROCESS_FLAG =~ $TEST ]]; then
        echo "node server flag '$NODE_SERVER_PROCESS_FLAG' match pattern '$TEST'";
    else
        echo -e "node server flag should match regexp '$TEST' \n and it is: '$NODE_SERVER_PROCESS_FLAG'";
        exit 1;
    fi
set +x && echo -e "\n\n        ------ fetching NODE_SERVER_PROCESS_FLAG -------- ^^^"



echo -e "        ------ extracting CURRENT_NODE_WEB_PORT -------- vvv\n\n" && set -x

    CURRENT_NODE_WEB_PORT="$(ps -e -o command | grep -E "$NODE_SERVER_PROCESS_FLAG [0-9]+" | grep -v forever || true)"

    echo -e "\n\nfound list of node servers (should be one line): \n$CURRENT_NODE_WEB_PORT\n\n"

    CURRENT_NODE_WEB_PORT="$(echo $CURRENT_NODE_WEB_PORT | sed -r 's#^.{50}.*'"$NODE_SERVER_PROCESS_FLAG"' ([0-9]+).*$#\1#g')"

    echo "$CURRENT_NODE_WEB_PORT";

    TEST="^[0-9]+$"

    if [[ $CURRENT_NODE_WEB_PORT =~ $TEST ]]; then
        echo "node port '$CURRENT_NODE_WEB_PORT' match pattern '$TEST'";
    else
        echo -e "docker port should ma '$TEST' \n and it is: '$CURRENT_NODE_WEB_PORT'";
        echo 'assigning default port'
        CURRENT_NODE_WEB_PORT=1
    fi
set +x && echo -e "\n\n        ------ extracting CURRENT_NODE_WEB_PORT -------- ^^^"


echo -e "        ------ picking next node server port -------- vvv\n\n" && set -x
    NEXT_NODE_PORT="$(node docker/deploy/replaceport.js --current $CURRENT_NODE_WEB_PORT --pool $NODE_PORTS)";

    TEST_STRING="$DOCKER_CONTAINER_PREFIX-p$NEXT_DOCKER_WEB_PORT-n$NEXT_NODE_PORT"

    echo $NEXT_NODE_PORT

    TEST="^[0-9]+$"

    if [[ $NEXT_NODE_PORT =~ $TEST ]]; then
        echo "next node server port '$NEXT_NODE_PORT' match pattern '$TEST'";
    else
        echo -e "next node server port should match regexp '$TEST' \n and it is: '$NEXT_NODE_PORT'";
        exit 1;
    fi
set +x && echo -e "\n\n        ------ picking next node server port -------- ^^^"


echo -e "        ------ altering docker/name.conf -------- vvv\n\n" && set -x

    TESTNAME="$DOCKER_CONTAINER_PREFIX$NEXT_DOCKER_WEB_PORT"

    echo "$TESTNAME" > docker/name.conf

    if [ "$(cat docker/name.conf)" != "$TESTNAME" ]; then

        echo "tried to write to 'docker/name.conf', but it seems like it failed..."
    fi

set +x && echo -e "\n\n        ------ altering docker/name.conf -------- ^^^"

echo -e "        ------ changind ports in docker/docker-compose.yml and app/server.config.js -------- vvv\n\n" && set -x
    node docker/deploy/replaceport.js --file docker/docker-compose.yml --replace '/"(\d+):80" # auto /g' --pool $NEXT_DOCKER_WEB_PORT

    node docker/deploy/replaceport.js --file app/server.config.js --replace '/port: (\d+)/g' --pool $NEXT_DOCKER_WEB_PORT
set +x && echo -e "\n\n        ------ changind ports in docker/docker-compose.yml and app/server.config.js -------- ^^^"

# killing mysql and pma container in between might be not needed anymore, because their ports are not exposed to host

echo -e "        --- killing all phpmyadmin containers (the only way to maintain port for pma but don't crash 'docker-compose up') --- vvv\n\n" && set -x
#    LIST=$(docker ps -a --format '{{.Names}}' | grep $DOCKER_CONTAINER_PREFIX | grep 'phpmyadmin\|mysql' || true)
    LIST="$(docker ps -a --format '{{.Names}}' | grep $DOCKER_CONTAINER_PREFIX | grep 'phpmyadmin' || true)"

    if [[ -n $LIST ]]; then
        echo -e "\n\nlist of found phpmyadmin containers:\n$LIST\n\n"
        echo 'before'
        docker ps -a || true
        echo "found and killing phpmyadmin: $LIST"
        docker rm -f $LIST
    else
        echo 'not found phpmyadmin containers to kill'
    fi
    echo -e "\n\ncheck manually if it's true:"
    docker ps -a || true
set +x && echo -e "\n\n        --- killing all phpmyadmin containers (the only way to maintain port for pma but don't crash 'docker-compose up') --- ^^^"

echo -e "        ------ destroying other containers then current working in order to potentionaly free ports -------- vvv\n\n" && set -x
    if [ "$KEEP_BEFORE_UP" == "1" ]; then
        echo "kill all -=REST=- '$DOCKER_CONTAINER_PREFIX' but not '$DOCKER_CONTAINER_PREFIX$CURRENT_DOCKER_WEB_PORT'"
        LIST="$(docker ps -a --format '{{.Names}}' | grep -v "$DOCKER_CONTAINER_PREFIX$CURRENT_DOCKER_WEB_PORT" | grep $DOCKER_CONTAINER_PREFIX || true)"
    else
        echo "kill -=ALL=- '$DOCKER_CONTAINER_PREFIX'"
        LIST="$(docker ps -a --format '{{.Names}}' | grep $DOCKER_CONTAINER_PREFIX || true)"
    #    docker rm -f $(docker ps -a --format '{{.Names}}' | grep -v "$DOCKER_CONTAINER_PREFIX$CURRENT_DOCKER_WEB_PORT" | grep 'phpmyadmin\|mysql')
    fi

    if [[ -n $LIST ]]; then
        echo ".. so killing: $LIST"
        docker rm -f $LIST
    else
        echo 'nothing to kill'
    fi
    echo -e "\n\ncheck manually if it's true:"
    docker ps -a || true
set +x && echo -e "\n\n        ------ destroying other containers then current working in order to potentionaly free ports -------- ^^^"


echo -e "        -- creating & testing new set of containers with prefix: $DOCKER_CONTAINER_PREFIX and web port: $NEXT_DOCKER_WEB_PORT -- vvv\n\n" && set -x
#    make docker-rebuild
    make -s $MAKE_BUILD

    echo "<?php echo '$TEST_STRING';" > php/web/up.php

    cat php/web/up.php

    CURL="curl localhost:$NEXT_DOCKER_WEB_PORT/web/up.php"
    RESULT="$($CURL)"

    if [ "$RESULT" == "$TEST_STRING" ]; then
        echo "php curl test passed..."
    else
        echo "php curl test failed: '$CURL' curl didn't returned '$TEST_STRING'"
        exit 1;
    fi
set +x && echo -e "\n\n        -- creating & testing new set of containers with prefix: $DOCKER_CONTAINER_PREFIX and web port: $NEXT_DOCKER_WEB_PORT -- ^^^"


echo -e "        ------ altering react/hosts.js -------- vvv\n\n" && set -x
    # port: 83 // auto
    node docker/deploy/replaceport.js --file react/hosts.js --replace 'port: (\d+) \/\/ auto/g' --pool $NEXT_NODE_PORT

set +x && echo -e "\n\n        ------ altering react/hosts.js -------- ^^^"

echo -e "        ------ building & launching & testing node server on port: $NEXT_NODE_PORT -------- vvv\n\n" && set -x
    DIR="$(pwd)"
    cd react
        yarn prod
    cd $DIR
    make -s roderic-start

    RESULT="$(curl localhost:$NEXT_NODE_PORT/endpoint/up.php -H "Accept: text/html")"

    if [ "$RESULT" == "$TEST_STRING" ]; then
        echo "php curl test passed..."
    else
        echo "something went wron: php curl didn't returned 'ok php' through node proxy"
        exit 1;
    fi
set +x && echo -e "\n\n        ------ building & launching & testing node server on port: $NEXT_NODE_PORT -------- ^^^"


echo -e "        ------ altering proxy pass to listen on: $NEXT_NODE_PORT & reloading server http -------- vvv\n\n" && set -x

    node docker/deploy/replaceport.js --file $APACHE_CONFIG --replace '/localhost:(\d+)/g' --pool $NEXT_NODE_PORT

    if [ "$RESTART" == "1" ]; then
        # service httpd restart

#        sleep 5

        systemctl reload nginx
    fi

set +x && echo -e "\n\n        ------ altering proxy pass to listen on: $NEXT_NODE_PORT & reloading server http -------- ^^^"


echo -e "        ------ destroying all previous containers -------- vvv\n\n" && set -x
    LIST="$(docker ps -a --format '{{.Names}}' | grep $DOCKER_CONTAINER_PREFIX | grep -v "$DOCKER_CONTAINER_PREFIX$NEXT_DOCKER_WEB_PORT" || true)"

    if [[ -n $LIST ]]; then
        echo -e "\n\nkilling all unused docker containers:\n\n$LIST\n\n"
        docker rm -f $LIST
    else
        echo -e "\n\nnot found unused containers\n\n"
    fi
set +x && echo -e "\n\n        ------ destroying all previous containers -------- ^^^\n\n"

echo -e "        ------ killing all previous node servers -------- vvv\n\n" && set -x

LIST="$(ps aux | grep "$DOCKER_CONTAINER_PREFIX" | grep -v grep | grep -v "$DOCKER_CONTAINER_PREFIX $NEXT_NODE_PORT" | grep -v "$BASENAME" || true)";

PIDS="$(echo -e "$LIST" | awk '{print $2}')";

echo -e "\n\nlist:\n$LIST\n"
echo -e "\n\npids:\n$PIDS\n"

for pid in $PIDS
do
    echo "attempt to kill $pid"
    kill -s 9 $pid && echo 'success' # || echo 'failure' - commented because i want to capture error code
done

set +x

echo -e "\n\n        ------ killing all previous node servers -------- ^^^\n\n"

echo -e "        ------ final docker containers list (all, working and stopped) -------- vvv\n\n"

    echo -e "\n\njust for the record, current list of containers:\n\n"

    docker ps -a

    echo -e "\nvisit:\n    php:  http://localhost:$NEXT_DOCKER_WEB_PORT/web/up.php\n        or\n    node: http://localhost:$NEXT_NODE_PORT/endpoint/up.php\n\n"

echo -e "\n\n        ------ final docker containers list (all, working and stopped) -------- vvv\n\n"







