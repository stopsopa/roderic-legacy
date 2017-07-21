#!/bin/bash

# relative path to linked
LINKED="../../public_html/research/005-scss/linked";

# relative path of react directory form within linked directory
PUBLICWEBPACK="../../../../research/005-scss"

SCRIPT="$0"

rm -rf $LINKED

mkdir -p $LINKED

# jumb to linked directory
cd $LINKED

if [ -e "$PUBLICWEBPACK/$SCRIPT" ]; then

    ln -s "%PUBLICWEBPACK%" public

    # other dir for react
    ln -s "$PUBLICWEBPACK/app/react/assets" rassets
else
    echo fix PUBLICWEBPACK path
fi

# return to start directory
cd $PUBLICWEBPACK

cd app
    rm -rf example
    ln -s "dir-to-link" example
cd ..
