#!/bin/bash

VER="v0.0.1"

DIR=react;

GETFILE="$(wget -help &> /dev/null && echo "wget" || echo "curl -LOk")";

GETOUTPUT="$(wget -help &> /dev/null && echo "wget -qO-" || echo "curl -s")"

T="$(date +%Y-%m-%d-%H-%M-%S)"

# if react exist stop

mkdir -p react/webpack

echo "";

while read p; do

    EXE="wget https://raw.githubusercontent.com/stopsopa/webpack3/$VER/$p?$T -O $p 1> /dev/null 2> /dev/null"

    $EXE 1> /dev/null 2> /dev/null

    printf "downloading $p - ";

    if [ -f "$p" ]; then printf "success"; else printf "failure"; fi

    echo "";

done << EOF
    $($GETOUTPUT https://raw.githubusercontent.com/stopsopa/webpack3/$VER/install/files.list?$T)
EOF

# test file

STATUS=0;

echo '';
echo '';

if [ "$(cat __check.js)" == "__check.js" ]; then
    printf "\e[92m    installation successful\e[0m";
    rm -rf __check.js
else
    printf "\e[91m    installation failed\e[0m";
    STATUS=1;
fi

cd react

yarn -v 2> /dev/null 1> /dev/null

if [ "$?" == "0" ]; then # yarn
    yarn install
else # npm
    npm install
fi


echo '';
echo '';
echo "Now run one of:";
echo "    npm run dev";
echo "  or";
echo "    npm run prod";
echo "";

exit $STATUS;


