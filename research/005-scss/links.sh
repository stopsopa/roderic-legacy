#!/bin/bash

# relative path to linked
LINKED="../../public_html/research/005-scss/linked";

# relative path of react directory form within linked directory
DIRRELATIVE="../../../../research/005-scss"

SCRIPT="$0"

rm -rf $LINKED

mkdir -p $LINKED

# jumb to linked directory
cd $LINKED

if [ -e "$DIRRELATIVE/$SCRIPT" ]; then
    ln -s "$DIRRELATIVE/dir-to-link" example
    ln -s "$DIRRELATIVE/app/react/assets" assets
else
    echo fix DIRRELATIVE path
fi

# return to start directory
cd $DIRRELATIVE
