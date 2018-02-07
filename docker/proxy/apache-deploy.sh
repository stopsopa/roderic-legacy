#!/bin/bash

#   ip address for:
#       - pma 75
#       - php web docker container (pool) 76 78 79
#       - main node server (pool) 90 91 92
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
#       /bin/bash docker/proxy/apache-deploy.sh \
#		    --docker_ports 82 83 84 \
#		    --node_ports 92 93 94 \
#		    --make_build docker-rebuild-prod \
#		    --apache_config_for_proxy_pass_update docker/proxy/apache.conf \
#           --restart_apache 1
#       WARNING: be careful to choose different port from declared in any docker-compose*.yml files :WARNING
#
#   [prod]
#       add --restart_apache 1     flag to command running apache-deploy.sh in Makefile
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


# @todo
# protect pma (basic auth) (done)
# expose mysql db files to host machine (done)
# describe step by step what to do (done)
# param with apache config to change (done)

echo -e "\n\n\n WARNING run this script only through 'make deploy' WARNING\n\n"

# /bin/bash docker/proxy/apache-deploy.sh --docker_ports 82 83 84 --node_ports 92 93 94 --make_build docker-rebuild-prod --restart_apache 1

echo "------ processing parameters -------- vvv"

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

            if [ "$CURRENT" == "--apache_config_for_proxy_pass_update" ]; then
                APACHE_CONFIG="$arg"
            fi

            if [ "$CURRENT" == "--restart_apache" ]; then
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

    echo "checking parameters"
    declare -p DOCKER_PORTS_ARRAY;
    declare -p NODE_PORTS_ARRAY;

    if [ "${#DOCKER_PORTS_ARRAY[@]}" -lt 2 ]; then

        echo -e "--docker_ports should provide 2 or more ports"

        exit 1
    fi

    if [ "${#NODE_PORTS_ARRAY[@]}" -lt 2 ]; then

        echo -e "--node_ports should provide 2 or more ports"

        exit 1
    fi

    if [[ -z $MAKE_BUILD ]]; then

        echo -e "Specify please make build command (in --make_build parameter)"

        exit 1
    fi

    if [[ -z $APACHE_CONFIG ]]; then

        echo -e "Specify config file to alter proxypass (in --apache_config_for_proxy_pass_update parameter)"

        exit 1
    fi

    if [ ! -e "$APACHE_CONFIG" ]; then

        echo -e "File '$APACHE_CONFIG' doesn't exist"

        exit 1
    fi
echo "------ processing parameters -------- ^^^"


echo "------ testing gnu sed & forever -------- vvv"
    # echo run sed test
    echo 'test' | sed -r 's#test##g'

    if [ "$?" != "0" ]; then

        echo -e "\n\nGnu 'sed' is not available. Please run: \n    brew install --with-default-names gnu-sed\n    ... and restart shell\n\n"

        exit 1
    fi

    forever -v | head -n 10

    if [ "$?" != "0" ]; then

        echo -e "\n\nforever is not available. Please run: \n    forever -v\n\n"

        exit 1
    fi
echo "------ testing gnu sed & forever -------- ^^^"

set -e

set -o xtrace

#THISFILE=${BASH_SOURCE[0]}
#DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"
#cd $DIR;

# extract just first part
echo "------ extracting docker prefix -------- vvv"
DOCKER_CONTAINER_PREFIX=$(cat docker/name.conf | sed -E 's#^([a-z_]+).*#\1#g')

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
echo "------ extracting docker prefix -------- ^^^"


echo "------ extracting current (if up) docker web port -------- vvv"
    CURRENT_DOCKER_WEB_PORT=$(docker ps --format '{{.Names}}' | grep $DOCKER_CONTAINER_PREFIX | head -n 1 | sed -r 's#[a-z_]+([0-9]+).+#\1#g');

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
echo "------ extracting current (if up) docker web port -------- ^^^"


echo "------ picking next docker port -------- vvv"
NEXT_DOCKER_WEB_PORT=$(node docker/proxy/replaceport.js --next $CURRENT_DOCKER_WEB_PORT --pool $DOCKER_PORTS);
echo "------ picking next docker port -------- ^^^"


