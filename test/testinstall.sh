#!/bin/bash

THISFILE=${BASH_SOURCE[0]}
DIR="$( cd "$( dirname "${THISFILE}" )" && pwd -P )"
cd $DIR;

cd ..
mkdir installtest
cd installtest

curl -L https://raw.githubusercontent.com/\
stopsopa/roderic/v0.1.0/install/install.js?$(date +%s) > install.js

node install.js







