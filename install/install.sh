#!/bin/bash

VER="v0.0.1"

DIR=react;

GETFILE="$(wget -help &> /dev/null && echo "wget" || echo "curl -LOk")";

GETOUTPUT="$(wget -help &> /dev/null && echo "wget -qO-" || echo "curl -s")"

T="$(date +%Y-%m-%d-%H-%M-%S)"

mkdir -p react/webpack

while read p; do
  echo "-$p-"
done << EOF
$($GETOUTPUT https://raw.githubusercontent.com/stopsopa/webpack3/v0.0.1/install/files.list?$(date +%Y-%m-%d-%H-%M-%S))
EOF

