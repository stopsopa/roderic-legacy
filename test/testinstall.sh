#!/bin/bash

set -e
set -o xtrace

if [ $# -lt 6 ] ; then
    echo "not enough arguments";
    echo -e "run:\n/bin/bash $0 targetdirectory v0.1.0 reactdir webdir app" '"--root=.. --app_name=test-app --jwtsecret=secret"';
    exit 0;
fi

DIRECTORY="$1";
VER="$2"
REACTDIR="$3"
WEBDIR="$4"
APPDIR="$5"
RESTARGS="$6"

export WEBPACK_WEBDIR="$WEBDIR"
export WEBPACK_REACTDIR="$REACTDIR"

echo "========== TESTING INSTALLATOR $VER --react_dir=$REACTDIR --web_dir=$WEBDIR --app_dir=$APPDIR =========";

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"
cd $DIR;


cd ..
mkdir $DIRECTORY
cd $DIRECTORY

curl -L https://raw.githubusercontent.com/stopsopa/roderic/$VER/install/install.js?$(date +%s) > install.js
echo "-$?-"

# node install.js --app_dir=app --react_dir=react --web_dir=docs --root=".." --app_name=test-app --jwtsecret=secret
node install.js --react_dir=$REACTDIR --web_dir=$WEBDIR --app_dir=$APPDIR --version=$VER $RESTARGS
echo "-$?-"

rm install.js
echo "-$?-"

# preparing tests scripts
cp -Rv ../test ./test
echo "-$?-"
rm -rf ./test/jest
echo "-$?-"
pwd
echo "-$?-"
rm -rf ./$APPDIR/other
echo "-$?-"
cp -Rv ../app/other ./$APPDIR/other
echo "-$?-"
cp -Rv ../dir-to-link ./dir-to-link
echo "-$?-"
cp ../package.json .
echo "-$?-"
cp ../yarn.lock .
echo "-$?-"
yarn
echo "-$?-"
cd $REACTDIR
echo "-$?-"
yarn
echo "-$?-"
cd ..
echo "-$?-"

echo "--- testing in dev mode ---"
echo "-$?-"
rm -rf $WEBDIR/dist/
echo "-$?-"
cd $REACTDIR
echo "-$?-"
yarn devnowatch

cd ../
echo "-$?-"
ls -la $WEBDIR/
echo "-$?-"
ls -la $WEBDIR/dist/
echo "-$?-"
cd $REACTDIR
echo "-$?-"
sudo kill -9 $(ps aux | grep "index.js" | grep -v grep | head -1 | awk '{print $2}') || echo 'not 0'
echo "-$?-"
sudo kill -9 $(ps aux | grep "index.js" | grep -v grep | head -1 | awk '{print $2}') || echo 'not 0'
echo "-$?-"
node servers/index.js 1>> logdev.log 2>> logdev.log & disown
echo "-$?-"
sleep 2
echo "-$?-"
cat logdev.log
echo "-$?-"
cd ..
echo "-$?-"
export WEBPACK_MODE=dev
echo "-$?-"
echo $WEBPACK_MODE
echo "-$?-"
yarn test
echo "-$?-"
ls -la $WEBDIR/dist/
echo "-$?-"


echo "--- testing in prod mode ---"
echo "-$?-"
rm -rf $WEBDIR/dist/
echo "-$?-"
cd $REACTDIR
echo "-$?-"
yarn prod

cd ../
echo "-$?-"
ls -la $WEBDIR/
echo "-$?-"
ls -la $WEBDIR/dist/
echo "-$?-"
cd $REACTDIR
echo "-$?-"

sudo kill -9 $(ps aux | grep "index.js" | grep -v grep | head -1 | awk '{print $2}') || echo 'not 0'
echo "-$?-"
sudo kill -9 $(ps aux | grep "index.js" | grep -v grep | head -1 | awk '{print $2}') || echo 'not 0'
echo "-$?-"
node servers/index.js 1>> logprod.log 2>> logprod.log & disown
echo "-$?-"
sleep 2
echo "-$?-"
cat logprod.log
echo "-$?-"
cd ..
echo "-$?-"
export WEBPACK_MODE=prod
echo "-$?-"
echo $WEBPACK_MODE
echo "-$?-"
yarn test
echo "-$?-"
ls -la $WEBDIR/dist/
echo "-$?-"

# go back where started
cd ..
echo "-$?-"




