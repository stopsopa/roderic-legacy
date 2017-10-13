#!/bin/bash

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"
cd $DIR;

cd ..
mkdir installtest
cd installtest

$(wget -help &> /dev/null && echo "wget -qO-" || echo "curl -s") \
https://raw.githubusercontent.com/stopsopa/roderic/v0.0.1/install/install.sh?$(date +%Y-%m-%d-%H-%M-%S) | bash







