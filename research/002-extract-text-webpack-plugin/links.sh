#!/bin/bash

rm -rf linked

echo "creating dir 'linked'"
mkdir -p linked

echo "creating symlink 'linked/example'"
cd linked

ln -s ../dir-to-link example

cd ..

if [ -e "linked/example" ]; then
    echo "linked/example exist"
else
    echo "linked/example DOESN'T EXIST"
fi


