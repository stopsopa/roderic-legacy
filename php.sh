#!/bin/bash

# further research: https://github.com/maxpou/docker-symfony

## Examples:
##   /bin/bash php.sh php composer.phar require stopsopa/jms-serializer-lite
##   /bin/bash php.sh bash
##   /bin/bash php.sh php bin/console debug:router
##   /bin/bash php.sh php bin/symfony_requirements
##
##   http://localhost:1025/endpoint/config.php
##     or
##   echo "<?php echo '<pre>'; require(dirname(__FILE__).'/../bin/symfony_requirements');" > php/web/sfr.php
##       curl http://localhost:1025/endpoint/sfr.php
##       /bin/bash php.sh php bin/symfony_requirements
##       rm php/web/sfr.php
##

PWD=$(pwd);
NAME="7.2.1-cli-intl-git"

#        echo -e "\nListing all global variables:\n";
#
#        printenv
#
#        echo -e "\nListing all global variables (posix):\n";
#
#        set -o posix; # https://askubuntu.com/a/275972
#        set

if [ "$(docker images -a | grep $NAME)" == "" ]; then
    cd docker/cli
        docker build -t php:$NAME .
    cd ../..
fi

# -i only instead of -it because of travis-ci: "the input device is not a TTY"

# export TRAVIS_CI=true

if [ "$TRAVIS_CI" == "true" ]; then
#    docker run -i --rm --name phpcli-$(openssl rand -hex 2) -v "$PWD":/usr/src/myapp -w /usr/src/myapp/php php:$NAME $@
    docker run -i --rm \
        --name phpcli-$(openssl rand -hex 2) \
        -v "$PWD":/usr/src/myapp  \
        -v "$PWD/../.composer_cache_directory_to_speed_up_deployments":/root/.composer \
        -w /usr/src/myapp/php php:$NAME $@
else
    docker run -it --rm \
        --name phpcli-$(openssl rand -hex 2) \
        -v "$PWD":/usr/src/myapp \
        -w /usr/src/myapp/php php:$NAME $@
fi

# based on native image (no intl, pdo_mysql and short_open_tag On)
# docker run -it --rm --name phpcli -v "$PWD/php":/usr/src/myapp -w /usr/src/myapp php:7.2.1-cli $@

# for bash on php container
    # /bin/bash php.sh bash
    # if x attribute is assigned
        # ./php.sh bash

# running individual php symfony command
    # /bin/bash php.sh php bin/console arg1 arg2
    # if x attribute is assigned
        # ./php.sh php bin/console arg1 arg2

# to install symfony through docker:
    # ./php.sh bash
    # mkdir -p /usr/local/bin
    # curl -LsS https://symfony.com/installer -o /usr/local/bin/symfony
    # chmod a+x /usr/local/bin/symfony
    # go to directory where you want to install sf
    # symfony new test 3.4
    #
    #

# find php.ini
    # ./php.sh php -i |grep php\.ini
    # short_open_tag = Off

# building image with extensions:
    #
