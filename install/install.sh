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

    printf "copying $p - ";

    if [ -f "$p" ]; then printf "success"; else printf "failure"; fi

    echo "";

done << EOF
    $($GETOUTPUT https://raw.githubusercontent.com/stopsopa/webpack3/v0.0.1/install/files.list?$T)
EOF