echo "------ fetching NODE_SERVER_PROCESS_FLAG -------- vvv"
    NODE_SERVER_PROCESS_FLAG=$(make flag)

    echo $NODE_SERVER_PROCESS_FLAG
echo "------ fetching NODE_SERVER_PROCESS_FLAG -------- ^^^"


echo "------ extracting CURRENT_NODE_WEB_PORT -------- vvv"
    CURRENT_NODE_WEB_PORT=$(ps aux | grep $NODE_SERVER_PROCESS_FLAG | grep -v grep | head -n 1 || true)

    CURRENT_NODE_WEB_PORT=$(echo $CURRENT_NODE_WEB_PORT | sed -r 's#^.{50}.*'"$NODE_SERVER_PROCESS_FLAG"' ([0-9]+).*$#\1#g')

    TEST="^[0-9]+$"

    if [[ $CURRENT_NODE_WEB_PORT =~ $TEST ]]; then
        echo "node port '$CURRENT_NODE_WEB_PORT' match pattern '$TEST'";
    else
        echo -e "docker port should ma '$TEST' \n and it is: '$CURRENT_NODE_WEB_PORT'";
        echo 'assigning default port'
        CURRENT_NODE_WEB_PORT=1
    fi
echo "------ extracting CURRENT_NODE_WEB_PORT -------- ^^^"


echo "------ picking next node server port -------- vvv"
    NEXT_NODE_PORT=$(node docker/proxy/replaceport.js --next $CURRENT_NODE_WEB_PORT --pool $NODE_PORTS);

    TEST_STRING="$DOCKER_CONTAINER_PREFIX-p$NEXT_DOCKER_WEB_PORT-n$NEXT_NODE_PORT"

    echo $NEXT_NODE_PORT
echo "------ picking next node server port -------- ^^^"


echo "------ altering docker/name.conf -------- vvv"
    echo "$DOCKER_CONTAINER_PREFIX$NEXT_DOCKER_WEB_PORT" > docker/name.conf

    cat docker/name.conf
echo "------ altering docker/name.conf -------- ^^^"

echo "------ changind ports in docker/docker-compose.yml and app/server.config.js -------- vvv"
    node docker/proxy/replaceport.js --file docker/docker-compose.yml --replace '/"(\d+):80" # auto /g' --pool $NEXT_DOCKER_WEB_PORT

    node docker/proxy/replaceport.js --file app/server.config.js --replace '/port: (\d+)/g' --pool $NEXT_DOCKER_WEB_PORT
echo "------ changind ports in docker/docker-compose.yml and app/server.config.js -------- ^^^"

# killing mysql and pma container in between might be not needed anymore, because their ports are not exposed to host

echo "--- killing all phpmyadmin containers (then only way to maintain port for pma but don't crash 'docker-compose up') --- vvv"
#    LIST=$(docker ps -a --format '{{.Names}}' | grep $DOCKER_CONTAINER_PREFIX | grep 'phpmyadmin\|mysql' || true)
    LIST=$(docker ps -a --format '{{.Names}}' | grep $DOCKER_CONTAINER_PREFIX | grep 'phpmyadmin' || true)

    echo -e $LIST

    echo 'before'
    docker ps -a || true

    if [[ -n $LIST ]]; then
        echo "found and killing phpmyadmin: $LIST"
        docker rm -f $LIST
    else
        echo 'not found phpmyadmin containers to kill'
    fi
    echo 'after'
    docker ps -a || true
echo "--- killing all phpmyadmin containers (then only way to maintain port for pma but don't crash 'docker-compose up') --- ^^^"

echo "------ destroying other containers then current working in order to potentionaly free ports -------- vvv"
    if [ "$KEEP_BEFORE_UP" == "1" ]; then
        echo "kill all -=REST=- '$DOCKER_CONTAINER_PREFIX' but not '$DOCKER_CONTAINER_PREFIX$CURRENT_DOCKER_WEB_PORT'"
        LIST=$(docker ps -a --format '{{.Names}}' | grep -v "$DOCKER_CONTAINER_PREFIX$CURRENT_DOCKER_WEB_PORT" | grep $DOCKER_CONTAINER_PREFIX || true)
    else
        echo "kill -=ALL=- '$DOCKER_CONTAINER_PREFIX'"
        LIST=$(docker ps -a --format '{{.Names}}' | grep $DOCKER_CONTAINER_PREFIX || true)
    #    docker rm -f $(docker ps -a --format '{{.Names}}' | grep -v "$DOCKER_CONTAINER_PREFIX$CURRENT_DOCKER_WEB_PORT" | grep 'phpmyadmin\|mysql')
    fi

    if [[ -n $LIST ]]; then
        echo ".. so killing: $LIST"
        docker rm -f $LIST
    else
        echo 'nothing to kill'
    fi
echo "------ destroying other containers then current working in order to potentionaly free ports -------- ^^^"


echo "-- creating & testing new set of containers with prefix: $DOCKER_CONTAINER_PREFIX and web port: $NEXT_DOCKER_WEB_PORT -- vvv"
#    make docker-rebuild
    make $MAKE_BUILD

    echo "<?php echo '$TEST_STRING';" > php/web/up.php

    cat php/web/up.php

    CURL="curl localhost:$NEXT_DOCKER_WEB_PORT/web/up.php"
    RESULT=$($CURL)

    if [ "$RESULT" == "$TEST_STRING" ]; then
        echo "php curl test passed..."
    else
        echo "php curl test failed: '$CURL' curl didn't returned '$TEST_STRING'"
        exit 1;
    fi
echo "-- creating & testing new set of containers with prefix: $DOCKER_CONTAINER_PREFIX and web port: $NEXT_DOCKER_WEB_PORT -- ^^^"

echo "------ altering react/hosts.js -------- vvv"
    # port: 83 // auto
    node docker/proxy/replaceport.js --file react/hosts.js --replace 'port: (\d+) \/\/ auto/g' --pool $NEXT_NODE_PORT

echo "------ altering react/hosts.js -------- ^^^"

echo "------ building & launching & testing node server on port: $NEXT_NODE_PORT -------- vvv"
    DIR=$(pwd)
    cd react
        yarn prod
    cd $DIR
    make start

    CURL="curl localhost:$NEXT_NODE_PORT/endpoint/up.php"
    RESULT=$($CURL)

    if [ "$RESULT" == "$TEST_STRING" ]; then
        echo "php curl test passed..."
    else
        echo "something went wron: php curl didn't returned 'ok php' through node proxy"
        exit 1;
    fi
echo "------ building & launching & testing node server on port: $NEXT_NODE_PORT -------- ^^^"


echo "------ altering proxy pass to listen on: $NEXT_NODE_PORT & reloading apache -------- vvv"

    node docker/proxy/replaceport.js --file $APACHE_CONFIG --replace '/localhost:(\d+)/g' --pool $NEXT_NODE_PORT

    if [ "$RESTART" == "1" ]; then
        service httpd restart
    fi

echo "------ altering proxy pass to listen on: $NEXT_NODE_PORT & reloading apache -------- ^^^"

echo "------ destroying all previous containers -------- vvv"
    LIST=$(docker ps -a --format '{{.Names}}' | grep $DOCKER_CONTAINER_PREFIX | grep -v "$DOCKER_CONTAINER_PREFIX$NEXT_DOCKER_WEB_PORT" || true)

    if [[ -n $LIST ]]; then
        echo "killing all unused docker containers: $LIST"
        docker rm -f $LIST
    else
        echo 'not found unused containers'
    fi
echo "------ destroying all previous containers -------- vvv"


echo "------ final docker container list (all, working and stopped) -------- vvv"

    echo -e "just for the record, current list of containers:\n"

    docker ps -a || true

    echo -e "\nvisit:\n    http://localhost:$NEXT_DOCKER_WEB_PORT/web/up.php\n        or\n    http://localhost:$NEXT_NODE_PORT/endpoint/up.php\n\n"

echo "------ final docker container list (all, working and stopped) -------- vvv"











